import { aiService } from "./aiService";

export interface ClientProfile {
  nom: string;
  rdv_total: number;
  rdv_annules: number;
  dernier_comportement: "venu" | "annulé" | "pas venu";
  profil: "nouveau" | "habitué";
  taux_annulation: number;
  score_risque?: number;
  strategie_recommandee?: string;
  probabilite_prochaine_annulation?: number;
}

export interface ClientInsight {
  client: ClientProfile;
  niveau_risque: "faible" | "moyen" | "élevé" | "critique";
  actions_recommandees: string[];
  strategie_retention: string;
  probabilite_conversion: number;
  message_personnalise?: string;
}

export class ClientAnalyticsService {
  
  /**
   * Calcule le score de risque d'annulation d'un client
   */
  calculateRiskScore(client: ClientProfile): number {
    let score = 0;
    
    // Taux d'annulation (poids: 60%)
    score += (client.taux_annulation / 100) * 0.6;
    
    // Dernier comportement (poids: 25%)
    if (client.dernier_comportement === "annulé") score += 0.25;
    else if (client.dernier_comportement === "pas venu") score += 0.15;
    
    // Profil client (poids: 15%)
    if (client.profil === "nouveau" && client.rdv_total <= 2) score += 0.15;
    
    return Math.min(score, 1); // Cap à 1.0
  }

  /**
   * Détermine le niveau de risque basé sur le score
   */
  getRiskLevel(score: number): "faible" | "moyen" | "élevé" | "critique" {
    if (score >= 0.7) return "critique";
    if (score >= 0.5) return "élevé";
    if (score >= 0.3) return "moyen";
    return "faible";
  }

  /**
   * Calcule la probabilité d'annulation du prochain RDV
   */
  calculateCancellationProbability(client: ClientProfile): number {
    const baseRate = client.taux_annulation / 100;
    
    // Ajustements selon le dernier comportement
    let adjustment = 0;
    if (client.dernier_comportement === "annulé") adjustment = 0.2;
    else if (client.dernier_comportement === "pas venu") adjustment = 0.15;
    else if (client.dernier_comportement === "venu") adjustment = -0.1;
    
    // Ajustement selon l'historique
    if (client.rdv_total >= 5 && client.taux_annulation > 50) {
      adjustment += 0.15; // Pattern établi
    }
    
    return Math.max(0, Math.min(1, baseRate + adjustment));
  }

  /**
   * Génère des recommandations d'actions basées sur le profil
   */
  generateActionRecommendations(client: ClientProfile, riskLevel: string): string[] {
    const actions: string[] = [];
    
    switch (riskLevel) {
      case "critique":
        actions.push("⚠️ Appel personnel dans les 24h");
        actions.push("🎁 Offre spéciale de récupération (réduction 20%)");
        actions.push("📅 Proposition de créneaux flexibles");
        actions.push("💬 Message personnalisé rappelant la relation");
        break;
        
      case "élevé":
        actions.push("📞 Appel de confirmation 48h avant RDV");
        actions.push("🎯 Offre de fidélité personnalisée");
        actions.push("⏰ Rappel SMS 2h avant le RDV");
        break;
        
      case "moyen":
        actions.push("📱 SMS de confirmation automatique");
        actions.push("⭐ Proposition de services complémentaires");
        actions.push("🔄 Suivi post-RDV par email");
        break;
        
      case "faible":
        actions.push("✅ Confirmation standard");
        actions.push("🌟 Programme de parrainage");
        break;
    }
    
    // Actions spécifiques aux nouveaux clients
    if (client.profil === "nouveau") {
      actions.push("🤝 Accueil renforcé et présentation équipe");
      actions.push("📋 Questionnaire de préférences");
    }
    
    return actions;
  }

  /**
   * Génère une stratégie de rétention personnalisée
   */
  generateRetentionStrategy(client: ClientProfile): string {
    const strategies = {
      critique: `Intervention immédiate requise. Contact personnel pour comprendre les raisons d'annulation et proposer des solutions adaptées (horaires, services, tarifs).`,
      élevé: `Renforcement de la relation client avec un suivi proactif et des avantages exclusifs pour restaurer la confiance.`,
      moyen: `Optimisation de l'expérience avec des services personnalisés et une communication régulière.`,
      faible: `Maintien de la satisfaction avec un service de qualité et des opportunités d'upselling.`
    };
    
    const riskLevel = this.getRiskLevel(this.calculateRiskScore(client));
    return strategies[riskLevel] || strategies.faible;
  }

