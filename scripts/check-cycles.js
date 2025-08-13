#!/usr/bin/env node

/**
 * Script pour détecter les dépendances circulaires
 * Usage: node scripts/check-cycles.js
 */

import { spawn } from 'child_process';

function runMadge() {
  return new Promise((resolve, reject) => {
    const madge = spawn('npx', ['madge', 'client/src', '--circular', '--extensions', 'ts,tsx,js,jsx'], {
      stdio: 'inherit'
    });

    madge.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Aucune dépendance circulaire détectée');
        resolve(code);
      } else {
        console.log('❌ Dépendances circulaires détectées');
        reject(new Error(`Madge exited with code ${code}`));
      }
    });

    madge.on('error', (error) => {
      console.error('Erreur lors de l\'exécution de madge:', error);
      reject(error);
    });
  });
}

async function main() {
  try {
    await runMadge();
    process.exit(0);
  } catch (error) {
    console.error('Échec de la vérification des cycles:', error.message);
    process.exit(1);
  }
}

main();