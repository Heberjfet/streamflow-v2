FROM node:20-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY worker/src ./src
COPY packages/db/src ./packages/db/src

CMD ["node", "src/index.js"]
