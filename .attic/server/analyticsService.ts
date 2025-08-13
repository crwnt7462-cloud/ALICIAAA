import { db } from "./db";
import { appointments, services, clients, users } from "@shared/schema";
import { eq, desc, sql, gte, lte, and } from "drizzle-orm";
import { aiService } from "./aiService";

export interface AnalyticsData {
  totalRevenue: number;
  totalAppointments: number;
  averageTicket: number;
  clientRetention: number;
  popularServices: Array<{ name: string; count: number; revenue: number }>;
  dailyRevenue: Array<{ date: string; revenue: number }>;
  monthlyGrowth: number;
  topClients: Array<{ name: string; email: string; totalSpent: number; visits: number }>;
  staffPerformance: Array<{ staffId: number; appointments: number; revenue: number }>;
  peakHours: Array<{ hour: number; appointments: number }>;
}

export class AnalyticsService {
  // Obtenir les analytics complètes d'un salon
  async getBusinessAnalytics(userId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<AnalyticsData> {
    try {
      const dateRange = this.getDateRange(period);
      
      // Requêtes parallèles pour toutes les métriques
      const [
        revenueData,
        appointmentStats,
        serviceStats,
        clientStats,
        dailyRevenue
      ] = await Promise.all([
        this.getTotalRevenue(userId, dateRange),
        this.getAppointmentStats(userId, dateRange),
        this.getServiceStats(userId, dateRange),
        this.getClientStats(userId, dateRange),
        this.getDailyRevenue(userId, dateRange)
      ]);

      const analytics: AnalyticsData = {
        totalRevenue: revenueData.total,
        totalAppointments: appointmentStats.total,
        averageTicket: appointmentStats.total > 0 ? revenueData.total / appointmentStats.total : 0,
        clientRetention: clientStats.retention,
        popularServices: serviceStats,
        dailyRevenue: dailyRevenue,
        monthlyGrowth: await this.calculateGrowth(userId, period),
        topClients: await this.getTopClients(userId, dateRange),
        staffPerformance: await this.getStaffPerformance(userId, dateRange),
        peakHours: await this.getPeakHours(userId, dateRange)
      };

      // Générer des insights IA
      const insights = await this.generateBusinessInsights(analytics);
      
      console.log(`📊 Analytics générées pour ${period}: ${revenueData.total}€ de CA, ${appointmentStats.total} RDV`);
      
      return {
        ...analytics,
        insights
      } as any;

    } catch (error) {
      console.error("Erreur lors de la génération d'analytics:", error);
      throw error;
    }
  }

  // Calculer le chiffre d'affaires total
  private async getTotalRevenue(userId: string, dateRange: { start: string; end: string }): Promise<{ total: number }> {
    const result = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${appointments.totalPrice} AS DECIMAL)), 0)`
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, dateRange.start),
          lte(appointments.appointmentDate, dateRange.end),
          eq(appointments.status, "completed")
        )
      );

    return { total: Number(result[0]?.total || 0) };
  }

  // Statistiques des rendez-vous
  private async getAppointmentStats(userId: string, dateRange: { start: string; end: string }): Promise<{ total: number }> {
    const result = await db
      .select({
        total: sql<number>`COUNT(*)`
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, dateRange.start),
          lte(appointments.appointmentDate, dateRange.end)
        )
      );

    return { total: Number(result[0]?.total || 0) };
  }

  // Services les plus populaires
  private async getServiceStats(userId: string, dateRange: { start: string; end: string }): Promise<Array<{ name: string; count: number; revenue: number }>> {
    const result = await db
      .select({
        name: appointments.serviceName,
        count: sql<number>`COUNT(*)`,
        revenue: sql<number>`COALESCE(SUM(CAST(${appointments.totalPrice} AS DECIMAL)), 0)`
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, dateRange.start),
          lte(appointments.appointmentDate, dateRange.end)
        )
      )
      .groupBy(appointments.serviceName)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(10);

    return result.map(row => ({
      name: row.name,
      count: Number(row.count),
      revenue: Number(row.revenue)
    }));
  }

  // Statistiques clients
  private async getClientStats(userId: string, dateRange: { start: string; end: string }): Promise<{ retention: number }> {
    // Calculer le taux de rétention simplifié
    const totalClients = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${appointments.clientEmail})`
      })
      .from(appointments)
      .where(eq(appointments.userId, userId));

    const returningClients = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${appointments.clientEmail})`
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          sql`${appointments.clientEmail} IN (
            SELECT ${appointments.clientEmail} 
            FROM ${appointments} 
            WHERE ${appointments.userId} = ${userId}
            GROUP BY ${appointments.clientEmail} 
            HAVING COUNT(*) > 1
          )`
        )
      );

    const retention = Number(totalClients[0]?.count) > 0 
      ? (Number(returningClients[0]?.count) / Number(totalClients[0]?.count)) * 100 
      : 0;

    return { retention: Math.round(retention) };
  }

  // Chiffre d'affaires quotidien
  private async getDailyRevenue(userId: string, dateRange: { start: string; end: string }): Promise<Array<{ date: string; revenue: number }>> {
    const result = await db
      .select({
        date: appointments.appointmentDate,
        revenue: sql<number>`COALESCE(SUM(CAST(${appointments.totalPrice} AS DECIMAL)), 0)`
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, dateRange.start),
          lte(appointments.appointmentDate, dateRange.end),
          eq(appointments.status, "completed")
        )
      )
      .groupBy(appointments.appointmentDate)
      .orderBy(appointments.appointmentDate);

    return result.map(row => ({
      date: row.date,
      revenue: Number(row.revenue)
    }));
  }

  // Meilleurs clients
  private async getTopClients(userId: string, dateRange: { start: string; end: string }): Promise<Array<{ name: string; email: string; totalSpent: number; visits: number }>> {
    const result = await db
      .select({
        name: appointments.clientName,
        email: appointments.clientEmail,
        totalSpent: sql<number>`COALESCE(SUM(CAST(${appointments.totalPrice} AS DECIMAL)), 0)`,
        visits: sql<number>`COUNT(*)`
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, dateRange.start),
          lte(appointments.appointmentDate, dateRange.end)
        )
      )
      .groupBy(appointments.clientEmail, appointments.clientName)
      .orderBy(sql`SUM(CAST(${appointments.totalPrice} AS DECIMAL)) DESC`)
      .limit(10);

    return result.map(row => ({
      name: row.name,
      email: row.email,
      totalSpent: Number(row.totalSpent),
      visits: Number(row.visits)
    }));
  }

  // Performance du staff
  private async getStaffPerformance(userId: string, dateRange: { start: string; end: string }): Promise<Array<{ staffId: number; appointments: number; revenue: number }>> {
    const result = await db
      .select({
        staffId: appointments.staffId,
        appointments: sql<number>`COUNT(*)`,
        revenue: sql<number>`COALESCE(SUM(CAST(${appointments.totalPrice} AS DECIMAL)), 0)`
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, dateRange.start),
          lte(appointments.appointmentDate, dateRange.end),
          sql`${appointments.staffId} IS NOT NULL`
        )
      )
      .groupBy(appointments.staffId)
      .orderBy(sql`SUM(CAST(${appointments.totalPrice} AS DECIMAL)) DESC`);

    return result.map(row => ({
      staffId: Number(row.staffId),
      appointments: Number(row.appointments),
      revenue: Number(row.revenue)
    }));
  }

  // Heures de pointe
  private async getPeakHours(userId: string, dateRange: { start: string; end: string }): Promise<Array<{ hour: number; appointments: number }>> {
    const result = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM CAST(${appointments.startTime} AS TIME))`,
        appointments: sql<number>`COUNT(*)`
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.appointmentDate, dateRange.start),
          lte(appointments.appointmentDate, dateRange.end)
        )
      )
      .groupBy(sql`EXTRACT(HOUR FROM CAST(${appointments.startTime} AS TIME))`)
      .orderBy(sql`COUNT(*) DESC`);

    return result.map(row => ({
      hour: Number(row.hour),
      appointments: Number(row.appointments)
    }));
  }

  // Calculer la croissance
  private async calculateGrowth(userId: string, period: 'week' | 'month' | 'year'): Promise<number> {
    const currentRange = this.getDateRange(period);
    const previousRange = this.getPreviousDateRange(period);

    const [currentRevenue, previousRevenue] = await Promise.all([
      this.getTotalRevenue(userId, currentRange),
      this.getTotalRevenue(userId, previousRange)
    ]);

    if (previousRevenue.total === 0) return 0;

    const growth = ((currentRevenue.total - previousRevenue.total) / previousRevenue.total) * 100;
    return Math.round(growth * 100) / 100; // Arrondir à 2 décimales
  }

  // Générer des insights IA
  private async generateBusinessInsights(analytics: AnalyticsData): Promise<string[]> {
    try {
      const prompt = `Analyse ces données de salon de beauté et génère 3 insights pertinents:

Chiffre d'affaires: ${analytics.totalRevenue}€
Nombre de rendez-vous: ${analytics.totalAppointments}
Ticket moyen: ${analytics.averageTicket.toFixed(2)}€
Taux de rétention: ${analytics.clientRetention}%
Croissance: ${analytics.monthlyGrowth}%

Services populaires: ${analytics.popularServices.slice(0, 3).map(s => `${s.name} (${s.count} RDV)`).join(', ')}

Génère 3 conseils business courts et pratiques (max 50 mots chacun):`;

      const insights = await aiService.generateChatResponse(prompt);
      
      // Parser la réponse en array d'insights
      return insights.split('\n').filter(line => line.trim().length > 0).slice(0, 3);

    } catch (error) {
      console.error("Erreur lors de la génération d'insights:", error);
      return [
        "Optimisez vos créneaux pendant les heures de pointe pour maximiser le chiffre d'affaires.",
        "Proposez des forfaits pour fidéliser vos clients réguliers et augmenter le ticket moyen.",
        "Analysez les services les moins demandés pour adapter votre offre aux besoins clients."
      ];
    }
  }

  // Obtenir la plage de dates selon la période
  private getDateRange(period: 'week' | 'month' | 'year'): { start: string; end: string } {
    const now = new Date();
    const end = now.toISOString().split('T')[0];
    
    let start: Date;
    switch (period) {
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return {
      start: start.toISOString().split('T')[0],
      end
    };
  }

  // Obtenir la plage de dates précédente
  private getPreviousDateRange(period: 'week' | 'month' | 'year'): { start: string; end: string } {
    const current = this.getDateRange(period);
    const currentStart = new Date(current.start);
    const currentEnd = new Date(current.end);
    
    const duration = currentEnd.getTime() - currentStart.getTime();
    
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - duration);

    return {
      start: previousStart.toISOString().split('T')[0],
      end: previousEnd.toISOString().split('T')[0]
    };
  }

  // Prédictions de revenus avec IA
  async generateRevenueForecast(userId: string): Promise<{ prediction: number; confidence: number; factors: string[] }> {
    try {
      const analytics = await this.getBusinessAnalytics(userId, 'month');
      
      const prompt = `Basé sur ces données de salon:
- CA mensuel: ${analytics.totalRevenue}€
- Croissance: ${analytics.monthlyGrowth}%
- ${analytics.totalAppointments} RDV/mois
- Rétention: ${analytics.clientRetention}%

Prédis le CA du mois prochain (nombre entier) et donne un score de confiance 0-100:`;

      const forecast = await aiService.generateChatResponse(prompt);
      
      // Parser la réponse (format simple pour démo)
      const lines = forecast.split('\n');
      const predictionMatch = lines.find(l => l.includes('€'))?.match(/(\d+)/);
      const confidenceMatch = lines.find(l => l.includes('%'))?.match(/(\d+)/);
      
      return {
        prediction: predictionMatch ? parseInt(predictionMatch[1]) : Math.round(analytics.totalRevenue * 1.1),
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 75,
        factors: [
          `Tendance actuelle: ${analytics.monthlyGrowth > 0 ? 'croissance' : 'baisse'} de ${Math.abs(analytics.monthlyGrowth)}%`,
          `Rétention clients: ${analytics.clientRetention}%`,
          `Activité récente: ${analytics.totalAppointments} RDV ce mois`
        ]
      };

    } catch (error) {
      console.error("Erreur lors de la prédiction:", error);
      return {
        prediction: 0,
        confidence: 0,
        factors: ["Données insuffisantes pour la prédiction"]
      };
    }
  }
}

export const analyticsService = new AnalyticsService();