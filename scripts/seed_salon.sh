#!/usr/bin/env bash
# Validation :
#   SALON_ID="$(./scripts/seed_salon.sh | head -n1)" && export SALON_ID && echo "$SALON_ID"
#   curl -sS -H 'Accept: application/json' http://localhost:3000/api/salons/first | jq .
# Rollback:
#   git restore -SW scripts/seed_salon.sh
set -euo pipefail

# Auto-source env files if needed
if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  for ENV_PATH in ./scripts/.env ./.env ./server/.env; do
    if [ -f "$ENV_PATH" ]; then
      # shellcheck disable=SC1090
      . "$ENV_PATH"
    fi
    if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
      break
    fi
  done
fi

# Guard: SUPABASE_URL regex
if [ -z "${SUPABASE_URL:-}" ] || ! echo "${SUPABASE_URL}" | grep -Eq '^https://[a-zA-Z0-9.-]+\.supabase\.(co|in)$'; then
  echo "❌ SUPABASE_URL invalide. Exemple attendu: https://xxxxx.supabase.co" >&2
  echo "ℹ️ Actuel: \"${SUPABASE_URL:-<empty>}\"" >&2
  echo "🔑 Service role key length: ${#SUPABASE_SERVICE_ROLE_KEY}" >&2
  exit 1
fi

