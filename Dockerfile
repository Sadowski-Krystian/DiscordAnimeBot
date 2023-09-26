FROM node:latest

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

RUN npm cache clean -f  

RUN npm ci --maxsockets 1

COPY . /usr/src/app

CMD [ "npm", "run", "start" ]