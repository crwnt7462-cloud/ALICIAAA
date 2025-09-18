#!/bin/bash
set -euo pipefail

PROJECT_REF="efkekkajoyfgtyqziohy"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2Vra2Fqb3lmZ3R5cXppb2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzgyOTQsImV4cCI6MjA3Mjg1NDI5NH0.EP-EH8LWjeE7HXWPZyelLqdA4iCyfjmD7FnTu2fIMSA"
EMAIL="correct@gmail.com"
PASSWORD="667ryan"
LOGIN_JSON="/tmp/sb_login.json"

curl -sS -f -X POST "https://${PROJECT_REF}.supabase.co/auth/v1/token?grant_type=password" -H "apikey: ${ANON_KEY}" -H "Authorization: Bearer ${ANON_KEY}" -H "Content-Type: application/json" --data "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}" > "${LOGIN_JSON}"

echo "Résultat enregistré dans ${LOGIN_JSON}"
if command -v jq >/dev/null 2>&1; then
  echo "ACCESS_TOKEN :"
  jq -r '.access_token // .error_description // .message' "${LOGIN_JSON}"
else
  python3 - <<'PY' "${LOGIN_JSON}"
import json,sys
j=json.load(open(sys.argv[1]))
print(j.get("access_token") or j.get("error_description") or j.get("message") or j)
PY
fi