#!/bin/bash
set -euo pipefail

# ── Infos projet ───────────────────────────────────────
PROJECT_REF="efkekkajoyfgtyqziohy"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzgyOTQsImV4cCI6MjA3Mjg1NDI5NH0.EP-EH8LWjeE7HXWPZyelLqdA4iCyfjmD7FnTu2fIMSA"
EMAIL="correct@gmail.com"
PASSWORD="667ryan"
# ───────────────────────────────────────────────────────

LOGIN_JSON="/tmp/sb_login.json"

curl -sS -f -X POST "https://${PROJECT_REF}.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  --data "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}" \
  > "${LOGIN_JSON}"

# Affiche soit le JWT, soit le message d'erreur renvoyé par Supabase
if command -v jq >/dev/null 2>&1; then
  jq -r '.access_token // .error_description // .message' "${LOGIN_JSON}"
else
  python3 - <<'PY' "${LOGIN_JSON}"
import json,sys
j=json.load(open(sys.argv[1]))
print(j.get("access_token") or j.get("error_description") or j.get("message") or j)
PY
fi

# Bonus: afficher le sub (UID) si Node est dispo et qu'on a bien un token
if command -v node >/dev/null 2>&1; then
  node - <<'JS' "${LOGIN_JSON}"
const fs=require('fs'), p=process.argv[2];
const j=JSON.parse(fs.readFileSync(p,'utf8'));
if(!j.access_token){ process.exit(0); }
const payload=JSON.parse(Buffer.from(j.access_token.split('.')[1],'base64url').toString());
console.log("SUB (user id):", payload.sub);
JS
fi

echo "Réponse complète enregistrée dans ${LOGIN_JSON}"



// Script Node.js pour obtenir un JWT Supabase pour un utilisateur donné
// Usage : node get-jwt.js
// (pense à installer @supabase/supabase-js : npm install @supabase/supabase-js)

const { createClient } = require('@supabase/supabase-js');

// Renseigne ici l'URL de ton projet Supabase et la clé (anon ou service_role)
const supabaseUrl = 'https://efkekkajoyfgtyqziohy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzgyOTQsImV4cCI6MjA3Mjg1NDI5NH0.EP-EH8LWjeE7HXWPZyelLqdA4iCyfjmD7FnTu2fIMSA';

// Identifiants de l'utilisateur à authentifier
const email = 'correct@gmail.com'; // ou correct@gmail.com
const password = '667ryan'; // à renseigner

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error("Erreur d'authentification :", error.message);
    process.exit(1);
  }
  if (!data.session || !data.session.access_token) {
    console.error('Aucun access_token retourné.');
    process.exit(1);
  }
  console.log(data.session.access_token);
})();