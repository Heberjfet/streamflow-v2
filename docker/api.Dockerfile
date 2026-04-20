FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY apps/api/src ./src
COPY packages/db/src ./packages/db/src

EXPOSE 3001

CMD ["node", "src/index.js"]
