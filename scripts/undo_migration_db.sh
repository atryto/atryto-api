#!/bin/sh
heroku_app="atryto-api-${NODE_ENV}"
echo "heroku_app: $heroku_app"
heroku config -s -a ${heroku_app} > ${PWD}/.env.migrate
eval $(egrep -v '^#' ${PWD}/.env.migrate | xargs) npm run db:migrate:undo
rm ${PWD}/.env.migrate