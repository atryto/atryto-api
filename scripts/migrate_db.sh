#!/bin/sh
heroku_app="atryto-api-${NODE_ENV}"
echo "heroku_app: $heroku_app"
heroku config -s -a ${heroku_app} > ${PWD}/.env.migrate
eval $(egrep -v '^#' ${PWD}/.env.migrate | xargs) flyway -locations=filesystem:bin/database-schemas migrate
rm ${PWD}/.env.migrate