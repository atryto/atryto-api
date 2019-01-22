FROM node:10.12.0-stretch

RUN apt-get update && apt-get install -y build-essential && apt-get install -y python

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

COPY . /usr/src/app

RUN npm install  --production

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start-container" ]