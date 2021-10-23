#!/bin/sh

# we're using a single .env file as a source of truth for all services
# we should copy .env file to use environment inside the nestjs app

docker-compose build

docker-compose up -d
