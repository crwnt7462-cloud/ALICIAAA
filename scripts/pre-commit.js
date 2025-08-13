#!/usr/bin/env node

/**
 * Script pre-commit pour valider le code
 * Usage: node scripts/pre-commit.js
 */

import { spawn } from 'child_process';

async function runCommand(command, args, description) {
  console.log(`\n🔍 ${description}...`);
  
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit'
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} - Succès`);
        resolve(code);
      } else {
        console.log(`❌ ${description} - Échec`);
        reject(new Error(`${description} failed with code ${code}`));
      }
    });

    process.on('error', (error) => {
      console.error(`Erreur lors de l'exécution de ${description}:`, error);
      reject(error);
    });
  });
}

async function main() {
  console.log('🚀 Démarrage des vérifications pre-commit...\n');

  try {
    // 1. Vérification TypeScript
    await runCommand('node', ['scripts/typecheck.js'], 'Vérification TypeScript');

    // 2. Vérification des cycles de dépendances
    await runCommand('node', ['scripts/check-cycles.js'], 'Vérification des cycles');

    // 3. ESLint sera ajouté plus tard
    console.log('\n🎉 Toutes les vérifications pre-commit sont passées !');
    process.exit(0);

  } catch (error) {
    console.error('\n💥 Échec des vérifications pre-commit:', error.message);
    console.error('\n❌ Commit refusé. Veuillez corriger les erreurs avant de committer.');
    process.exit(1);
  }
}

main();