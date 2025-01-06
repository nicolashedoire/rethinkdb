# Stage de build
FROM node:18-alpine AS builder

WORKDIR /app

COPY app/package*.json ./
COPY app/next.config.js ./

RUN npm install

COPY app .

RUN npm run build

# Stage de production
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/insert-test-data.js ./insert-test-data.js

# Ajoutez un script de démarrage
COPY start.sh ./
RUN chmod +x start.sh

USER nextjs

EXPOSE 3000

CMD ["./start.sh"]