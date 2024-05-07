FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY . /app
RUN npm install --save-dev

