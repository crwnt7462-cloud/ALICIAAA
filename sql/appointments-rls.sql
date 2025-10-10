-- RLS Policies pour la table appointments
-- Permettre aux professionnels de voir leurs RDV
-- Permettre aux clients de voir leurs RDV

-- 1. Politique pour les professionnels (voient les RDV de leur salon)
CREATE POLICY "professionals_view_own_appointments" ON appointments
FOR SELECT TO authenticated
USING (
  -- Le pro peut voir les RDV de son salon
  user_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  )
);

-- 2. Politique pour les clients (voient leurs propres RDV)
CREATE POLICY "clients_view_own_appointments" ON appointments
FOR SELECT TO authenticated
USING (
  -- Le client peut voir ses propres RDV
  client_id = auth.uid() OR
  client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- 3. Politique pour la création d'appointments (réservations publiques)
CREATE POLICY "allow_appointment_creation" ON appointments
FOR INSERT TO anon, authenticated
WITH CHECK (true); -- Permettre la création pour les réservations publiques

-- 4. Politique pour la mise à jour (professionnels uniquement)
CREATE POLICY "professionals_update_appointments" ON appointments
FOR UPDATE TO authenticated
USING (
  user_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  user_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  )
);

-- 5. Politique pour la suppression (professionnels uniquement)
CREATE POLICY "professionals_delete_appointments" ON appointments
FOR DELETE TO authenticated
USING (
  user_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  )
);

-- Activer RLS sur la table appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Permettre aux professionnels de voir leurs RDV
-- Permettre aux clients de voir leurs RDV

-- 1. Politique pour les professionnels (voient les RDV de leur salon)
CREATE POLICY "professionals_view_own_appointments" ON appointments
FOR SELECT TO authenticated
USING (
  -- Le pro peut voir les RDV de son salon
  user_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  )
);

-- 2. Politique pour les clients (voient leurs propres RDV)
CREATE POLICY "clients_view_own_appointments" ON appointments
FOR SELECT TO authenticated
USING (
  -- Le client peut voir ses propres RDV
  client_id = auth.uid() OR
  client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- 3. Politique pour la création d'appointments (réservations publiques)
CREATE POLICY "allow_appointment_creation" ON appointments
FOR INSERT TO anon, authenticated
WITH CHECK (true); -- Permettre la création pour les réservations publiques

-- 4. Politique pour la mise à jour (professionnels uniquement)
CREATE POLICY "professionals_update_appointments" ON appointments
FOR UPDATE TO authenticated
USING (
  user_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  user_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  )
);

-- 5. Politique pour la suppression (professionnels uniquement)
CREATE POLICY "professionals_delete_appointments" ON appointments
FOR DELETE TO authenticated
USING (
  user_id IN (
    SELECT id FROM salons WHERE owner_id = auth.uid()
  )
);

-- Activer RLS sur la table appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;


