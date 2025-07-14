import OpenAI from "openai";
import { format, addDays, subDays, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AppointmentData {
  id: number;
  date: string;
  time: string;
  duration: number;
  clientName: string;
  serviceName: string;
  price: number;
  status: string;
}

interface ClientBehavior {
  id: number;
  name: string;
  totalAppointments: number;
  noShowCount: number;
  cancelCount: number;
  avgDaysBetweenVisits: number;
  lastVisit: Date;
  totalSpent: number;
  preferredTimeSlots: string[];
}

export class AIService {
  // Smart Planning - Optimisation des créneaux
  async optimizeDailySchedule(appointments: AppointmentData[], date: string) {
    try {
      const prompt = `
Analysez ce planning de salon de beauté pour le ${date} et suggérez des optimisations:

Planning actuel:
${appointments.map(apt => `${apt.time} - ${apt.serviceName} (${apt.duration}min) - ${apt.clientName} - ${apt.price}€`).join('\n')}

Objectifs:
1. Minimiser les trous dans le planning
2. Maximiser le chiffre d'affaires
3. Respecter les préférences horaires clients
4. Optimiser les transitions entre services

Répondez en JSON avec cette structure:
{
  "optimizations": [
    {
      "type": "move_appointment",
      "appointmentId": number,
      "newTime": "HH:mm",
      "reason": "raison de l'optimisation"
    }
  ],
  "gapsReduced": number,
  "revenueIncrease": number,
  "confidence": number
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur optimisation planning:", error);
      return { optimizations: [], gapsReduced: 0, revenueIncrease: 0, confidence: 0 };
    }
  }

  // Prédiction No-Show avec facteurs multiples
  async predictNoShowRisk(appointment: AppointmentData, clientBehavior: ClientBehavior, weather?: string) {
    try {
      const prompt = `
Analysez le risque de no-show pour ce rendez-vous:

Rendez-vous:
- Date: ${appointment.date}
- Heure: ${appointment.time}
- Service: ${appointment.serviceName}
- Prix: ${appointment.price}€
- Client: ${appointment.clientName}

Historique client:
- Nombre total RDV: ${clientBehavior.totalAppointments}
- No-shows passés: ${clientBehavior.noShowCount}
- Annulations: ${clientBehavior.cancelCount}
- Dernière visite: ${format(clientBehavior.lastVisit, 'dd/MM/yyyy', { locale: fr })}
- Dépense totale: ${clientBehavior.totalSpent}€
- Créneaux préférés: ${clientBehavior.preferredTimeSlots.join(', ')}

${weather ? `Météo prévue: ${weather}` : ''}

Calculez le score de risque (0-1) en considérant:
- Historique no-show/annulation du client
- Délai entre réservation et RDV
- Météo défavorable
- Heure du RDV vs préférences
- Jour de la semaine
- Prix du service

Répondez en JSON:
{
  "riskScore": number,
  "confidence": number,
  "factors": [
    {"factor": "nom du facteur", "impact": number, "description": "explication"}
  ],
  "recommendations": [
    {"action": "action suggérée", "priority": "high|medium|low"}
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur prédiction no-show:", error);
      return { riskScore: 0, confidence: 0, factors: [], recommendations: [] };
    }
  }

  async predictCancellationRisk(appointment: AppointmentData, clientBehavior: ClientBehavior, appointmentHistory: any[]) {
    try {
      // Analyse l'historique d'annulations du client
      const cancellations = appointmentHistory.filter(h => h.actionType === 'cancelled');
      const totalAppointments = appointmentHistory.length || 1;
      const cancellationRate = cancellations.length / totalAppointments;
      
      // Analyse les patterns d'annulation
      const cancellationPatterns = this.analyzeCancellationPatterns(cancellations, appointment);
      
      // Facteurs de risque
      const riskFactors = [];
      let riskScore = 0;
      
      // 1. Taux d'annulation historique (30% du score)
      const historicalRisk = cancellationRate * 0.3;
      riskScore += historicalRisk;
      if (cancellationRate > 0.2) riskFactors.push(`Taux d'annulation élevé: ${(cancellationRate * 100).toFixed(1)}%`);
      
      // 2. Pattern temporel (25% du score)
      const dayOfWeek = new Date(appointment.date).getDay();
      const timeHour = parseInt(appointment.time.split(':')[0]);
      const temporalRisk = this.calculateTemporalRisk(cancellations, dayOfWeek, timeHour);
      riskScore += temporalRisk * 0.25;
      if (temporalRisk > 0.5) riskFactors.push('Créneau à risque selon l\'historique');
      
      // 3. Délai moyen d'annulation (20% du score)
      const avgCancelDays = cancellations.reduce((sum, c) => sum + (c.daysBeforeAppointment || 0), 0) / (cancellations.length || 1);
      const delayRisk = Math.max(0, (7 - avgCancelDays) / 7); // Plus le délai est court, plus le risque est élevé
      riskScore += delayRisk * 0.2;
      if (avgCancelDays < 2) riskFactors.push('Annulations habituellement tardives');
      
      // 4. Fréquence récente (15% du score)
      const recentCancellations = cancellations.filter(c => {
        const cancelDate = new Date(c.actionDate);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return cancelDate > threeMonthsAgo;
      });
      const recentRisk = Math.min(recentCancellations.length / 3, 1);
      riskScore += recentRisk * 0.15;
      if (recentCancellations.length >= 2) riskFactors.push('Annulations récentes multiples');
      
      // 5. Fidélité du client (10% du score inversé)
      const loyaltyScore = Math.min(clientBehavior.totalSpent / 500, 1); // Clients dépensant plus sont plus fidèles
      riskScore += (1 - loyaltyScore) * 0.1;
      if (loyaltyScore < 0.3) riskFactors.push('Client peu fidèle');
      
      // Limiter le score entre 0 et 1
      riskScore = Math.min(Math.max(riskScore, 0), 1);
      
      // Déterminer l'action recommandée
      let recommendedAction = 'none';
      if (riskScore > 0.7) {
        recommendedAction = 'deposit_required';
      } else if (riskScore > 0.5) {
        recommendedAction = 'reminder_call';
      } else if (riskScore > 0.3) {
        recommendedAction = 'confirmation_sms';
      }
      
      return {
        predictionScore: riskScore,
        confidence: Math.min(0.9, 0.5 + (totalAppointments / 20)), // Plus d'historique = plus de confiance
        riskFactors,
        recommendedAction,
        reasoning: `Analyse basée sur ${totalAppointments} rendez-vous historiques, ${cancellations.length} annulations identifiées`
      };
      
    } catch (error) {
      console.error('Erreur prédiction annulation:', error);
      // Fallback simplifié
      const cancellationRate = clientBehavior.cancelCount / Math.max(clientBehavior.totalAppointments, 1);
      return {
        predictionScore: Math.min(cancellationRate * 1.5, 1),
        confidence: 0.6,
        riskFactors: cancellationRate > 0.2 ? ['Historique d\'annulations'] : [],
        recommendedAction: cancellationRate > 0.4 ? 'reminder_call' : 'none',
        reasoning: 'Analyse simplifiée basée sur le taux d\'annulation global'
      };
    }
  }

  private analyzeCancellationPatterns(cancellations: any[], appointment: AppointmentData) {
    const patterns = {
      preferredCancelDays: {},
      preferredCancelTimes: {},
      commonReasons: {}
    };
    
    cancellations.forEach(cancel => {
      // Jours de la semaine où le client annule le plus
      if (cancel.dayOfWeek) {
        patterns.preferredCancelDays[cancel.dayOfWeek] = (patterns.preferredCancelDays[cancel.dayOfWeek] || 0) + 1;
      }
      
      // Créneaux horaires problématiques
      if (cancel.timeSlot) {
        patterns.preferredCancelTimes[cancel.timeSlot] = (patterns.preferredCancelTimes[cancel.timeSlot] || 0) + 1;
      }
      
      // Raisons d'annulation récurrentes
      if (cancel.cancelReason) {
        patterns.commonReasons[cancel.cancelReason] = (patterns.commonReasons[cancel.cancelReason] || 0) + 1;
      }
    });
    
    return patterns;
  }

  private calculateTemporalRisk(cancellations: any[], dayOfWeek: number, timeHour: number): number {
    if (cancellations.length === 0) return 0;
    
    let riskScore = 0;
    
    // Risque basé sur le jour de la semaine
    const dayRisk = cancellations.filter(c => c.dayOfWeek === dayOfWeek).length / cancellations.length;
    riskScore += dayRisk * 0.6;
    
    // Risque basé sur la tranche horaire
    let timeSlot = 'morning';
    if (timeHour >= 12 && timeHour < 17) timeSlot = 'afternoon';
    else if (timeHour >= 17) timeSlot = 'evening';
    
    const timeRisk = cancellations.filter(c => c.timeSlot === timeSlot).length / cancellations.length;
    riskScore += timeRisk * 0.4;
    
    return Math.min(riskScore, 1);
  }

  // Assistant rebooking automatique
  async generateRebookingSuggestions(clients: ClientBehavior[], businessData: any) {
    try {
      const inactiveClients = clients.filter(client => {
        const daysSinceLastVisit = Math.floor((Date.now() - client.lastVisit.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceLastVisit > client.avgDaysBetweenVisits * 1.5;
      });

      const prompt = `
Analysez ces clients inactifs et générez des stratégies de rebooking personnalisées:

Clients à recontacter:
${inactiveClients.map(client => `
- ${client.name}: ${client.totalAppointments} RDV, ${client.totalSpent}€ dépensés, dernière visite il y a ${Math.floor((Date.now() - client.lastVisit.getTime()) / (1000 * 60 * 60 * 24))} jours
  Créneaux préférés: ${client.preferredTimeSlots.join(', ')}
`).join('\n')}

Données salon:
- Services populaires: ${businessData.topServices?.map((s: any) => s.serviceName).join(', ') || 'Non disponible'}
- Créneaux avec disponibilités: ${businessData.availableSlots || 'Non disponible'}

Pour chaque client, suggérez:
1. Message de rebooking personnalisé
2. Offre spéciale si nécessaire
3. Créneaux suggérés
4. Probabilité de conversion

Répondez en JSON:
{
  "suggestions": [
    {
      "clientId": number,
      "clientName": "string",
      "message": "message personnalisé",
      "offer": "offre spéciale ou null",
      "suggestedSlots": ["créneaux"],
      "conversionProbability": number,
      "priority": "high|medium|low"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur suggestions rebooking:", error);
      return { suggestions: [] };
    }
  }

  // 🎯 IA POUR L'ENTREPRENEUR - ASSISTANT COMMERCIAL INTELLIGENT
  async analyzeClientTrends(clientData: any[], services: any[]) {
    try {
      const prompt = `
Analysez les tendances clients et suggérez de nouveaux services rentables:

Données clients:
${clientData.map(client => `
- ${client.name}: ${client.totalAppointments} RDV, ${client.totalSpent}€, services: ${client.favoriteServices?.join(', ') || 'Non spécifié'}
`).join('\n')}

Services actuels:
${services.map(service => `- ${service.name}: ${service.price}€, demande: ${service.bookingCount || 0}`).join('\n')}

Analysez et proposez:
1. Nouveaux services tendances à introduire
2. Services sous-utilisés à promouvoir
3. Créneaux de prix optimaux
4. Clients cibles pour chaque service

Répondez en JSON:
{
  "newServices": [
    {
      "name": "string",
      "suggestedPrice": number,
      "demand": "high|medium|low",
      "targetClients": ["noms"],
      "reasoning": "justification"
    }
  ],
  "underutilizedServices": [
    {
      "serviceName": "string",
      "currentDemand": number,
      "promotionSuggestion": "string",
      "targetSegment": "string"
    }
  ],
  "pricingOptimization": [
    {
      "serviceName": "string",
      "currentPrice": number,
      "suggestedPrice": number,
      "expectedImpact": "string"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur analyse tendances:", error);
      return { newServices: [], underutilizedServices: [], pricingOptimization: [] };
    }
  }

  // Pricing dynamique selon demande et saison
  async generateDynamicPricing(services: any[], seasonalData: any, demandData: any) {
    try {
      const prompt = `
Analysez la demande et proposez des prix dynamiques pour optimiser la rentabilité:

Services actuels:
${services.map(service => `- ${service.name}: ${service.price}€, réservations/mois: ${service.monthlyBookings || 0}`).join('\n')}

Données saisonnières:
- Saison actuelle: ${seasonalData.currentSeason || 'Non spécifié'}
- Tendances: ${seasonalData.trends || 'Non spécifié'}

Données de demande:
- Pics de demande: ${demandData.peakHours || 'Non spécifié'}
- Jours populaires: ${demandData.popularDays || 'Non spécifié'}

Calculez des prix optimaux avec:
1. Coefficients saisonniers
2. Prix différenciés par créneaux
3. Promotions ciblées
4. Stratégie de yield management

Répondez en JSON:
{
  "dynamicPricing": [
    {
      "serviceName": "string",
      "basePrice": number,
      "peakHourPrice": number,
      "offPeakPrice": number,
      "seasonalMultiplier": number,
      "promotionalPrice": number,
      "validityPeriod": "string"
    }
  ],
  "revenueImpact": {
    "estimatedIncrease": number,
    "confidence": number
  }
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur pricing dynamique:", error);
      return { dynamicPricing: [], revenueImpact: { estimatedIncrease: 0, confidence: 0 } };
    }
  }

  // Détection clients à risque de départ
  async identifyChurnRisk(clients: ClientBehavior[]) {
    try {
      const prompt = `
Analysez ces clients et identifiez ceux à risque de départ:

${clients.map(client => `
Client: ${client.name}
- Dernière visite: ${client.lastVisit.toLocaleDateString()}
- Fréquence moyenne: ${client.avgDaysBetweenVisits} jours
- Total dépensé: ${client.totalSpent}€
- Nombre d'annulations: ${client.cancelCount}
- Rendez-vous total: ${client.totalAppointments}
`).join('\n')}

Identifiez les signaux d'alerte:
1. Espacement anormal entre visites
2. Baisse de fréquence
3. Réduction du panier moyen
4. Augmentation des annulations

Répondez en JSON:
{
  "churnRisks": [
    {
      "clientId": number,
      "clientName": "string",
      "riskScore": number,
      "riskFactors": ["facteurs"],
      "retentionStrategy": "string",
      "urgency": "high|medium|low",
      "suggestedActions": ["actions"]
    }
  ],
  "overallChurnRate": number
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur détection churn:", error);
      return { churnRisks: [], overallChurnRate: 0 };
    }
  }

  // 🎨 IA POUR LE CLIENT - CONSEILLER BEAUTÉ VIRTUEL
  async analyzePhotoForRecommendations(photoBase64: string, clientProfile: any) {
    try {
      const prompt = `
Analysez cette photo et le profil client pour recommander des services adaptés:

Profil client:
- Âge: ${clientProfile.age || 'Non spécifié'}
- Préférences: ${clientProfile.preferences || 'Non spécifié'}
- Historique: ${clientProfile.serviceHistory || 'Non spécifié'}
- Budget moyen: ${clientProfile.averageSpend || 'Non spécifié'}€

Analysez la photo pour:
1. Type et couleur des cheveux
2. Forme du visage
3. Teint de peau
4. Style actuel

Recommandez:
- Services adaptés (coupe, couleur, soins)
- Produits complémentaires
- Conseils personnalisés

Répondez en JSON:
{
  "analysis": {
    "hairType": "string",
    "faceShape": "string",
    "skinTone": "string",
    "currentStyle": "string"
  },
  "recommendations": [
    {
      "service": "string",
      "reasoning": "string",
      "priority": "high|medium|low",
      "estimatedPrice": number
    }
  ],
  "productSuggestions": [
    {
      "product": "string",
      "benefit": "string",
      "price": number
    }
  ],
  "personalizedTips": ["conseils"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${photoBase64}` }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur analyse photo:", error);
      return { analysis: {}, recommendations: [], productSuggestions: [], personalizedTips: [] };
    }
  }

  // Suggestions de looks selon tendances
  async suggestTrendyLooks(clientProfile: any, currentTrends: any[]) {
    try {
      const prompt = `
Suggérez des looks tendances adaptés à ce profil client:

Profil:
- Âge: ${clientProfile.age}
- Style: ${clientProfile.style || 'Non spécifié'}
- Morphologie: ${clientProfile.faceShape || 'Non spécifié'}
- Lifestyle: ${clientProfile.lifestyle || 'Non spécifié'}

Tendances actuelles:
${currentTrends.map(trend => `- ${trend.name}: ${trend.description}`).join('\n')}

Proposez des looks:
1. Adaptés à la morphologie
2. Alignés avec les tendances
3. Réalisables selon le budget
4. Appropriés au lifestyle

Répondez en JSON:
{
  "suggestedLooks": [
    {
      "name": "string",
      "description": "string",
      "services": ["liste des services"],
      "totalCost": number,
      "difficulty": "easy|medium|hard",
      "maintenanceLevel": "low|medium|high",
      "trendAlignment": number,
      "suitabilityScore": number
    }
  ],
  "trendsExplanation": "string"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.5
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur suggestions looks:", error);
      return { suggestedLooks: [], trendsExplanation: "" };
    }
  }

  // 🚀 IA TRANSVERSE - DÉTECTION D'INSIGHTS BUSINESS
  async detectBusinessOpportunities(analyticsData: any) {
    try {
      const prompt = `
Analysez ces données complètes et identifiez les opportunités business:

Données analytiques:
- CA mensuel: ${analyticsData.monthRevenue || 0}€
- Services populaires: ${analyticsData.topServices?.map((s: any) => `${s.name} (${s.count})`).join(', ') || 'Non disponible'}
- Créneaux les plus demandés: ${analyticsData.peakHours || 'Non disponible'}
- Taux de fidélisation: ${analyticsData.retentionRate || 0}%
- Panier moyen: ${analyticsData.averageBasket || 0}€

Identifiez:
1. Services les plus rentables
2. Opportunités de cross-selling
3. Créneaux sous-exploités
4. Segments clients à développer
5. Prédictions saisonnières

Répondez en JSON:
{
  "profitableServices": [
    {
      "serviceName": "string",
      "profitMargin": number,
      "demand": "high|medium|low",
      "growth": number
    }
  ],
  "crossSellingOpportunities": [
    {
      "primaryService": "string",
      "complementaryServices": ["services"],
      "conversionRate": number,
      "revenueImpact": number
    }
  ],
  "underutilizedSlots": [
    {
      "timeSlot": "string",
      "utilizationRate": number,
      "suggestions": ["actions"]
    }
  ],
  "seasonalPredictions": [
    {
      "period": "string",
      "expectedDemand": "high|medium|low",
      "recommendedActions": ["actions"]
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur détection opportunités:", error);
      return { profitableServices: [], crossSellingOpportunities: [], underutilizedSlots: [], seasonalPredictions: [] };
    }
  }

  // Business Copilot - Suggestions promotions et insights
  async generateBusinessInsights(analyticsData: any) {
    try {
      const prompt = `
Analysez ces données d'activité et générez des insights business avec suggestions de promotions:

Données analytiques:
- CA ce mois: ${analyticsData.monthRevenue || 0}€
- CA mois dernier: ${analyticsData.lastMonthRevenue || 0}€
- Nombre de clients: ${analyticsData.totalClients || 0}
- Services les plus vendus: ${analyticsData.topServices?.map((s: any) => `${s.serviceName} (${s.count} fois)`).join(', ') || 'Non disponible'}
- Taux d'occupation moyen: ${analyticsData.occupancyRate || 0}%
- Jours de faible affluence: ${analyticsData.lowTrafficDays?.join(', ') || 'Non disponible'}
- Segments clients: ${JSON.stringify(analyticsData.clientSegments || {})}

Générez:
1. Insights comportementaux clients
2. Suggestions de promotions ciblées
3. Optimisations opérationnelles
4. Prévisions et recommandations stratégiques

Répondez en JSON:
{
  "insights": [
    {
      "category": "behavioral|operational|financial",
      "title": "titre insight",
      "description": "description détaillée",
      "impact": "high|medium|low"
    }
  ],
  "promotions": [
    {
      "title": "titre promotion",
      "description": "description",
      "targetSegment": "segment ciblé",
      "expectedImpact": "impact attendu",
      "conditions": "conditions d'application",
      "duration": "durée suggérée",
      "estimatedROI": number
    }
  ],
  "recommendations": [
    {
      "category": "planning|marketing|service",
      "action": "action recommandée",
      "reasoning": "justification",
      "priority": "high|medium|low",
      "estimatedImpact": "impact estimé"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.5
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur insights business:", error);
      return { insights: [], promotions: [], recommendations: [] };
    }
  }

  // Analyse sentiment client pour rebooking
  async analyzeClientSentiment(clientHistory: any[]) {
    try {
      const prompt = `
Analysez le sentiment et la satisfaction de ce client basé sur son historique:

Historique:
${clientHistory.map(h => `- ${h.date}: ${h.service} - Notes: "${h.notes || 'Aucune'}" - Note: ${h.rating || 'Non notée'}/5`).join('\n')}

Évaluez:
1. Niveau de satisfaction général
2. Évolution du sentiment
3. Signes de risque de départ
4. Opportunités d'upsell

Répondez en JSON:
{
  "satisfactionScore": number,
  "sentimentTrend": "improving|stable|declining",
  "churnRisk": number,
  "loyaltyScore": number,
  "upsellOpportunities": ["services suggérés"],
  "retentionStrategy": "stratégie recommandée"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Erreur analyse sentiment:", error);
      return { satisfactionScore: 0.5, sentimentTrend: "stable", churnRisk: 0, loyaltyScore: 0.5, upsellOpportunities: [], retentionStrategy: "" };
    }
  }

  async generateChatResponse(userMessage: string) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `Tu es l'assistant IA intelligent d'une application mobile dédiée aux professionnels de la beauté (coiffure, ongles, esthétique, etc).

Ton rôle est d'aider l'utilisateur à mieux gérer son activité au quotidien grâce à l'intelligence artificielle.

Tu as accès à :
- L'agenda des rendez-vous
- Les fiches client (habitudes, historiques, fidélité)
- Les performances du salon (CA, heures creuses, annulations)
- Les campagnes marketing et les préférences des clientes

Ta mission :
1. Optimiser les créneaux de planning (éviter les trous, proposer des remplissages auto)
2. Prévoir les no-shows grâce à l'analyse de comportement
3. Générer des relances personnalisées (ex : "Julie n'est pas venue depuis 6 semaines")
4. Suggérer des promotions intelligentes (ex : "Lancer une offre flash mardi matin, car créneau vide")
5. Aider à la compta : génération de factures, stats de rentabilité
6. Créer des messages ou stories prêts à poster après RDV
7. Répondre à toutes les questions business / beauté de l'utilisateur pro

Tu dois toujours répondre avec un ton professionnel, bienveillant, rapide et utile.

Si tu ne sais pas, propose une action concrète (ex : "Souhaitez-vous que je crée une relance SMS ?").

Format de réponse : concis, orienté action, clair.

Objectif final : devenir le **copilote business intelligent** du pro de la beauté.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      return response.choices[0].message.content || "Comment puis-je vous aider aujourd'hui ?";
    } catch (error) {
      console.error('Erreur génération réponse chat:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Optimisation planning - réponse orientée action
    if (message.includes('planning') || message.includes('créneaux') || message.includes('horaires')) {
      return `**Optimisation de votre planning :**

🎯 **Actions immédiates :**
• Analysez vos créneaux vides de cette semaine
• Proposez des créneaux express (30min) pour combler les trous
• Activez les notifications de liste d'attente

📊 **Stratégie intelligente :**
• Regroupez les services similaires (gain de temps de 15%)
• Bloquez 15min entre RDV pour le setup/nettoyage
• Créez des créneaux premium aux heures de pointe (+20% tarif)

💡 **Souhaitez-vous que je génère une stratégie personnalisée pour votre salon ?**`;
    }
    
    if (message.includes('retard') || message.includes('en retard') || message.includes('late')) {
      return `Gestion des retards clients :

POLITIQUE DE RETARD RECOMMANDÉE :
• Tolérance de 10-15 minutes maximum
• Au-delà : proposer de décaler ou raccourcir le soin
• Facturer le temps prévu même si raccourci
• Informer le client suivant du possible décalage

ACTIONS IMMÉDIATES :
• Évaluez l'impact sur le planning (clients suivants)
• Proposez des alternatives : soin express, report à un créneau libre
• Gardez votre professionnalisme et restez bienveillant
• Documentez les retards récurrents pour anticiper

PRÉVENTION :
• Rappelez l'importance de la ponctualité à la réservation
• SMS de rappel avec mention "merci d'arriver 5 min avant"
• Politique claire affichée en salon et envoyée par email`;
    }
    
    if (message.includes('no-show') || message.includes('annulation') || message.includes('absent')) {
      return `Pour réduire les no-shows :
• Confirmez les RDV par SMS 24h avant
• Demandez un acompte de 20-30% à la réservation
• Créez une politique d'annulation claire (48h minimum)
• Proposez un rappel automatique 2h avant le RDV
• Fidélisez avec un système de points/récompenses`;
    }
    
    if (message.includes('client') || message.includes('fidélisation') || message.includes('fidélité')) {
      return `Stratégies de fidélisation client :
• Programme de fidélité avec carte de 10 soins
• Offres personnalisées selon l'historique
• Suivi post-soin avec conseils d'entretien
• Événements exclusifs (soirées beauté)
• Parrainage récompensé (réduction pour les deux)
• Newsletter avec conseils beauté mensuels`;
    }
    
    if (message.includes('prix') || message.includes('tarif') || message.includes('service')) {
      return `Conseils tarification et services :
• Analysez la concurrence locale
• Proposez des forfaits avantageux
• Ajustez selon votre expertise et localisation
• Créez des services premium (soins VIP)
• Offrez des packages mariages/événements
• Testez de nouveaux soins selon les tendances`;
    }
    
    if (message.includes('performance') || message.includes('statistiques') || message.includes('analyse')) {
      return `Indicateurs clés à surveiller :
• Taux d'occupation moyen (objectif: 75-85%)
• Revenu par client et par service
• Fréquence de visite moyenne
• Taux de no-show (<10%)
• Satisfaction client (enquêtes post-soin)
• Marge par service et produit vendu`;
    }
    
    if (message.includes('marketing') || message.includes('publicité') || message.includes('réseaux')) {
      return `Stratégies marketing efficaces :
• Instagram : photos avant/après, stories quotidiennes
• Google My Business avec avis clients
• Partenariats locaux (magasins, coiffeurs)
• Programme de parrainage
• Email marketing avec conseils beauté
• Événements et ateliers bien-être`;
    }
    
    if (message.includes('équipe') || message.includes('formation') || message.includes('employé')) {
      return `Management d'équipe :
• Formations techniques régulières
• Objectifs individuels motivants
• Planning équitable et prévisible
• Reconnaissance des bonnes performances
• Communication transparente
• Évolution de carrière claire`;
    }
    
    // Réponses pour questions générales
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return `Bonjour ! Je suis votre assistant IA spécialisé dans la gestion de salon de beauté.

Je peux vous aider avec :
• Optimisation du planning et organisation
• Stratégies de fidélisation client
• Réduction des no-shows
• Conseils tarifaires et nouveaux services
• Marketing et communication
• Gestion d'équipe et formation
• Analyse de performances
• Toute autre question business ou personnelle

Que souhaitez-vous améliorer aujourd'hui ?`;
    }
    
    // Questions sur la rentabilité
    if (message.includes('rentabilité') || message.includes('bénéfice') || message.includes('chiffre')) {
      return `Améliorer la rentabilité :
• Optimisez le taux de remplissage (objectif 80%+)
• Développez la vente de produits (marge élevée)
• Proposez des services premium
• Réduisez les coûts fixes (négociation fournisseurs)
• Analysez la rentabilité par service
• Fidélisez pour augmenter la fréquence`;
    }
    
    // Questions techniques beauté
    if (message.includes('soin') || message.includes('technique') || message.includes('produit')) {
      return `Expertise technique beauté :
• Soins anti-âge : acide hyaluronique, LED, radiofrequence
• Tendances : cosmétiques naturels, soins sur-mesure
• Protocoles : adaptation selon type de peau
• Nouveautés : sérums concentrés, masques haute tech
• Formation : stages avec marques professionnelles
• Équipements : investissement matériel moderne`;
    }
    
    // Questions sur les retards - réponse business orientée
    if (message.includes('retard') || message.includes('en retard')) {
      return `**Gestion des retards clients :**

⚡ **Action immédiate :**
- Jusqu'à 15min : Accueillez normalement, informez du possible raccourcissement
- Plus de 15min : Proposez report/raccourcissement (facturé plein tarif)

🎯 **Protocole optimal :**
1. Évaluez l'impact sur les clients suivants
2. Prévenez le client suivant du décalage
3. Proposez une solution concrète en 30 secondes
4. Documentez les retards récurrents

🔧 **Automatisation préventive :**
- SMS rappel : "RDV demain 14h, merci d'arriver 5min avant"
- Politique claire affichée et envoyée par email

💡 **Souhaitez-vous que je configure des rappels automatiques pour réduire les retards ?**`;
    }
    
    // Toutes les autres questions - réponse directe et intelligente
    return this.generateIntelligentResponse(message);
  }

  private getContextualAdvice(message: string): string {
    if (message.includes('retard')) {
      return `GESTION DES RETARDS :
• Tolérance maximum : 10-15 minutes
• Au-delà : proposez de raccourcir le soin ou reporter
• Facturez le temps prévu même si raccourci
• Prévenez le client suivant du possible décalage
• Restez professionnel et bienveillant`;
    }
    
    if (message.includes('client mécontent') || message.includes('réclamation')) {
      return `GESTION CLIENT MÉCONTENT :
• Écoutez activement sans interrompre
• Excusez-vous même si ce n'est pas votre faute
• Proposez une solution concrète immédiatement
• Offrez un geste commercial si nécessaire
• Documentez l'incident pour éviter la répétition`;
    }
    
    if (message.includes('urgent') || message.includes('problème')) {
      return `GESTION SITUATION URGENTE :
• Gardez votre calme et évaluez la situation
• Priorisez la sécurité et le bien-être
• Communiquez clairement avec tous les concernés
• Trouvez des solutions pratiques rapidement
• Faites un suivi après résolution`;
    }
    
    return `Pour votre situation spécifique, voici mes recommandations pratiques basées sur les meilleures pratiques du secteur beauté. Chaque problème a une solution adaptée selon le contexte de votre salon.`;
  }

  private getDetailedExplanation(message: string): string {
    if (message.includes('pourquoi')) {
      return `Les raisons derrière cette situation sont multiples et je vais vous expliquer les mécanismes principaux ainsi que les facteurs qui influencent le résultat que vous observez.`;
    }
    
    if (message.includes('comment ça marche')) {
      return `Le fonctionnement se base sur plusieurs étapes clés que je vais détailler pour vous donner une compréhension complète du processus.`;
    }
    
    return `Voici une explication détaillée qui couvre tous les aspects importants de votre question, avec des exemples concrets pour une meilleure compréhension.`;
  }

  private getUniversalResponse(message: string): string {
    // Réponse intelligente basée sur le contenu du message
    if (message.length < 10) {
      return `Je comprends votre question. Pouvez-vous me donner plus de détails pour que je puisse vous fournir une réponse précise et adaptée à votre situation ?`;
    }
    
    // Analyse du sentiment et du contexte
    const isQuestion = message.includes('?') || message.includes('comment') || message.includes('que') || message.includes('quoi');
    const isUrgent = message.includes('urgent') || message.includes('vite') || message.includes('maintenant');
    const isProblem = message.includes('problème') || message.includes('souci') || message.includes('erreur');
    
    if (isUrgent && isProblem) {
      return `Je comprends que c'est urgent. Voici une approche rapide et efficace :
1. Évaluez immédiatement les risques et priorités
2. Communiquez clairement avec toutes les personnes concernées
3. Appliquez la solution la plus simple et sûre disponible
4. Documentez ce qui s'est passé pour éviter la répétition
5. Faites un suivi pour vous assurer que tout est résolu`;
    }
    
    if (isQuestion) {
      return `Excellente question ! La réponse dépend de plusieurs facteurs que je vais analyser :
• Le contexte spécifique de votre situation
• Les meilleures pratiques du secteur
• Les solutions qui ont fait leurs preuves
• Votre contraintes particulières (budget, temps, équipe)
• Les résultats attendus à court et long terme`;
    }
    
    return `Je peux vous aider avec cette demande. Voici une approche structurée pour traiter votre situation de manière professionnelle et efficace. N'hésitez pas à me poser des questions plus spécifiques pour des conseils personnalisés.`;
  }

  private generateIntelligentResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Gestion des clients difficiles
    if (lowerMessage.includes('client difficile') || lowerMessage.includes('client mécontent') || lowerMessage.includes('réclamation')) {
      return `Pour gérer un client difficile ou mécontent :

**Étape 1 - Écoute active :**
- Laissez le client s'exprimer complètement sans l'interrompre
- Maintenez un contact visuel et hochez la tête
- Reformulez sa préoccupation : "Si je comprends bien, vous êtes déçu(e) de..."

**Étape 2 - Empathie et responsabilité :**
- "Je comprends votre frustration"
- Excusez-vous même si l'erreur ne vient pas de vous
- Ne cherchez pas d'excuses ou de justifications

**Étape 3 - Solution immédiate :**
- Proposez une solution concrète dans les 2 minutes
- Offrez un choix : "Je peux vous proposer X ou Y"
- Geste commercial si nécessaire (remise, soin gratuit)

**Étape 4 - Suivi :**
- Assurez-vous que la solution convient
- Recontactez le client 24-48h après
- Documentez l'incident pour éviter la répétition`;
    }

    // Questions sur l'organisation
    if (lowerMessage.includes('organisation') || lowerMessage.includes('organiser')) {
      return `Pour mieux organiser votre salon :

**Planning quotidien :**
- Commencez par les soins longs le matin
- Placez les rendez-vous courts entre 12h-14h
- Gardez 15 minutes entre chaque client
- Bloquez 1h le midi pour les urgences/retards

**Gestion du matériel :**
- Préparez tout le matériel la veille
- Un chariot mobile par esthéticienne
- Stock de produits dans chaque cabine
- Nettoyage systématique après chaque client

**Accueil et flux clients :**
- Zone d'attente confortable avec magazines
- Vestiaire avec casiers sécurisés
- Circuit client fluide (accueil → vestiaire → cabine → caisse)
- Boissons offertes pour les attentes`;
    }

    // Questions sur les prix et tarifs
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('combien')) {
      return `Stratégie tarifaire pour votre salon :

**Analyse de marché :**
- Étudiez 5-7 concurrents directs dans votre zone
- Positionnez-vous selon votre expertise et standing
- Considérez votre clientèle cible (populaire, moyenne, haut de gamme)

**Structure tarifaire intelligente :**
- Tarif de base × 1.2 = tarif créneaux premium (vendredi soir, samedi)
- Tarif de base × 0.8 = tarif créneaux creux (mardi matin, jeudi)
- Forfaits 3 soins = -15%, forfait 5 soins = -20%

**Majorations justifiées :**
- +20% pour services à domicile
- +15% pour dernière minute (moins de 24h)
- +10% pour demandes spéciales (soins très tard/tôt)

**Exemples concrets :**
- Soin visage classique : 45-65€
- Épilation demi-jambes : 25-35€
- Manucure complète : 30-45€
- Package mariée : 150-250€`;
    }

    // Questions générales avec analyse intelligente
    if (lowerMessage.includes('comment') || lowerMessage.includes('que faire') || lowerMessage.includes('quoi faire')) {
      return this.analyzeAndRespond(lowerMessage);
    }

    // Réponse par défaut très complète
    return `Je comprends votre question. Voici une réponse directe et pratique :

${this.getSpecificAnswer(lowerMessage)}

Cette approche est basée sur les meilleures pratiques du secteur beauté. Si vous avez besoin de précisions sur un point particulier, n'hésitez pas à me le demander.`;
  }

  private analyzeAndRespond(message: string): string {
    if (message.includes('motiver') || message.includes('équipe')) {
      return `Pour motiver votre équipe :
- Objectifs individuels avec primes (ex: +50€ si 15 soins/semaine)
- Formation continue prise en charge
- Rotation des tâches pour éviter la routine
- Reconnaissance publique des bonnes performances
- Évolution de carrière claire (assistante → esthéticienne senior)`;
    }

    if (message.includes('client') && message.includes('fidéliser')) {
      return `Techniques de fidélisation efficaces :
- Carte de fidélité : 10ème soin offert
- SMS personnalisés selon l'historique client
- Offres d'anniversaire automatiques
- Programme de parrainage (10€ de réduction pour chacune)
- Soirées VIP trimestrielles pour les meilleures clientes`;
    }

    return `Voici comment procéder étape par étape pour résoudre votre situation de manière professionnelle et efficace.`;
  }

  private getSpecificAnswer(message: string): string {
    if (message.includes('augmenter') && message.includes('chiffre')) {
      return `Stratégies pour augmenter votre chiffre d'affaires :
• Montée en gamme : proposez des soins premium (+30% marge)
• Vente de produits : objectif 20% du CA (marge 60-80%)
• Packages et abonnements pour lisser les revenus
• Créneaux étendus : ouverture le dimanche matin
• Services à domicile pour clientèle premium`;
    }

    if (message.includes('concurrence') || message.includes('concurrent')) {
      return `Face à la concurrence :
• Différenciation par la spécialisation (anti-âge, bio, etc.)
• Service client irréprochable (SMS de suivi post-soin)
• Partenariats locaux exclusifs
• Présence digitale forte (Instagram, Google My Business)
• Programme de fidélité unique`;
    }

    return `Approche recommandée basée sur l'analyse de votre demande et les bonnes pratiques du secteur.`;
  }
}

export const aiService = new AIService();