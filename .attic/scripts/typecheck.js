#!/usr/bin/env node

/**
 * Script pour vérifier les types TypeScript
 * Usage: node scripts/typecheck.js
 */

import { spawn } from 'child_process';

function runTypeCheck() {
  return new Promise((resolve, reject) => {
    const tsc = spawn('npx', ['tsc', '--noEmit'], {
      stdio: 'inherit'
    });

    tsc.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Vérification TypeScript réussie');
        resolve(code);
      } else {
        console.log('❌ Erreurs TypeScript détectées');
        reject(new Error(`TypeScript check failed with code ${code}`));
      }
    });

    tsc.on('error', (error) => {
      console.error('Erreur lors de l\'exécution de tsc:', error);
      reject(error);
    });
  });
}

async function main() {
  try {
    await runTypeCheck();
    process.exit(0);
  } catch (error) {
    console.error('Échec de la vérification TypeScript:', error.message);
    process.exit(1);
  }
}

main();