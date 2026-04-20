FROM node:20-alpine

WORKDIR /app

COPY . .
RUN npm ci

EXPOSE 3001

CMD ["npx", "tsx", "apps/api/src/app.ts"]