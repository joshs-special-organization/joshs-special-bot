FROM node:22

RUN apt-get update && apt-get install -y \
  ffmpeg \
  libsodium-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "sh start.sh && npx prisma generate && npm run start"]
