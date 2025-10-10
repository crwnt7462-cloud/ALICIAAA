-- Index pour optimiser les requêtes sur la table appointments

-- 1. Index pour les requêtes par professionnel et date
CREATE INDEX IF NOT EXISTS idx_appointments_staff_date 
ON appointments(staff_id, appointment_date);

-- 2. Index pour les requêtes par salon et date
CREATE INDEX IF NOT EXISTS idx_appointments_user_date 
ON appointments(user_id, appointment_date);

-- 3. Index pour les requêtes par client
CREATE INDEX IF NOT EXISTS idx_appointments_client 
ON appointments(client_id) WHERE client_id IS NOT NULL;

-- 4. Index pour les requêtes par statut
CREATE INDEX IF NOT EXISTS idx_appointments_status 
ON appointments(status);

-- 5. Index composite pour les créneaux disponibles
CREATE INDEX IF NOT EXISTS idx_appointments_time_slot 
ON appointments(staff_id, appointment_date, start_time, end_time);

-- 6. Index pour les requêtes de paiement
CREATE INDEX IF NOT EXISTS idx_appointments_payment 
ON appointments(payment_status, status);

-- 7. Index pour les requêtes temporelles
CREATE INDEX IF NOT EXISTS idx_appointments_created 
ON appointments(created_at);


-- 1. Index pour les requêtes par professionnel et date
CREATE INDEX IF NOT EXISTS idx_appointments_staff_date 
ON appointments(staff_id, appointment_date);

-- 2. Index pour les requêtes par salon et date
CREATE INDEX IF NOT EXISTS idx_appointments_user_date 
ON appointments(user_id, appointment_date);

-- 3. Index pour les requêtes par client
CREATE INDEX IF NOT EXISTS idx_appointments_client 
ON appointments(client_id) WHERE client_id IS NOT NULL;

-- 4. Index pour les requêtes par statut
CREATE INDEX IF NOT EXISTS idx_appointments_status 
ON appointments(status);

-- 5. Index composite pour les créneaux disponibles
CREATE INDEX IF NOT EXISTS idx_appointments_time_slot 
ON appointments(staff_id, appointment_date, start_time, end_time);

-- 6. Index pour les requêtes de paiement
CREATE INDEX IF NOT EXISTS idx_appointments_payment 
ON appointments(payment_status, status);

-- 7. Index pour les requêtes temporelles
CREATE INDEX IF NOT EXISTS idx_appointments_created 
ON appointments(created_at);


