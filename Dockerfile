FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json из корня проекта
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код из папки src
COPY src/ ./src/

# Указываем, что точка входа — файл index.js внутри src
CMD ["node", "src/index.js"]