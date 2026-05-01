FROM node:20-alpine

WORKDIR /app

COPY . .
COPY docker/entrypoint.sh /app/docker/entrypoint.sh
RUN chmod +x /app/docker/entrypoint.sh
RUN npm ci

EXPOSE 3001

CMD ["npx", "tsx", "apps/api/src/app.ts"]