// Test rapide des conversions Stripe
console.log('🧪 Test conversion montants en direct...\n');

async function testAmount(amount, expectedEuros, expectedCents) {
  try {
    const response = await fetch('http://localhost:5000/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    
    const data = await response.json();
    
    if (data.success) {
      const success = Math.abs(data.amount - expectedEuros) < 0.01;
      console.log(`${success ? '✅' : '❌'} ${JSON.stringify(amount)} → ${data.amount}€ (attendu: ${expectedEuros}€)`);
      
      if (data.amountInCents) {
        const centSuccess = data.amountInCents === expectedCents;
        console.log(`   Centimes: ${data.amountInCents} (attendu: ${expectedCents}) ${centSuccess ? '✅' : '❌'}`);
      }
    } else {
      console.log(`❌ ${JSON.stringify(amount)} → ERREUR: ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ ${JSON.stringify(amount)} → ERREUR RÉSEAU: ${error.message}`);
  }
}

async function runTests() {
  await testAmount("11,70", 11.70, 1170);
  await testAmount("11.70", 11.70, 1170);  
  await testAmount("65", 65.00, 6500);
  await testAmount(65, 65.00, 6500);
  await testAmount("120,50", 120.50, 12050);
  await testAmount(1170, 11.70, 1170); // Déjà en centimes
  
  console.log('\n🎯 Test terminé !');
}

runTests().catch(console.error);