#!/bin/sh

# Démarre le serveur en arrière-plan
npm start &

# Démarre le script insert-test-data.js
node /app/insert-test-data.js

# Empêche le conteneur de se terminer
wait