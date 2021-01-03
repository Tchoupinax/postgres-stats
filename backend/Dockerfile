FROM node:15-alpine

RUN apk add --no-cache --virtual .gyp git

WORKDIR /app/

COPY package*.json /app/

RUN npm install

COPY . .

CMD NODE_ENV=production node src/index.js
