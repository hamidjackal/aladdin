## Description

Challenge for aladdin Senior Node.js developer position.

## Notes

- This is a http service with two modules: Orders and Payments
- The payment service covers two payment methods : on-site and offsite, which is using Stripe service
- Because this service is not using HTTPS and TLS so it's not safe to use the on-site payment method and it's been developed only for testing purposes.
- There is an .env file which I did not put in .gitignore so testing and working with the service becomes more easily.

## Installation

```bash
$ npm install
```

## Running the app directly

```bash
# make sure the .env file is set correctly
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app with docker

```bash
# set the POTGRES_URI inside the .env file to "db"
# run the ./setup.sh file
$ ./setup.sh sh

# or directly run the below docker commands
$ docker-compose build
$ docker-compose up
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Documentation

The postman documents are available in ./documents directory

## Diagrams

The diagrams are available in ./diagrams directory

## Stay in touch

- Author - Hamid Tehrani
- Company - Aladdin
- Email - hamid.tehrani2003@gmail.com
