<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>

## Description

 Ecommerce API bootstrapped with [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Getting Started
1. Clone the repository
2. Run
```
npm install
```
3. Database set-up
```
docker-compose up -d
```
4. Clone __.env.template__ file and rename to __.env__
5. Fill in the variables with the respective values
6. Run in dev
```
npm run start:dev
```
7. Populate the database
```
http://localhost:3000/api/seed
```

## Stack
* Nest
* Postgres
* Docker

## Documentation
Partial implementation with **Swagger** on product endpoint
```
http://localhost:3000/api
```