  /**
   * Analyse complète d'un client avec insights IA
   */
  async analyzeClient(client: ClientProfile): Promise<ClientInsight> {
    const riskScore = this.calculateRiskScore(client);
    const riskLevel = this.getRiskLevel(riskScore);
    const cancellationProbability = this.calculateCancellationProbability(client);
    const actions = this.generateActionRecommendations(client, riskLevel);
    const strategy = this.generateRetentionStrategy(client);
    
    // Calcul de la probabilité de conversion avec une intervention
    const conversionProbability = Math.max(0.1, 1 - (riskScore * 0.8));
    
    // Génération d'un message personnalisé via IA
    let personalizedMessage = "";
    try {
      const aiPrompt = `
Crée un message personnel et bienveillant pour ce client de salon de beauté :

Client: ${client.nom}
- ${client.rdv_total} rendez-vous pris, ${client.rdv_annules} annulés (${client.taux_annulation}%)
- Dernier comportement: ${client.dernier_comportement}
- Profil: ${client.profil}
- Niveau de risque: ${riskLevel}

Le message doit être :
- Chaleureux et professionnel
- Reconnaître la relation existante
- Subtil sur les annulations sans les mentionner directement
- Proposer une valeur ajoutée
- Maximum 2 phrases courtes

Exemple de ton : "Bonjour Sarah, nous pensons à vous et aimerions vous retrouver bientôt. Nous avons de nouveaux soins qui pourraient vous intéresser !"`;

      personalizedMessage = await aiService.getChatResponse(aiPrompt);
    } catch (error) {
      console.error("Erreur génération message IA:", error);
      personalizedMessage = `Bonjour ${client.nom}, nous serions ravis de vous retrouver bientôt dans notre salon !`;
    }

    return {
      client: {
        ...client,
        score_risque: riskScore,
        probabilite_prochaine_annulation: cancellationProbability
      },
      niveau_risque: riskLevel,
      actions_recommandees: actions,
      strategie_retention: strategy,
      probabilite_conversion: conversionProbability,
      message_personnalise: personalizedMessage
    };
  }

  /**
   * Analyse un groupe de clients et retourne les insights
   */
  async analyzeClientBatch(clients: ClientProfile[]): Promise<ClientInsight[]> {
    const insights: ClientInsight[] = [];
    
    for (const client of clients) {
      const insight = await this.analyzeClient(client);
      insights.push(insight);
    }
    
    // Tri par niveau de risque (critique en premier)
    return insights.sort((a, b) => {
      const riskOrder = { "critique": 4, "élevé": 3, "moyen": 2, "faible": 1 };
      return riskOrder[b.niveau_risque] - riskOrder[a.niveau_risque];
    });
  }

  /**
   * Génère un rapport d'analyse globale
   */
  generateAnalyticsReport(insights: ClientInsight[]) {
    const total = insights.length;
    const critique = insights.filter(i => i.niveau_risque === "critique").length;
    const élevé = insights.filter(i => i.niveau_risque === "élevé").length;
    const moyen = insights.filter(i => i.niveau_risque === "moyen").length;
    const faible = insights.filter(i => i.niveau_risque === "faible").length;
    
    const averageCancellationRate = insights.reduce((sum, i) => sum + i.client.taux_annulation, 0) / total;
    const clientsAtRisk = critique + élevé;
    const avgConversionProbability = insights.reduce((sum, i) => sum + i.probabilite_conversion, 0) / total;
    
    return {
      resume: {
        total_clients: total,
        clients_a_risque: clientsAtRisk,
        taux_annulation_moyen: Math.round(averageCancellationRate),
        probabilite_conversion_moyenne: Math.round(avgConversionProbability * 100)
      },
      repartition_risques: {
        critique,
        élevé,
        moyen,
        faible
      },
      actions_prioritaires: insights
        .filter(i => i.niveau_risque === "critique" || i.niveau_risque === "élevé")
        .slice(0, 5)
        .map(i => ({
          client: i.client.nom,
          niveau: i.niveau_risque,
          action_immediate: i.actions_recommandees[0]
        }))
    };
  }
}

export const clientAnalyticsService = new ClientAnalyticsService();