# Guard: service role key length
if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ] || [ ${#SUPABASE_SERVICE_ROLE_KEY} -lt 20 ]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY manquante ou trop courte" >&2
  echo "ℹ️ Longueur actuelle: ${#SUPABASE_SERVICE_ROLE_KEY}" >&2
  exit 1
fi

# Guard: REST endpoint ping
PING_STATUS=$(curl -sS -I "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -o /dev/null -w "%{http_code}")
if [ -z "$PING_STATUS" ] || [ "$PING_STATUS" -ge 400 ]; then
  echo "❌ Connexion REST Supabase impossible (URL/clé)." >&2
  echo "ℹ️ Vérifie tes exports d’environnement." >&2
  exit 1
fi
sanitize_col() {
  echo "$1" | awk '{$1=$1;print}' | tr '\u00A0' ' ' | tr -s ' ' | grep -oE '[A-Za-z0-9_]+' || true
}
safe_val() {
  echo "Seed"
}
# owner_id logic (probe, fallback, never block)
OWNER_ID=""
RESP_OWNER_ID="$(curl -sS "$SUPABASE_URL/rest/v1/salons?select=owner_id&limit=0" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Accept: application/json")"
HEAD_CHAR_OWNER_ID="$(echo "$RESP_OWNER_ID" | head -c1)"
if [[ "$HEAD_CHAR_OWNER_ID" == "[" ]]; then
  if command -v uuidgen &>/dev/null; then
    OWNER_ID=$(uuidgen)
  else
    OWNER_ID="dev-owner-$(date +%s%N)"
  fi
  echo "⚠️  Using mock owner_id for dev seed: $OWNER_ID" >&2
fi
# Controlled insert attempts: name, label, title
for col in name label title; do
  PAYLOAD="{\"$col\": \"Seed\"}"
  if [[ -n "$OWNER_ID" ]]; then
    PAYLOAD=$(echo "$PAYLOAD" | jq ". + {\"owner_id\": \"$OWNER_ID\"}")
  fi
  RESP=$(curl -sS -X POST "$SUPABASE_URL/rest/v1/salons?select=id" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    --data-binary "$PAYLOAD")
  HEAD_CHAR="$(echo "$RESP" | head -c1)"
  if [[ "$HEAD_CHAR" == "[" || "$HEAD_CHAR" == "{" ]]; then
    SALON_ID=$(echo "$RESP" | jq -er '.[0].id // .id' 2>/dev/null || true)
    if [[ -n "$SALON_ID" ]]; then
      echo "$SALON_ID"
      echo "export SALON_ID=\"$SALON_ID\""
      exit 0
    fi
  fi
  ERR_MSG=$(echo "$RESP" | jq -r '.message // empty' 2>/dev/null)
  if [[ "$ERR_MSG" == *"does not exist"* ]]; then
    continue
  fi
  if [[ "$ERR_MSG" == *"violates not-null constraint"* ]]; then
    MISSING_COL=$(echo "$ERR_MSG" | grep -oE 'column "[^"]+"' | head -n1 | sed 's/column "\([^"]*\)"/\1/')
    MISSING_COL=$(sanitize_col "$MISSING_COL")
    if [[ -z "$MISSING_COL" || ! "$MISSING_COL" =~ ^[A-Za-z0-9_]+$ ]]; then
      echo "❌ ERROR: Invalid or missing column name in error: '$MISSING_COL'" >&2
      exit 1
    fi
    RETRY_PAYLOAD=$(echo "$PAYLOAD" | jq ". + {\"$MISSING_COL\": \"$(safe_val)\"}")
    RETRY_RESP=$(curl -sS -X POST "$SUPABASE_URL/rest/v1/salons?select=id" \
      -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
      -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=representation" \
      --data-binary "$RETRY_PAYLOAD")
    RETRY_ID=$(echo "$RETRY_RESP" | jq -er '.[0].id // .id' 2>/dev/null || true)
    if [[ -n "$RETRY_ID" ]]; then
      echo "$RETRY_ID"
      echo "export SALON_ID=\"$RETRY_ID\""
      exit 0
    else
      echo "❌ ERROR: Second insert failed. Response:" >&2
      echo "$RETRY_RESP" | head -n10 >&2
      exit 1
    fi
  fi
  if [[ -n "$ERR_MSG" ]]; then
    echo "❌ ERROR: Insert failed. Message: $ERR_MSG" >&2
    exit 1
  fi
done

# If all attempts failed, fallback to minimal insert (no text col)
PAYLOAD="{}"
if [[ -n "$OWNER_ID" ]]; then
  PAYLOAD=$(echo "$PAYLOAD" | jq ". + {\"owner_id\": \"$OWNER_ID\"}")
fi
RESP=$(curl -sS -X POST "$SUPABASE_URL/rest/v1/salons?select=id" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  --data-binary "$PAYLOAD")
HEAD_CHAR="$(echo "$RESP" | head -c1)"
if [[ "$HEAD_CHAR" == "[" || "$HEAD_CHAR" == "{" ]]; then
  SALON_ID=$(echo "$RESP" | jq -er '.[0].id // .id' 2>/dev/null || true)
  if [[ -n "$SALON_ID" ]]; then
    echo "$SALON_ID"
    echo "export SALON_ID=\"$SALON_ID\""
    exit 0
  fi
fi
ERR_MSG=$(echo "$RESP" | jq -r '.message // empty' 2>/dev/null)
if [[ -n "$ERR_MSG" ]]; then
  echo "❌ ERROR: Final insert failed. Message: $ERR_MSG" >&2
fi
exit 1
# Rollback:
#   git restore -SW scripts/seed_salon.sh
#!/usr/bin/env bash
# Validation attendue :
#   SALON_ID="$(./scripts/seed_salon.sh | head -n1)" && export SALON_ID → UUID non vide.
#   curl -sS -H 'Accept: application/json' http://localhost:3000/api/salons/first | jq . → 200 { id, name } (ou fallback défini par le backend).

set -euo pipefail

# Guard: SUPABASE_URL regex
if [[ -z "${SUPABASE_URL:-}" || ! "${SUPABASE_URL}" =~ ^https://[a-zA-Z0-9.-]+\.supabase\.(co|in)$ ]]; then
  echo "❌ SUPABASE_URL invalide. Exemple attendu: https://xxxxx.supabase.co" >&2
  echo "ℹ️ Actuel: \"${SUPABASE_URL:-<empty>}\"" >&2
  echo "🔑 Service role key length: ${#SUPABASE_SERVICE_ROLE_KEY}" >&2
  exit 1
fi

# Guard: service role key length
if [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" || ${#SUPABASE_SERVICE_ROLE_KEY} -lt 20 ]]; then
  echo "❌ SUPABASE_SERVICE_ROLE_KEY manquante ou trop courte" >&2
  echo "ℹ️ Longueur actuelle: ${#SUPABASE_SERVICE_ROLE_KEY}" >&2
  exit 1
fi

# Guard: REST endpoint ping
PING_STATUS=$(curl -sS -I "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -o /dev/null -w "%{http_code}")
if [[ -z "$PING_STATUS" || "$PING_STATUS" -ge 400 ]]; then
  echo "❌ Connexion REST Supabase impossible (URL/clé)." >&2
  echo "ℹ️ Vérifie tes exports d’environnement." >&2
  exit 1
fi

# Helper: portable base64 decode
b64dec() {
  if echo "dGVzdA==" | base64 -D &>/dev/null; then base64 -D; else base64 -d; fi
}

# Auto-load env vars if missing
if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  set -a
  [[ -f ".env" ]] && source .env
  [[ -f ".env.local" ]] && source .env.local
  set +a
fi

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "❌ Supabase env missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." >&2
  exit 1
fi

echo "Using SUPABASE_URL=$SUPABASE_URL" >&2
echo "Service role key length: ${#SUPABASE_SERVICE_ROLE_KEY}" >&2

# Helper: REST call, always returns to variable
rest() {
  curl -sS \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Accept: application/json" \
    "$@"
}


PRIMARY_TEXT_COL=""
for col in name label title; do
  RESP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/salons?select=$col&limit=0" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Accept: application/json")
  if [[ "$RESP_CODE" == "200" ]]; then
    PRIMARY_TEXT_COL="$col"
    break
  fi
done

# Probe for owner_id column (runtime, anti-cache)
OWNER_ID_PRESENT=false
RESP_OWNER_ID="$(rest "$SUPABASE_URL/rest/v1/salons?select=owner_id&limit=0")"
HEAD_CHAR_OWNER_ID="$(echo "$RESP_OWNER_ID" | head -c1)"
if [[ "$HEAD_CHAR_OWNER_ID" == "[" ]]; then
  OWNER_ID_PRESENT=true
else
  echo "⚠️ owner_id probe failed (PostgREST cache?), proceeding without owner_id" >&2
fi

# Fast-path: salon already present
EXIST_JSON="$(rest "$SUPABASE_URL/rest/v1/salons?select=id&limit=1")"
if [[ "$(echo "$EXIST_JSON" | head -c1)" == "[" ]]; then
  EXIST_ID=$(echo "$EXIST_JSON" | jq -er '.[0].id // .id' 2>/dev/null || true)
  if [[ -n "$EXIST_ID" ]]; then
    echo "$EXIST_ID"
    echo "export SALON_ID=\"$EXIST_ID\""
    exit 0
  fi
fi

if $OWNER_ID_PRESENT; then
  if command -v uuidgen &>/dev/null; then
    OWNER_ID=$(uuidgen)
  else
    OWNER_ID="dev-owner-$(date +%s%N)"
  fi
  echo "⚠️  Using mock owner_id for dev seed: $OWNER_ID" >&2
  if [[ -n "$PRIMARY_TEXT_COL" ]]; then
    PAYLOAD="{\"$PRIMARY_TEXT_COL\": \"Seed\", \"owner_id\": \"$OWNER_ID\"}"
  else
    PAYLOAD="{\"owner_id\": \"$OWNER_ID\"}"
  fi
else
  echo "⚠️ owner_id not available, inserting minimal salon (PostgREST cache workaround)" >&2
  if [[ -n "$PRIMARY_TEXT_COL" ]]; then
    PAYLOAD="{\"$PRIMARY_TEXT_COL\": \"Seed\"}"
  else
    PAYLOAD="{}"
  fi
fi

INSERT_JSON="$(curl -sS -X POST "$SUPABASE_URL/rest/v1/salons" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  --data-binary "$PAYLOAD")"
HEAD_CHAR="$(echo "$INSERT_JSON" | head -c1)"
if [[ "$HEAD_CHAR" != "[" && "$HEAD_CHAR" != "{" ]]; then
  echo "❌ ERROR: Insert failed. Response:" >&2
  echo "$INSERT_JSON" | head -n10 >&2
  # Try to detect missing NOT NULL column
  MISSING_COL=$(echo "$INSERT_JSON" | grep -oE 'column "[^"]+"' | head -n1 | sed 's/column "\([^"]*\)"/\1/')
  # Sanitize: trim, replace exotic whitespace, allow only [A-Za-z0-9_]+
  if [[ -n "$MISSING_COL" ]]; then
    # Remove leading/trailing whitespace
    MISSING_COL=$(echo "$MISSING_COL" | awk '{$1=$1;print}')
    # Replace non-breaking spaces and exotic whitespace with normal space
    MISSING_COL=$(echo "$MISSING_COL" | tr '\u00A0' ' ' | tr -s ' ')
    # Only allow [A-Za-z0-9_]+
    if [[ "$MISSING_COL" =~ ^[A-Za-z0-9_]+$ ]]; then
      TYPE="text"
      case "$MISSING_COL" in
        *id*) TYPE="uuid" ;;
        *name*|*label*|*title*) TYPE="text" ;;
        *bool*) TYPE="boolean" ;;
        *count*|*num*|*int*) TYPE="integer" ;;
        *date*|*time*|*stamp*) TYPE="timestamp" ;;
      esac
      case "$TYPE" in
        uuid)
          if command -v uuidgen &>/dev/null; then
            SAFE_VAL="$(uuidgen)"
          else
            SAFE_VAL="dev-uuid-$(date +%s%N)"
          fi
          ;;
        boolean)
          SAFE_VAL="false" ;;
        integer)
          SAFE_VAL="0" ;;
        timestamp)
          SAFE_VAL="$(date -u +%FT%TZ)" ;;
        text|*)
          SAFE_VAL="Seed" ;;
      esac
      if [[ "$TYPE" == "boolean" || "$TYPE" == "integer" ]]; then
        RETRY_PAYLOAD=$(echo "$PAYLOAD" | jq ". + {\"$MISSING_COL\": $SAFE_VAL}")
      elif [[ "$TYPE" == "timestamp" ]]; then
        RETRY_PAYLOAD=$(echo "$PAYLOAD" | jq ". + {\"$MISSING_COL\": \"$SAFE_VAL\"}")
      else
        RETRY_PAYLOAD=$(echo "$PAYLOAD" | jq ". + {\"$MISSING_COL\": \"$SAFE_VAL\"}")
      fi
      RETRY_JSON="$(curl -sS -X POST "$SUPABASE_URL/rest/v1/salons" \
        -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        --data-binary "$RETRY_PAYLOAD")"
      RETRY_ID=$(echo "$RETRY_JSON" | jq -er '.[0].id // .id' 2>/dev/null || true)
      if [[ -n "$RETRY_ID" ]]; then
        echo "$RETRY_ID"
        echo "export SALON_ID=\"$RETRY_ID\""
        exit 0
      else
        echo "❌ ERROR: Second insert failed. Response:" >&2
        echo "$RETRY_JSON" | head -n10 >&2
        exit 1
      fi
    else
      echo "❌ ERROR: Column name in error is not valid: '$MISSING_COL'" >&2
      exit 1
    fi
  else
    exit 1
  fi
