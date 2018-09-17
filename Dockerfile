FROM node:carbon

RUN wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/5.0.7/flyway-commandline-5.0.7-linux-x64.tar.gz

RUN tar -xzf flyway-commandline-5.0.7-linux-x64.tar.gz

RUN ln -s /flyway-5.0.7/flyway /usr/bin/flyway

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
