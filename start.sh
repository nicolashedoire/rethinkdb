#!/bin/sh

# Démarrer le script d'insertion de données en arrière-plan
node insert-test-data.js &

# Démarrer le serveur principal
node server.js