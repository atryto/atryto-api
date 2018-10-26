FROM node:10.12.0-stretch

RUN apt-get update && apt-get install -y build-essential && apt-get install -y python

RUN wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/5.0.7/flyway-commandline-5.0.7-linux-x64.tar.gz

RUN tar -xzf flyway-commandline-5.0.7-linux-x64.tar.gz

RUN ln -s /flyway-5.0.7/flyway /usr/bin/flyway

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

COPY . /usr/src/app

RUN npm install  --production

RUN npm run build

EXPOSE 3000

# CMD [ "npm", "run", "start" ]
CMD npm install --production; npm start