fi
SALON_ID=$(echo "$INSERT_JSON" | jq -er '.[0].id // .id' 2>/dev/null || true)
if [[ -z "$SALON_ID" ]]; then
  echo "❌ ERROR: No id returned after insert. Response:" >&2
  echo "$INSERT_JSON" | jq . >&2
  exit 1
fi

echo "$SALON_ID"
echo "export SALON_ID=\"$SALON_ID\""

EXIST_JSON="$(rest "$SUPABASE_URL/rest/v1/salons?select=id&limit=1")"
if [[ "$(echo "$EXIST_JSON" | head -c1)" == "[" ]]; then
  EXIST_ID=$(echo "$EXIST_JSON" | jq -er '.[0].id // .id' 2>/dev/null || true)
  if [[ -n "$EXIST_ID" ]]; then
    echo "$EXIST_ID"
    echo "export SALON_ID=\"$EXIST_ID\""
    exit 0
  fi
fi


# Build minimal payload
PAYLOAD="{\"owner_id\": \"$OWNER_ID\", \"$PRIMARY_TEXT_COL\": \"Salon test seed\"}"
INSERT_JSON="$(curl -sS -X POST "$SUPABASE_URL/rest/v1/salons" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  --data-binary "$PAYLOAD")"
HEAD_CHAR="$(echo "$INSERT_JSON" | head -c1)"
if [[ "$HEAD_CHAR" != "[" && "$HEAD_CHAR" != "{" ]]; then
  echo "❌ ERROR: Insert failed. Response:" >&2
  echo "$INSERT_JSON" | head -n10 >&2
  exit 1
fi
SALON_ID=$(echo "$INSERT_JSON" | jq -er '.[0].id // .id' 2>/dev/null || true)
if [[ -z "$SALON_ID" ]]; then
  echo "❌ ERROR: No id returned after insert. Response:" >&2
  echo "$INSERT_JSON" | jq . >&2
  exit 1
fi

echo "$SALON_ID"
echo "export SALON_ID=\"$SALON_ID\""

# --- Validation doc ---
# 1. SALON_ID="$(./scripts/seed_salon.sh | head -n1)" && export SALON_ID
# 2. curl -sS -H 'Accept: application/json' http://localhost:3000/api/salons/first | jq .
# 3. ./scripts/test_salon.sh
