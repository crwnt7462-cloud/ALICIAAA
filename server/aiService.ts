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
            content: `Tu es un assistant IA polyvalent et expert dans la gestion de salon de beauté. Tu peux répondre à TOUTES les questions, qu'elles concernent :

DOMAINES PRINCIPAUX :
- Gestion de salon : rendez-vous, planning, équipe, clients
- Business : marketing, pricing, stratégies de croissance
- Techniques beauté : soins, produits, tendances
- Management : RH, formation, organisation
- Finances : comptabilité, rentabilité, investissements
- Légal : réglementation, hygiene, assurances
- Personnel : développement, motivation, bien-être

AUTRES SUJETS :
- Questions générales sur n'importe quel sujet
- Conseils personnels et professionnels
- Résolution de problèmes concrets
- Explications techniques ou théoriques
- Recommandations pratiques

STYLE DE RÉPONSE :
- Toujours bienveillant et professionnel
- Réponses détaillées et complètes
- Exemples concrets quand c'est pertinent
- Pas de restrictions sur les sujets
- Adapte la complexité à la question

Tu peux discuter de tout, donner ton avis, expliquer des concepts, proposer des solutions créatives. Il n'y a aucune limite à tes réponses tant qu'elles sont utiles et respectueuses.`
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
    
    if (message.includes('planning') || message.includes('créneaux') || message.includes('horaires')) {
      return `Pour optimiser votre planning :
• Analysez vos heures de pointe pour mieux répartir les RDV
• Proposez des créneaux courts (15-30min) pour combler les trous
• Utilisez la liste d'attente pour optimiser les annulations
• Regroupez les services similaires pour gagner du temps
• Prévoyez 10-15min entre chaque RDV pour le nettoyage`;
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
    
    // Questions sur les retards - réponse directe
    if (message.includes('retard') || message.includes('en retard')) {
      return `Si une personne est en retard, voici ce que vous devez faire :

1. **Jusqu'à 15 minutes** : Accueillez le client normalement mais informez-le que le soin pourrait être légèrement raccourci ou décalé selon votre planning.

2. **Plus de 15 minutes** : Vous avez plusieurs options :
   - Proposer un soin raccourci (facturé plein tarif)
   - Reporter à un créneau libre dans la journée
   - Reprogrammer à une autre date

3. **Actions immédiates** :
   - Vérifiez l'impact sur les clients suivants
   - Prévenez le client suivant du possible décalage
   - Restez professionnel et bienveillant
   - Proposez une solution concrète rapidement

4. **Prévention future** :
   - Rappelez l'importance de la ponctualité lors de la prise de RDV
   - Envoyez des SMS de rappel avec mention "merci d'arriver 5 min avant"
   - Affichez votre politique de retard dans le salon

La règle d'or : gardez le contrôle de votre planning tout en préservant la relation client.`;
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