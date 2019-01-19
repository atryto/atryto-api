# Atryto Api

Public API for the Atryto Platform

## Usage

### Using Docker

- install [Docker](https://www.docker.com/get-started)
- `npm run docker-compose` or `docker-compose up`

### Without docker

to start the api, you'll need to at least to install [flyway](https://flywaydb.org) and set the flyway environment variables, here's how to do this in mac:

- `brew install fly`,
- `export FLYWAY_URL=jdbc:mysql://127.0.0.1:3306 FLYWAY_USER=root FLYWAY_PASSWORD=root FLYWAY_SCHEMAS=exchange`

Then after that, to run the api itself just do:

- `npm start`

If you prefer using pm2, you can run:

- `npm run init-db`
- `npm run watch`

### Environment variables

### Heroku
You can get the variables straight from heroku(just in case you have access)
- to copy config vars from heroku in Staging: `heroku config -s -a atryto-api-staging > .env.staging`
- to copy config vars from heroku in Staging: `heroku config -s -a atryto-api-prod > .env.prod`

### Copy .env.ENVIRONMENT to .env

- `cp .env.staging .env` to connect to the staging API
- `cp .env.local .env` to connect to the API running locally


## Endpoints

### POST /users

## Database Migrations and versioning

We are using [flyway](https://flywaydb.org) to run database scripts and keep the versions. Right now we created the script `init-db` on the package.json file, but we don't need to run it manually because everytime the command `npm start` is executed, it automatically calls this script and then generate the database with its data(if any).

## Useful curl commands


- Users
    - `curl -H "Content-Type: application/json" -X POST --data '{"email": "user@test.com", "username":"marco", "password":"password1"}' http://localhost:3000/users `

## Starting guide

We are using the following tools:

- [Fastify](https://github.com/fastify/fastify) as the main Nodejs framework
- [Typescript](https://www.typescriptlang.org/)
- [Tape](https://github.com/substack/tape) as the test framework
- [TSLint](https://palantir.github.io/tslint/)
- [Docker](https://www.docker.com/what-docker)
- [ApiDoc](http://apidocjs.com/) to automatically generate documentation

## Running the project

To run the project locally run:

- `npm install`
- `npm run build`
- `npm start`(this one already runs the build so you can skip the second command)

If you want your project to be updated every change you make and keep restarting, just use:

- `npm run watch` instead of `npm start`.

Then you'll have your server running on the port it's going to show up on the terminal. If you want to change the port or any other configuration go to the file `src/config/config.ts` and change whatever you need.

## Using Docker

To run the project with Docker you will need to install Docker first. To install docker, go to the [Docker official website](https://www.docker.com/get-docker).

After having docker running in your computer you can use the `docker` scripts defined on the `package.json` files:

- `build-docker`: build the image of your project so you can start running containers with it;
- `start-docker`: start your project's container, by default the port `3000` is exposed which is the same default of the config file;
- `stop-docker`: stop the container;
- `rm-docker`: remove the container;
- `rmi-docker`: remove the image(you'll need to stop all containers running on the top of this image before);
- `tag-docker`: tag the image you've created(by default the tag is `latest`);
- `push-docker`: push the image you've created and tagged to the AWS Staging environment.

### docker-compose

To make it all simpler to run, after building the image you can just run `docker-compose up` or even better, use the script

- `npm run build-compose`

## Running Tests

To only run the unit tests:

- `npm install`
- `npm run build`
- `npm run test`(this one already runs the build so you can skip the second command)

We are using [istanbul](https://github.com/gotwarlost/istanbul) to code coverage.

If you want to run the unit tests of a specific file, run the following command(instead of the third one above) :

- `node_modules/tape/bin/tape ./bin/PATH_OF_YOUR_FILE`

And If you want to run the unit tests AND the code coverage of a specific file :

- `node_modules/.bin/istanbul cover node_modules/tape/bin/tape ./bin/PATH_OF_YOUR_FILE`

## Generating documentation

To generate the documentation of the project, run:

- `npm install`
- `npm run build`
- `npm run docs`

We are using the [apidoc](http://apidocjs.com/) documentation generator framework.

If you want to add documentation to a specific endpoint or function, you will need to use `comments` within your code, here's an example:

```javascript

/**
 * @api {get} /ping Healthcheck
 * @apiName Ping
 * @apiGroup Status
 *
 * @apiSuccess pong if your API works.
 */
fastify.get("/ping", (request, reply) => {
    request.log.info("Ping completed successfully");
    reply.code(200).send({ ping: "pong" });

});

```

## Running TSLint

TSLint is an analysis tool that checks TypeScript code for readability, maintainability, and functionality errors. It helps keeps the standard of the project.

To run the TSLint, do:

- `npm run tslint`

## Before commiting

Check whether tests are passing and coding is according to tslint(style guide)

- `npm run test`
- `npm run tslint`