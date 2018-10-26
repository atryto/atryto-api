#!/bin/sh

# go to frontend root
cd ../frontend/
# Create frontend docker image
npm run build-docker
# go to backend root
cd ../backend/
# Create frontend docker image
npm run build-docker
# run docker-compose file
docker-compose up
