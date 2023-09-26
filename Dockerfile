FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean -f  

RUN npm ci --maxsockets 1

COPY . .

CMD [ "npm", "run", "start" ]