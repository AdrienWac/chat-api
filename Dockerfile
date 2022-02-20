## BASE config
FROM node:12-alpine as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


## DEV Config
FROM base as dev

RUN npm install -g nodemon

CMD [ "npm", "run", "dev" ]

EXPOSE 3000


## PROD config
FROM base as prod

CMD [ "npm", "start" ]



