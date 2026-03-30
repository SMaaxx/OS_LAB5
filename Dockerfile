FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Копируем исходный код из папки src
COPY src/ ./src/

CMD ["node", "src/index.js"]