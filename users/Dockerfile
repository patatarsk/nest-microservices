FROM node:16-alpine

WORKDIR /users

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]