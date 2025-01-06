# Monitoring des Signes Vitaux en Temps Réel

Application de surveillance des signes vitaux en temps réel construite avec **Next.js**, **RethinkDB**, **Redis**, et intégrant **TensorFlow.js** pour la détection d'anomalies.

## Structure du Projet

```
rethinkdb/
├── pages/
│   └── index.js
├── public/
│   └── favicon.ico
├── utils/
│   └── rethinkdb-pool.js
├── server.js
├── docker-compose.yml
├── Dockerfile
├── insert-test-data.js
├── next.config.js
├── package.json
├── start.sh
└── README.md
```

## Prérequis

- Docker
- Docker Compose
- Node.js 18+

## Installation

1. Clonez le repository :
   ```bash
   git clone <url-du-repository>
   cd <nom-du-dossier>
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```

## Commandes Disponibles

```bash
# Développement
npm run dev                # Lance le serveur de développement
npm run build              # Build l'application
npm run start              # Démarre en mode production

# Docker
npm run docker:build       # Construit les images Docker
npm run docker:up          # Démarre les conteneurs
npm run docker:down        # Arrête les conteneurs
npm run docker:logs        # Affiche les logs en temps réel
npm run docker:start       # Construit et démarre (commande recommandée)
npm run docker:restart     # Redémarre tous les services
npm run docker:clean       # Nettoie les conteneurs et volumes
```

## Démarrage Rapide

```bash
npm run docker:start
```

L'application sera accessible sur :
- Application : [http://localhost:5000](http://localhost:5000)
- Interface RethinkDB : [http://localhost:8080](http://localhost:8080)

## Services

- **Application Next.js** : Port 5000
- **RethinkDB** : Ports 28015 (DB) et 8080 (Admin)
- **Redis** : Port 6380

## Fonctionnalités

- Surveillance en temps réel des paramètres vitaux (fréquence cardiaque, saturation en oxygène, tension artérielle, etc.).
- Détection d'anomalies grâce à **TensorFlow.js**.
- Tableau de bord avec graphiques interactifs et alertes intelligentes.
- Gestion des tendances pour prédire les détériorations possibles.
- Historique des événements et export des données.

## Détection d'Anomalies avec TensorFlow.js

L'application utilise TensorFlow.js pour identifier les tendances et détecter les anomalies dans les paramètres vitaux. Un modèle de machine learning simple est entraîné avec les données collectées pour anticiper les variations anormales.

## Surveillance en Temps Réel

Le dashboard affiche :

1. **Paramètres vitaux actuels**
   - Fréquence cardiaque
   - Saturation en oxygène
   - Tension artérielle
   - Température corporelle
   - Fréquence respiratoire

2. **Graphiques dynamiques**
   - Évolution des paramètres sur une période donnée.

3. **Alertes intelligentes**
   - Notifications en cas d'anomalies détectées.

## Dépannage

Si l'application ne démarre pas :

1. Vérifiez les logs :
   ```bash
   npm run docker:logs
   ```
2. Redémarrez proprement :
   ```bash
   npm run docker:restart
   ```
3. Problèmes courants :
   - Ports déjà utilisés (5000, 28015, 8080, 6380).
   - Échec de connexion aux bases de données.
   - Problèmes de permissions Docker.

## Notes Techniques

- L'application utilise des Server-Sent Events (SSE) pour les mises à jour en temps réel.
- Les données sont collectées toutes les secondes.
- Les seuils critiques peuvent être configurés via `VITAL_SIGNS_THRESHOLDS` dans `utils/constants.js`.

## Idées Futures

- **Améliorations du modèle IA** : Ajouter une analyse multi-paramètres avancée.
- **Mobile-friendly** : Créer une version optimisée pour les smartphones.
- **API publique** : Permettre à d'autres systèmes d'accéder aux données.

## Contribution

Les contributions sont les bienvenues. Créez une branche, apportez vos modifications, et soumettez une Pull Request.

```bash
git checkout -b feature/nom-de-la-feature
git commit -m "Description de la modification"
git push origin feature/nom-de-la-feature
```

---

Merci de contribuer à ce projet ambitieux de monitoring médical ! 🚀

