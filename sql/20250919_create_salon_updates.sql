-- Migration Round B2 : Table de logs des updates salons
CREATE TABLE IF NOT EXISTS salon_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  changed_fields jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_salon_updates_salon_id ON salon_updates(salon_id);
CREATE INDEX IF NOT EXISTS idx_salon_updates_user_id ON salon_updates(user_id);