// Test simple de l'API des professionnels
const salonId = "demo-salon-id";

async function testProfessionalsAPI() {
  try {
    console.log('Testing professionals API...');
    const response = await fetch(`/api/salons/${salonId}/professionals`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const professionals = await response.json();
    console.log('API Response:', professionals);
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

// Exporter pour pouvoir l'utiliser
if (typeof window !== 'undefined') {
  (window as any).testProfessionalsAPI = testProfessionalsAPI;
}

export { testProfessionalsAPI };