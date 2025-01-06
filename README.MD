# Real-time CPU Metrics Dashboard

Application de surveillance CPU en temps réel construite avec Next.js, RethinkDB et Redis.

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
└── start.sh
```

## Prérequis

- Docker
- Docker Compose
- Node.js 18+

## Installation

1. Clonez le repository
2. Installez les dépendances :
```bash
npm install
```

## Commandes Disponibles

```bash
# Développement
npm run dev                # Lance le serveur de développement
npm run build             # Build l'application
npm run start             # Démarre en mode production

# Docker
npm run docker:build      # Construit les images Docker
npm run docker:up         # Démarre les conteneurs
npm run docker:down       # Arrête les conteneurs
npm run docker:logs       # Affiche les logs en temps réel
npm run docker:start      # Construit et démarre (commande recommandée)
npm run docker:restart    # Redémarre tous les services
npm run docker:clean      # Nettoie les conteneurs et volumes
```

## Démarrage Rapide

```bash
npm run docker:start
```

L'application sera accessible sur :
- Application : http://localhost:5000
- Interface RethinkDB : http://localhost:8080

## Services

- **Application Next.js** : Port 5000
- **RethinkDB** : Ports 28015 (DB) et 8080 (Admin)
- **Redis** : Port 6380

## Surveillance

Le dashboard affiche :
- Un graphique en temps réel de l'utilisation CPU
- Les dernières valeurs mesurées
- Mises à jour automatiques via SSE (Server-Sent Events)

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
   - Ports déjà utilisés (5000, 28015, 8080, 6380)
   - Échec de connexion aux bases de données
   - Problèmes de permissions Docker

## Notes

- L'application utilise des Server-Sent Events pour les mises à jour en temps réel
- Les données sont collectées toutes les secondes
- Utilisation de connection pooling pour RethinkDB