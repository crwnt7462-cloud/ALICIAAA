// Wrapper global pour traquer toutes les navigations vers /search
export const createNavigationWrapper = (originalSetLocation: any) => {
  return (destination: string) => {
    if (destination === '/search' || destination.includes('/search')) {
      console.warn('[REDIRECT] DETECTED!', {
        destination,
        timestamp: new Date().toISOString(),
        stack: new Error().stack,
        userAgent: navigator.userAgent
      });
      console.warn('🚨 REDIRECTION VERS /search - STACK TRACE:', new Error().stack);
    }
    
    console.log('[NAV] router=wouter, action=navigate, from=' + window.location.pathname + ', to=' + destination, 'timestamp=' + Date.now());
    return originalSetLocation(destination);
  };
};

// Créer un hook wrapper pour useLocation
export const useLocationWrapper = (originalUseLocation: any) => {
  const [location, originalSetLocation] = originalUseLocation();
  const wrappedSetLocation = createNavigationWrapper(originalSetLocation);
  
  return [location, wrappedSetLocation];
};