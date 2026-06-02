FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --no-fund

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm","run","dev","--","--host"]
