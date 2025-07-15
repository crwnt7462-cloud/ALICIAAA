import OpenAI from "openai";
import { format, addDays, subDays, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEYY });

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
            content: `Tu es l'assistant IA universel intelligent d'une application mobile dédiée aux professionnels de la beauté.

Tu dois répondre à TOUTES les questions, même celles qui sortent du domaine beauté/business. Tu es polyvalent et intelligent.

Domaines d'expertise :
- Gestion salon beauté (planning, clients, CA, marketing)
- Culture générale et connaissances
- Technologie et science
- Actualités et société
- Conseils de vie et développement personnel
- Cuisine, voyage, sport, loisirs
- Littérature, histoire, arts
- Mathématiques, physique, chimie
- Toute question existentielle ou pratique

Tu as accès à :
- L'agenda des rendez-vous
- Les fiches client (habitudes, historiques, fidélité)
- Les performances du salon (CA, heures creuses, annulations)
- Les campagnes marketing et les préférences des clientes

Format de réponse : concis, orienté action, clair et utile.

Objectif : devenir l'assistant personnel complet du professionnel.`
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
      return this.getIntelligentLocalResponse(userMessage);
    }
  }

  private getIntelligentLocalResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Système de réponses universelles intelligent
    
    // Questions générales et culture
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return `Bonjour ! Je suis votre assistant IA universel. Je peux vous aider sur tous les sujets :
      
**Gestion salon** : planning, clients, revenus, marketing
**Culture générale** : histoire, sciences, actualités
**Conseils pratiques** : vie quotidienne, développement personnel
**Loisirs** : cuisine, voyages, sport, arts

Que puis-je faire pour vous aujourd'hui ?`;
    }
    
    if (message.includes('qui es-tu') || message.includes('qui es tu') || message.includes('présente-toi')) {
      return `Je suis votre assistant IA universel intelligent ! 

🧠 **Mes capacités** :
- Expert en gestion de salon de beauté
- Connaissances générales étendues
- Conseils pratiques et personnalisés
- Résolution de problèmes complexes
- Accompagnement business et personnel

**Ma mission** : Être votre copilote intelligent pour tous vos besoins, professionnels comme personnels.

Posez-moi n'importe quelle question !`;
    }
    
    // Questions météo
    if (message.includes('météo') || message.includes('temps qu\'il fait') || message.includes('pluie') || message.includes('soleil')) {
      return `Pour la météo précise, je vous recommande :
      
**Applications fiables** :
- Météo France (officiel)
- Weather.com
- AccuWeather

**Conseil business** : Adaptez vos services selon la météo ! 
- Temps pluvieux → proposez des soins cocooning
- Soleil → mettez en avant les soins après-soleil
- Froid → promouvez les soins hydratants

Voulez-vous que je vous aide à créer une stratégie marketing saisonnière ?`;
    }
    
    // Questions cuisine
    if (message.includes('recette') || message.includes('cuisine') || message.includes('cuire') || message.includes('plat')) {
      return `Je peux vous aider avec la cuisine !

👨‍🍳 **Conseils généraux** :
- Commencez par des plats simples
- Utilisez des ingrédients frais
- Goûtez pendant la cuisson
- Préparez vos ingrédients avant de commencer

💡 **Lien avec votre salon** : Une bonne alimentation améliore la santé des cheveux et de la peau !

Quelle recette ou conseil culinaire vous intéresse ?`;
    }
    
    // Questions voyage
    if (message.includes('voyage') || message.includes('vacances') || message.includes('destination') || message.includes('partir')) {
      return `Parlons voyage ! ✈️

🗺️ **Destinations populaires** :
- Europe : Paris, Rome, Amsterdam
- Tropical : Bali, Thaïlande, Maldives  
- Urbain : New York, Tokyo, Londres
- Nature : Islande, Nouvelle-Zélande, Canada

💼 **Conseil pro** : Planifiez vos congés pour optimiser votre salon :
- Évitez les périodes de forte demande
- Prévenez vos clientes à l'avance
- Préparez des offres de retour de vacances

Où souhaitez-vous partir ?`;
    }
    
    // Questions sport
    if (message.includes('sport') || message.includes('fitness') || message.includes('exercice') || message.includes('musculation')) {
      return `Le sport, excellent pour la santé ! 💪

🏃‍♀️ **Activités recommandées** :
- Cardio : course, vélo, natation
- Renforcement : musculation, yoga, pilates
- Détente : marche, stretching, méditation

💡 **Astuce pro** : Le sport améliore :
- La circulation sanguine (bon pour les cheveux)
- L'évacuation du stress
- La confiance en soi de vos clientes

Créons ensemble un planning sport/salon équilibré !`;
    }
    
    // Questions culture/histoire
    if (message.includes('histoire') || message.includes('culture') || message.includes('art') || message.includes('musée')) {
      return `La culture, c'est passionnant ! 🎭

📚 **Domaines fascinants** :
- Histoire : civilisations, événements marquants
- Art : peinture, sculpture, architecture
- Littérature : classiques, contemporain
- Musique : tous styles et époques

💡 **Inspiration salon** : Créez des ambiances thématiques :
- Vintage rétro années 50
- Zen japonais
- Bohème artistique
- Moderne minimaliste

Quel sujet culturel vous intéresse ?`;
    }
    
    // Questions technologie
    if (message.includes('technologie') || message.includes('ordinateur') || message.includes('smartphone') || message.includes('internet')) {
      return `La technologie évolue vite ! 💻

🔧 **Innovations utiles** :
- IA et automatisation
- Applications mobiles
- Réseaux sociaux
- E-commerce

📱 **Pour votre salon** :
- Prise de RDV en ligne
- Gestion clients digitale
- Marketing sur réseaux sociaux
- Paiements sans contact

Comment puis-je vous aider à digitaliser votre activité ?`;
    }
    
    // Questions mathématiques/calculs
    if (message.includes('calcul') || message.includes('math') || message.includes('pourcentage') || message.includes('prix')) {
      return `Les maths, c'est utile au quotidien ! 🧮

💰 **Calculs salon fréquents** :
- Marge bénéficiaire : (Prix vente - Prix achat) / Prix vente × 100
- Taux de fidélisation : Clients fidèles / Total clients × 100
- CA moyen par client : Chiffre d'affaires / Nombre de clients
- Rentabilité par heure : CA horaire - Charges horaires

Quel calcul souhaitez-vous effectuer ?`;
    }
    
    // Questions optimisation planning
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
    
    // Analyse intelligente de la question pour réponse personnalisée
    return this.analyzeQuestionAndRespond(userMessage, message);
  }

  // Analyse intelligente des questions pour réponses personnalisées
  private analyzeQuestionAndRespond(userMessage: string, message: string): string {
    // Analyse des mots-clés pour identifier le type de question
    const questionTypes = {
      business: ['clients', 'business', 'revenus', 'marketing', 'salon', 'esthétique', 'beauté', 'planning', 'équipe', 'formation', 'prix', 'tarif', 'concurrence', 'fidélisation', 'rentabilité', 'gestion', 'organisation'],
      culture: ['histoire', 'culture', 'art', 'littérature', 'livre', 'musique', 'peinture', 'sculpture', 'philosophie', 'science', 'physique', 'chimie', 'biologie', 'mathématiques'],
      lifestyle: ['cuisine', 'recette', 'voyage', 'vacances', 'sport', 'fitness', 'santé', 'bien-être', 'mode', 'style', 'décoration', 'jardinage'],
      technology: ['technologie', 'ordinateur', 'smartphone', 'internet', 'logiciel', 'application', 'intelligence', 'artificielle', 'programmation', 'digital'],
      practical: ['comment', 'que faire', 'quoi faire', 'pourquoi', 'conseil', 'aide', 'solution', 'problème', 'résoudre', 'améliorer', 'optimiser']
    };

    // Détection du type de question
    let questionType = 'general';
    let maxMatches = 0;
    
    Object.entries(questionTypes).forEach(([type, keywords]) => {
      const matches = keywords.filter(keyword => message.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        questionType = type;
      }
    });

    // Génération de réponse selon le type identifié
    switch (questionType) {
      case 'business':
        return this.generateBusinessResponse(userMessage, message);
      case 'culture':
        return this.generateCultureResponse(userMessage, message);
      case 'lifestyle':
        return this.generateLifestyleResponse(userMessage, message);
      case 'technology':
        return this.generateTechnologyResponse(userMessage, message);
      case 'practical':
        return this.generatePracticalResponse(userMessage, message);
      default:
        return this.generateGeneralResponse(userMessage, message);
    }
  }

  private generateBusinessResponse(userMessage: string, message: string): string {
    if (message.includes('clients') && message.includes('fidéliser')) {
      return `Stratégies de fidélisation client efficaces :

**Actions immédiates** :
- Créez un système de points : 1 point = 1€ dépensé
- SMS personnalisé 24h après chaque soin
- Offre anniversaire automatique (-20%)
- Programme de parrainage (10€ pour chaque amie)

**Stratégies avancées** :
- Soirées VIP trimestrielles pour top clients
- Carte de fidélité digitale avec récompenses
- Forfaits avantageux (5 soins = -15%)
- Suivi personnalisé des préférences

**Mesure de succès** :
- Taux de retour : objectif 70% dans les 3 mois
- Fréquence moyenne : 1 visite par mois
- Recommandations : 30% de nouveaux clients`;
    }

    if (message.includes('planning') || message.includes('organisation')) {
      return `Optimisation du planning salon :

**Structure optimale** :
- 9h-12h : Soins longs (forfaits, traitements)
- 12h-14h : Créneaux courts (épilations, manucures)
- 14h-18h : Soins moyens (soins visage, beauté)
- 18h-20h : Créneaux premium (+20% tarif)

**Règles d'or** :
- 15 minutes entre chaque client (nettoyage)
- Pas plus de 7 clients par jour et par praticienne
- Bloquer 1h à 13h pour urgences/retards
- Prévoir 30% de créneaux libres pour dernière minute

**Outils recommandés** :
- Rappels SMS automatiques J-1
- Système de liste d'attente
- Paiement d'acompte obligatoire`;
    }

    if (message.includes('prix') || message.includes('tarif')) {
      return `Stratégie tarifaire rentable :

**Analyse concurrentielle** :
- Étudiez 5 concurrents dans 2km
- Positionnez-vous selon votre standing
- Considérez votre zone géographique

**Grille tarifaire intelligente** :
- Soin visage : 50-70€ (selon zone)
- Épilation jambes : 30-45€
- Manucure : 35-50€
- Forfait 3 soins : -15%
- Créneaux premium : +20%
- Domicile : +25%

**Optimisation rentabilité** :
- Marge produits : 60-80%
- Objectif taux remplissage : 75%
- CA minimum/heure : 45€`;
    }

    return `Pour votre question business "${userMessage}" :

**Approche recommandée** :
- Analysez d'abord votre situation actuelle
- Définissez des objectifs SMART mesurables
- Implémentez étape par étape
- Mesurez les résultats chaque semaine

**Besoin d'aide spécifique** ? Reformulez votre question pour des conseils plus précis sur votre situation particulière.`;
  }

  private generateCultureResponse(userMessage: string, message: string): string {
    if (message.includes('histoire') || message.includes('historique')) {
      return `Sujet historique passionnant !

**Approche pour comprendre** :
- Contexte historique et chronologie
- Causes et conséquences
- Personnages clés et leur rôle
- Impact sur notre époque

**Ressources recommandées** :
- Livres d'historiens reconnus
- Documentaires Arte ou France 5
- Musées et expositions
- Podcasts d'histoire (France Inter, Europe 1)

**Conseil pratique** : Commencez par une vue d'ensemble, puis approfondissez les aspects qui vous intéressent le plus.

Quelle période ou quel aspect historique vous intéresse particulièrement ?`;
    }

    if (message.includes('art') || message.includes('culture')) {
      return `L'art et la culture enrichissent la vie !

**Domaines à explorer** :
- Peinture : de la Renaissance à l'art contemporain
- Littérature : classiques et auteurs modernes
- Musique : tous genres et époques
- Cinéma : chefs-d'œuvre et tendances actuelles

**Pour approfondir** :
- Visitez musées et galeries
- Assistez à spectacles et concerts
- Rejoignez des clubs de lecture
- Suivez des cours ou ateliers

**Inspiration pour votre salon** : Créez une ambiance artistique avec des reproductions d'œuvres, musique douce, décoration soignée.`;
    }

    return `Question culturelle intéressante ! "${userMessage}"

**Méthode d'exploration** :
- Recherchez des sources fiables
- Croisez plusieurs points de vue
- Approfondissez progressivement
- Partagez vos découvertes

La culture nous enrichit personnellement et professionnellement !`;
  }

  private generateLifestyleResponse(userMessage: string, message: string): string {
    if (message.includes('cuisine') || message.includes('recette')) {
      return `Conseils culinaires pratiques :

**Bases essentielles** :
- Préparez tous les ingrédients avant de commencer
- Goûtez régulièrement pendant la cuisson
- Utilisez des produits frais et de saison
- Maîtrisez les techniques de base

**Idées recettes simples** :
- Poêlée de légumes colorés
- Pâtes aux légumes grillés
- Salades composées créatives
- Plats mijotés réconfortants

**Lien avec votre métier** : Une alimentation saine améliore l'éclat de la peau et la santé des cheveux - partagez ces conseils avec vos clientes !

Quel type de cuisine vous intéresse ?`;
    }

    if (message.includes('voyage') || message.includes('vacances')) {
      return `Conseils voyage et vacances :

**Destinations populaires** :
- Europe : Paris, Rome, Amsterdam, Barcelone
- Tropical : Bali, Thaïlande, Maldives
- Urbain : New York, Tokyo, Londres
- Nature : Islande, Nouvelle-Zélande, Canada

**Planification intelligente** :
- Réservez 2-3 mois à l'avance
- Vérifiez visa et vaccinations
- Prévoyez budget +20% pour imprévus
- Assurance voyage indispensable

**Conseil professionnel** : Planifiez vos congés pour éviter les périodes de forte demande de votre salon. Prévenez vos clientes et préparez des offres de retour !`;
    }

    if (message.includes('sport') || message.includes('fitness')) {
      return `Le sport, essentiel pour la santé !

**Activités recommandées** :
- Cardio : marche, course, vélo, natation
- Renforcement : musculation, yoga, pilates
- Détente : stretching, méditation, tai-chi

**Bénéfices beauté** :
- Améliore circulation sanguine
- Évacue le stress
- Raffermit la peau
- Booste confiance en soi

**Conseil pro** : Proposez à vos clientes des soins post-sport ou des massages de récupération !

Quel sport vous attire le plus ?`;
    }

    return `Question lifestyle "${userMessage}" :

**Approche équilibrée** :
- Privilégiez le bien-être global
- Intégrez des habitudes saines
- Trouvez votre rythme personnel
- Partagez vos passions

La qualité de vie se reflète dans votre travail et vos relations !`;
  }

  private generateTechnologyResponse(userMessage: string, message: string): string {
    if (message.includes('technologie') || message.includes('digital')) {
      return `La technologie évolue rapidement !

**Tendances actuelles** :
- Intelligence artificielle et automatisation
- Applications mobiles intuitives
- Réseaux sociaux professionnels
- Outils de gestion digitale

**Pour votre salon** :
- Système de réservation en ligne
- Gestion clients digitalisée
- Marketing sur réseaux sociaux
- Paiements sans contact
- Outils de fidélisation automatisés

**Conseils adoption** :
- Commencez par un outil à la fois
- Formez-vous progressivement
- Choisissez des solutions simples
- Mesurez l'impact sur votre activité

Comment puis-je vous aider à digitaliser votre salon ?`;
    }

    if (message.includes('intelligence') && message.includes('artificielle')) {
      return `L'IA révolutionne de nombreux secteurs !

**Applications pratiques** :
- Assistants virtuels comme moi
- Prédictions et recommandations
- Automatisation des tâches
- Analyse de données

**Dans votre métier** :
- Prédiction des no-shows
- Recommandations personnalisées
- Optimisation du planning
- Analyse comportement clients

**Futur proche** :
- IA encore plus intuitive
- Intégration naturelle au quotidien
- Gain de temps considérable
- Personnalisation poussée

L'IA est votre alliée pour optimiser votre salon !`;
    }

    return `Question technologique "${userMessage}" :

**Évolution constante** :
- Restez curieux et informé
- Testez les nouveautés utiles
- Adaptez à vos besoins réels
- Formez-vous régulièrement

La technologie doit simplifier votre vie, pas la compliquer !`;
  }

  private generatePracticalResponse(userMessage: string, message: string): string {
    if (message.includes('comment') || message.includes('que faire')) {
      return `Méthode pour résoudre "${userMessage}" :

**Étape 1 - Analyse** :
- Définissez clairement le problème
- Identifiez les causes possibles
- Évaluez les ressources disponibles

**Étape 2 - Solutions** :
- Listez 3-5 options possibles
- Évaluez avantages/inconvénients
- Choisissez la plus adaptée

**Étape 3 - Action** :
- Planifiez les étapes concrètes
- Fixez des délais réalistes
- Commencez immédiatement

**Étape 4 - Suivi** :
- Mesurez les résultats
- Ajustez si nécessaire
- Documentez pour l'avenir

Voulez-vous approfondir un aspect particulier ?`;
    }

    if (message.includes('améliorer') || message.includes('optimiser')) {
      return `Stratégie d'amélioration pour "${userMessage}" :

**Diagnostic actuel** :
- Qu'est-ce qui fonctionne bien ?
- Quels sont les points faibles ?
- Où sont les opportunités ?

**Plan d'action** :
- Priorités par ordre d'impact
- Ressources nécessaires
- Timeline réaliste
- Indicateurs de succès

**Mise en œuvre** :
- Commencez par le plus simple
- Mesurez chaque amélioration
- Ajustez en continu
- Célébrez les progrès

**Conseil** : L'amélioration continue vaut mieux que la perfection immédiate !`;
    }

    return `Pour votre question pratique "${userMessage}" :

**Approche structurée** :
- Analysez la situation objectivement
- Définissez l'objectif précis
- Identifiez les étapes nécessaires
- Passez à l'action immédiatement

**Principe clé** : Chaque problème a une solution, il suffit de l'adapter à votre contexte !

Besoin de précisions sur un aspect particulier ?`;
  }

  private generateGeneralResponse(userMessage: string, message: string): string {
    return `Réponse à votre question "${userMessage}" :

**Analyse de votre demande** :
Je comprends que vous cherchez des informations ou des conseils sur ce sujet.

**Approche recommandée** :
- Identifiez vos objectifs précis
- Recherchez des sources fiables
- Appliquez progressivement
- Adaptez à votre situation

**Conseil personnalisé** :
Chaque situation est unique. Pour vous donner des conseils plus précis, n'hésitez pas à :
- Détailler votre contexte
- Préciser vos contraintes
- Partager vos objectifs

**Je reste à votre disposition** pour approfondir n'importe quel aspect de votre question !

Que souhaitez-vous savoir de plus spécifique ?`;
  }

  // Suppression des doublons - ces conditions sont déjà gérées plus haut
  private getFallbackResponse(userMessage: string): string {
    return this.getIntelligentLocalResponse(userMessage);
  }
}

export const aiService = new AIService();
