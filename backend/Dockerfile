FROM node:20-alpine

WORKDIR /app

# システムモニタリングに必要なツールのインストール
RUN apk add --no-cache \
    procps \
    sysstat \
    iproute2 \
    docker \
    openssl

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "start"]

