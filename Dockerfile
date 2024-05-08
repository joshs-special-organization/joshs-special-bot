FROM node:latest

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g pnpm

COPY . .

