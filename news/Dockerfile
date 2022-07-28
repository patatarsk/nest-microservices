FROM node:16-alpine

WORKDIR /news

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]