// ─── SUPABASE AUDIT (boot info, sans secrets) ─────────────────────────────────
const AUDIT_SUPABASE = process.env.AUDIT_SUPABASE === '1';
if (AUDIT_SUPABASE) {
  try {
    const u = process.env.SUPABASE_URL || '';
    const m = u.match(/^https:\/\/([a-z0-9]{20})\.supabase\.co/i);
    const ref = m ? m[1] : 'unknown';
    console.log(`[AUDIT][supabase][boot] projectRef=${ref.slice(0,6)} urlHost=${new URL(u).host}`);
  } catch { /* ignore */ }
}
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour Replit
export const SUPABASE_CONFIG = {
  // Activer Supabase pour fonctionnalités temps réel
  USE_SUPABASE: true, // Activé pour le temps réel !
  
  // Vérifier si les clés Supabase sont disponibles
  hasSupabaseSecrets(): boolean {
    return !!(
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_ANON_KEY
    );
  },
  
  // Log de l'état
  logStatus() {
    if (this.USE_SUPABASE) {
      if (this.hasSupabaseSecrets()) {
        console.log('🚀 Supabase configuré et activé - Temps réel disponible !');
      } else {
        console.log('⚠️ Supabase activé mais clés manquantes');
        console.log('   Ajoutez SUPABASE_URL et SUPABASE_ANON_KEY dans les secrets');
      }
    } else {
      console.log('📋 Supabase disponible mais désactivé - Utilisez WebSockets natifs');
    }
  }
};

// Client Supabase (sera undefined si pas de clés)
export const supabase = SUPABASE_CONFIG.hasSupabaseSecrets() ? 
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  ) : null;

// Instructions pour configurer Supabase
export const SUPABASE_INSTRUCTIONS = `
🚀 POUR CONFIGURER SUPABASE (Alternative Firebase) :

1. Créez un compte gratuit sur https://supabase.com
2. Créez un nouveau projet
3. Dans Settings → API, copiez :
   - Project URL → SUPABASE_URL
   - anon/public key → SUPABASE_ANON_KEY
4. Ajoutez ces secrets dans Replit
5. Changez USE_SUPABASE à true dans ce fichier

AVANTAGES SUPABASE :
✅ Base de données PostgreSQL temps réel
✅ Authentification Google/GitHub/Email intégrée  
✅ Storage de fichiers automatique
✅ Dashboard admin complet
✅ WebSockets automatiques sur changements BDD
✅ Compatible 100% avec votre code PostgreSQL existant
✅ Gratuit jusqu'à 50MB + 2 Go de bande passante

FONCTIONNALITÉS TEMPS RÉEL :
- Notifications automatiques nouveaux RDV
- Synchronisation live entre pros et clients  
- Chat temps réel intégré
- Mises à jour planning instantanées
- Alertes stock en temps réel
`;

// Service de notifications temps réel Supabase
export class SupabaseRealtimeService {
  private subscriptions: any[] = [];

  // Écouter les nouveaux rendez-vous
  subscribeToAppointments(callback: (appointment: any) => void) {
    if (!supabase) return null;
    
    const subscription = supabase
      .channel('appointments_realtime')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('🔔 Nouveau RDV temps réel !', payload.new);
          callback(payload.new);
        }
      )
      .subscribe();
    
    this.subscriptions.push(subscription);
    return subscription;
  }

  // Écouter les modifications de planning
  subscribeToPlanningUpdates(callback: (update: any) => void) {
    if (!supabase) return null;
    
    const subscription = supabase
      .channel('planning_updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('📅 Mise à jour planning !', payload);
          callback(payload);
        }
      )
      .subscribe();
    
    this.subscriptions.push(subscription);
    return subscription;
  }

  // Écouter les messages de chat
  subscribeToChatMessages(callback: (message: any) => void) {
    if (!supabase) return null;
    
    const subscription = supabase
      .channel('chat_messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('💬 Nouveau message temps réel !', payload.new);
          callback(payload.new);
        }
      )
      .subscribe();
    
    this.subscriptions.push(subscription);
    return subscription;
  }

  // Nettoyer les subscriptions
  unsubscribeAll() {
    this.subscriptions.forEach(sub => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    });
    this.subscriptions = [];
  }
}

export const realtimeService = new SupabaseRealtimeService();

// Log de démarrage Supabase
if (AUDIT_SUPABASE) {
  try {
    const u = process.env.SUPABASE_URL || '';
    const m = u.match(/^https:\/\/([a-z0-9]{20})\.supabase\.co/i);
    const ref = m ? m[1] : 'unknown';
    if (ref) {
      console.log(`[AUDIT][supabase][realtime] projectRef=${ref.slice(0,6)} urlHost=${new URL(u).host}`);
    }
  } catch {
    // Ignore errors
  }
}