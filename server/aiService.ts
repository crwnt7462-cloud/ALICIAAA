import OpenAI from "openai";

// Service IA pour optimisation planning et insights business
class AIService {
  private openai: OpenAI | null = null;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!process.env.OPENAI_API_KEY;
    if (this.isConfigured) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  async optimizeSchedule(appointments: any[], services: any[], staff: any[]): Promise<any> {
    if (!this.isConfigured) {
      console.warn('🤖 OpenAI non configuré - optimisation désactivée');
      return { suggestions: [], optimized: false };
    }

    try {
      const prompt = `
        Analysez ce planning de salon de beauté et proposez des optimisations:
        
        Rendez-vous: ${JSON.stringify(appointments)}
        Services: ${JSON.stringify(services)}
        Staff: ${JSON.stringify(staff)}
        
        Répondez en JSON avec:
        {
          "suggestions": ["suggestion1", "suggestion2"],
          "conflicts": ["conflit1"],
          "optimization_score": 85,
          "recommended_changes": []
        }
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('🤖 Planning optimisé par IA');
      return result;
    } catch (error) {
      console.error('❌ Erreur optimisation IA:', error);
      return { suggestions: [], optimized: false };
    }
  }

  async generateBusinessInsights(data: any): Promise<any> {
    if (!this.isConfigured) {
      console.warn('🤖 OpenAI non configuré - insights désactivés');
      return { insights: [], recommendations: [] };
    }

    try {
      const prompt = `
        Analysez ces données de salon de beauté et générez des insights business:
        
        ${JSON.stringify(data)}
        
        Répondez en JSON avec:
        {
          "key_insights": ["insight1", "insight2"],
          "recommendations": ["rec1", "rec2"],
          "trends": ["trend1"],
          "alerts": ["alert1"],
          "performance_score": 78
        }
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('📊 Insights business générés par IA');
      return result;
    } catch (error) {
      console.error('❌ Erreur insights IA:', error);
      return { insights: [], recommendations: [] };
    }
  }

  async chatAssistant(userMessage: string, context: any = {}): Promise<string> {
    if (!this.isConfigured) {
      return "Assistant IA non configuré. Veuillez ajouter votre clé OpenAI.";
    }

    try {
      const systemPrompt = `
        Vous êtes l'assistant IA d'une plateforme de gestion de salon de beauté.
        Aidez les professionnels avec des conseils pratiques et des réponses claires.
        
        Contexte utilisateur: ${JSON.stringify(context)}
        
        Répondez de manière concise et professionnelle en français.
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
      });

      return response.choices[0].message.content || "Désolé, je n'ai pas pu traiter votre demande.";
    } catch (error) {
      console.error('❌ Erreur chat IA:', error);
      return "Une erreur s'est produite. Réessayez plus tard.";
    }
  }

  async predictDemand(historicalData: any[]): Promise<any> {
    if (!this.isConfigured) {
      return { predictions: [], confidence: 0 };
    }

    try {
      const prompt = `
        Analysez ces données historiques de salon de beauté et prédisez la demande:
        
        ${JSON.stringify(historicalData)}
        
        Répondez en JSON avec:
        {
          "next_week_predictions": [{"day": "lundi", "predicted_bookings": 12}],
          "peak_hours": ["14:00-16:00"],
          "recommended_promotions": ["promo1"],
          "confidence_score": 85
        }
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('📈 Prédictions de demande générées');
      return result;
    } catch (error) {
      console.error('❌ Erreur prédiction IA:', error);
      return { predictions: [], confidence: 0 };
    }
  }

  async analyzeClientBehavior(clientData: any): Promise<any> {
    if (!this.isConfigured) {
      return { analysis: "IA non configurée", recommendations: [] };
    }

    try {
      const prompt = `
        Analysez le comportement de ce client de salon de beauté:
        
        ${JSON.stringify(clientData)}
        
        Répondez en JSON avec:
        {
          "client_type": "fidèle|occasionnel|nouveau",
          "preferences": ["service1", "service2"],
          "best_contact_time": "14:00-16:00",
          "retention_risk": "faible|moyen|élevé",
          "personalized_offers": ["offre1"]
        }
      `;

      const response = await this.openai!.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('👤 Comportement client analysé');
      return result;
    } catch (error) {
      console.error('❌ Erreur analyse client:', error);
      return { analysis: "Erreur analyse", recommendations: [] };
    }
  }

  // MÉTHODE MANQUANTE - generateResponse pour compatibility avec routes
  async generateResponse(message: string): Promise<string> {
    return await this.chatAssistant(message, {});
  }
}

export const aiService = new AIService();