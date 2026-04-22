FROM node:20-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY . .
RUN npm ci

CMD ["npx", "tsx", "worker/src/index.ts"]