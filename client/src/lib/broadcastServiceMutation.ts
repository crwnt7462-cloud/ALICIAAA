// Utilitaire de broadcast pour la synchro multi-onglets des services
// Utilise BroadcastChannel si dispo, sinon fallback localStorage

export function broadcastServiceMutation(
  salonId: string,
  serviceId: string | number | null = null,
  op: 'create' | 'update' | 'delete' = 'update'
) {
  // Log pour debug/acceptation
  console.log('mutation_success', { salonId, serviceId, op });

  // Préparer le message
  const payload = {
    salonId,
    serviceId,
    op,
    timestamp: Date.now(),
  };

  // BroadcastChannel natif
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    const channel = new BroadcastChannel('services-sync');
    channel.postMessage(payload);
    channel.close();
  } else {
    // Fallback: localStorage event
    localStorage.setItem('services-sync', JSON.stringify(payload));
    // Nettoyage rapide pour éviter la persistance
    setTimeout(() => localStorage.removeItem('services-sync'), 100);
  }
}
