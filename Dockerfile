## DEV Config
FROM node:12-alpine as dev

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]

EXPOSE 3000

## PROD config
FROM node:12-alpine as prod

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]



