/**
 * ⚡ UTILITAIRE STRIPE - GESTION SÉCURISÉE DES MONTANTS
 * 
 * Ce module gère la conversion sécurisée des montants pour Stripe
 * en évitant les doubles conversions et en normalisant les formats
 */

export interface AmountValidationResult {
  success: boolean;
  amountInCents: number;
  amountInEuros: number;
  originalInput: any;
  detectedFormat: 'euros' | 'cents' | 'invalid';
  logs: string[];
}

/**
 * Normalise les séparateurs décimaux français/européens
 * 11,70 → 11.70
 * 11.70 → 11.70 (inchangé)
 * 11 → 11.0
 */
export function normalizeDecimalSeparator(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value !== 'string') {
    throw new Error(`Format invalide: ${typeof value} - attendu string ou number`);
  }
  
  // Remplacer la virgule par un point pour normaliser (gestion spéciale des décimales)
  const normalized = value.trim().replace(',', '.');
  
  // Validation que c'est bien un format numérique valide
  if (!/^[0-9]+(\.[0-9]+)?$/.test(normalized)) {
    throw new Error(`Format numérique invalide: "${value}"`);
  }
  
  const parsed = parseFloat(normalized);
  
  if (isNaN(parsed)) {
    throw new Error(`Impossible de convertir "${value}" en nombre`);
  }
  
  // Arrondir à 2 décimales pour éviter les erreurs de floating point
  return Math.round(parsed * 100) / 100;
}

/**
 * Convertit intelligemment un montant en centimes pour Stripe
 * Évite les doubles conversions et gère tous les formats d'entrée
 */
export function validateAndConvertAmount(input: any, context = 'payment'): AmountValidationResult {
  const logs: string[] = [];
  logs.push(`🔍 [${context}] Validation montant - Input: ${JSON.stringify(input)} (type: ${typeof input})`);
  
  try {
    // Étape 1: Normalisation
    const normalizedAmount = normalizeDecimalSeparator(input);
    logs.push(`📐 Montant normalisé: ${normalizedAmount}`);
    
    // Étape 2: Validation base
    if (!normalizedAmount || isNaN(normalizedAmount) || normalizedAmount <= 0) {
      logs.push(`❌ Montant invalide: ${normalizedAmount}`);
      return {
        success: false,
        amountInCents: 0,
        amountInEuros: 0,
        originalInput: input,
        detectedFormat: 'invalid',
        logs
      };
    }
    
    // Étape 3: Détection automatique du format
    let detectedFormat: 'euros' | 'cents';
    let amountInEuros: number;
    let amountInCents: number;
    
    if (normalizedAmount <= 999) {
      // Petite valeur = probablement en euros (11.70€, 65€, 120€)
      detectedFormat = 'euros';
      amountInEuros = normalizedAmount;
      amountInCents = Math.round(normalizedAmount * 100);
      logs.push(`💶 Détecté EUROS: ${amountInEuros}€ → ${amountInCents} centimes`);
    } else {
      // Grande valeur = probablement déjà en centimes (1170, 6500, 12000)
      detectedFormat = 'cents';
      amountInCents = Math.round(normalizedAmount);
      amountInEuros = normalizedAmount / 100;
      logs.push(`🪙 Détecté CENTIMES: ${normalizedAmount} centimes → ${amountInEuros.toFixed(2)}€`);
    }
    
    // Étape 4: Validation finale
    if (amountInCents < 50) { // Minimum Stripe = 0.50€
      logs.push(`❌ Montant trop faible: ${amountInCents} centimes (minimum 50 centimes)`);
      return {
        success: false,
        amountInCents: 0,
        amountInEuros: 0,
        originalInput: input,
        detectedFormat,
        logs
      };
    }
    
    logs.push(`✅ Conversion réussie: ${amountInEuros.toFixed(2)}€ = ${amountInCents} centimes`);
    
    return {
      success: true,
      amountInCents,
      amountInEuros,
      originalInput: input,
      detectedFormat,
      logs
    };
    
  } catch (error: any) {
    logs.push(`❌ Erreur conversion: ${error.message}`);
    return {
      success: false,
      amountInCents: 0,
      amountInEuros: 0,
      originalInput: input,
      detectedFormat: 'invalid',
      logs
    };
  }
}

/**
 * Configuration Stripe avec 3D Secure obligatoire
 */
export function getStripeSessionConfig() {
  return {
    payment_method_types: ['card'],
    payment_intent_data: {
      setup_future_usage: 'off_session',
      payment_method_options: {
        card: {
          request_three_d_secure: 'any', // ✅ 3D Secure systématique
        },
      },
    },
  };
}

/**
 * Fonction de test pour valider différents formats d'entrée
 */
export function testAmountConversions() {
  const testCases = [
    { input: "11,70", expectedCents: 1170, expectedEuros: 11.70 },
    { input: "11.70", expectedCents: 1170, expectedEuros: 11.70 },
    { input: "11", expectedCents: 1100, expectedEuros: 11.00 },
    { input: 11.70, expectedCents: 1170, expectedEuros: 11.70 },
    { input: 65, expectedCents: 6500, expectedEuros: 65.00 },
    { input: 120.50, expectedCents: 12050, expectedEuros: 120.50 },
    { input: 1170, expectedCents: 1170, expectedEuros: 11.70 }, // Déjà en centimes
    { input: 6500, expectedCents: 6500, expectedEuros: 65.00 }, // Déjà en centimes
  ];
  
  console.log('\n🧪 === TEST CONVERSION MONTANTS STRIPE ===');
  
  const results = testCases.map(testCase => {
    const result = validateAndConvertAmount(testCase.input, 'test');
    const success = result.success && 
                   result.amountInCents === testCase.expectedCents &&
                   Math.abs(result.amountInEuros - testCase.expectedEuros) < 0.01;
    
    console.log(`${success ? '✅' : '❌'} ${testCase.input} → ${result.amountInCents} centimes (attendu: ${testCase.expectedCents})`);
    
    if (!success) {
      console.log(`   🔍 Détails: euros=${result.amountInEuros}, attendu=${testCase.expectedEuros}`);
      result.logs.forEach(log => console.log(`   ${log}`));
    }
    
    return { ...testCase, result, success };
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n📊 Tests réussis: ${successCount}/${testCases.length}`);
  
  if (successCount === testCases.length) {
    console.log('🎉 TOUS LES TESTS RÉUSSIS - Conversion montants fiable !');
  } else {
    console.log('❌ ÉCHECS DÉTECTÉS - Vérifiez la logique de conversion');
  }
  
  return results;
}