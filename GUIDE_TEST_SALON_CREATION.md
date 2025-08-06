# 🧪 GUIDE DE TEST - CRÉATION & MODIFICATION SALON

## ✅ CE QUI EST MAINTENANT PRÊT POUR VOS TESTS DEMAIN

### 1. **CRÉATION AUTOMATIQUE SALON** 
Quand vous vous connecterez comme PRO demain :
- ✅ **Salon automatique** créé avec nom "Salon de [votre-id]"  
- ✅ **ID unique** généré (salon-1754444xxx-abc123)
- ✅ **Données vierges** à personnaliser (fini "Mon Salon" générique)
- ✅ **Status initial** : non publié, non vérifié

### 2. **MODIFICATIONS SALON POSSIBLES**
- ✅ **API PUT /api/salon/:salonId** fonctionnelle
- ✅ **Sauvegarde PostgreSQL** authentique
- ✅ **Tous les champs modifiables** :
  - Nom du salon
  - Description courte/longue  
  - Adresse, téléphone, email
  - Photos, couleurs personnalisées
  - Statut publication

### 3. **CRÉATION PRESTATIONS/SERVICES**
- ✅ **API POST /api/services** PostgreSQL uniquement
- ✅ **Sauvegarde** nom + prix + durée + description
- ✅ **Authentification** token requis
- ✅ **Logs détaillés** pour débugger

---

## 🎯 SCÉNARIO TEST RECOMMANDÉ DEMAIN

### ÉTAPE 1 : CONNEXION PRO (2 min)
```
1. Aller sur la page connexion PRO
2. Se connecter avec votre compte (basic-pro@salon.fr)
3. Vérifier création automatique salon
4. Noter l'ID unique généré
```

### ÉTAPE 2 : MODIFICATION SALON (5 min)
```
1. Changer le nom : "Mon Salon de Beauté"
2. Modifier l'adresse : "10 Rue de la Paix, Paris"  
3. Ajouter téléphone : "01 42 XX XX XX"
4. Sauvegarder et vérifier persistence
```

### ÉTAPE 3 : CRÉATION PRESTATION (5 min)
```
1. Créer une nouvelle prestation :
   - Nom : "Coupe Brushing" 
   - Prix : 45€
   - Durée : 60 min
   - Description : "Coupe personnalisée avec brushing"
2. Sauvegarder
3. Vérifier dans la liste des services
4. Vérifier prix affiché correctement
```

### ÉTAPE 4 : VÉRIFICATION PERSISTENCE (2 min)
```
1. Rafraîchir la page
2. Se reconnecter
3. Vérifier que tout est sauvegardé :
   - Nom salon modifié
   - Prestation créée avec bon prix
   - Données persistantes
```

---

## 🔍 CE QUE VOUS DEVEZ OBSERVER

### ✅ **SUCCÈS ATTENDUS** :
- Salon créé automatiquement à la connexion
- Nom personnalisable (plus de "Mon Salon")
- Prestations sauvegardées avec prix exact
- Données persistantes après rechargement
- Logs clairs dans console développeur

### ❌ **PROBLÈMES POSSIBLES** :
- Erreur 401 : Problème authentification 
- Erreur 404 : Salon non trouvé
- Erreur 500 : Problème base de données
- Prestations non sauvegardées

---

## 🚨 CONSOLE LOGS À SURVEILLER

Dans F12 → Console, vous devriez voir :
```
✅ Salon unique créé pour utilisateur: basic-pro-001
🔧 Création service PostgreSQL: Coupe Brushing
✅ Service créé dans PostgreSQL: Coupe Brushing Prix: 45
🏢 Modification salon PostgreSQL: Mon Salon de Beauté
✅ Salon modifié dans PostgreSQL: Mon Salon de Beauté
```

---

## 📞 SI PROBLÈME DEMAIN

**Erreurs communes et solutions** :
1. **Salon pas créé** → Vérifier token authentification
2. **Modifications pas sauvées** → Vérifier API PUT salon
3. **Prestations perdues** → Vérifier API POST services
4. **Prix incorrect** → Vérifier format numérique

**Votre test confirmera que le système est 100% opérationnel pour vos vrais clients !**