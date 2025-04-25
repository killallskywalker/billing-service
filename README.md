## Billing Record Service (NestJS)

[![Policies Service CI](https://github.com/killallskywalker/billing-service/actions/workflows/ci.yml/badge.svg)](https://github.com/killallskywalker/billing-service/actions/workflows/ci.yml)

A secure and scalable Customer Billing API built with NestJS, featuring:

1 . JWT-based authentication

2 . Role-based access control (admin/user)

3 . Billing record CRUD operations

4 . Pagination, caching, and centralized error handling

5 . OpenAPI (Swagger) documentation

## Project Structure
```
test/                           # Contain e2e test . For unit we put together since small scale project 
init/                           # Contain custom script to setup database creation for docker 
github/                         # Contain github action yml to automate linting , unit test and e2e , and security report
src/
├── app.module.ts               # Root module with global configurations
├── main.ts                     # Entry point with global filters, interceptors, Swagger setup
├── auth/                       # Fake JWT-based auth with role support
├── billing-records/            # Billing logic, controller, service, DTOs
├── common/                     # Middleware, interceptors, decorators , filters 
└── config/                     # TypeORM configuration
```

## Getting Started
1 . Clone the repository
```
git clone git@github.com:killallskywalker/billing-service.git
cd billing-service
```
2 . Set .env . You can refer to .env.example
```
DATABASE_CONNECTION="postgres"
DATABASE_HOST=postgres-service
DATABASE_PORT=5432
DATABASE_USERNAME=developer
DATABASE_PASSWORD=password
DATABASE_NAME=customer_billing_portal

JWT_SECRET="generate-your-own-secret"
JWT_EXPIRES_IN='3600s'
```

If you running using docker compose you dont need to change this value . Unless you change , you need to ensure you set the correct
env value here and postgres . 

3 . To run this project , you can just run this ( All migration and seed will be run together through the docker compose up ) 
```
# This is using final image for production , all dev related not available in here
docker compose up 

# If you want developer mode ( run test etc ) 
docker compose -f docker-compose.dev.yml up 

# for this you need to run on your own migration and seed
docker exec -it policy-service npm run migration:run
docker exec -it policy-service npm run db:seed

```
4 . Then you can access the swagger 
```
http://localhost:3000/api 
```
5 . In order to test the api in swagger , you need to authenticate yourself first , just authenticate by fill in role either admin or user through the swagger . 

Available Roles:
```
admin
user
```

All /billing routes are protected by JWT and use Bearer authentication.

## Running Test With Coverage 
Once you already running this `docker compose -f docker-compose.dev.yml up` , you can run the test with coverage like this 
```
docker exec -it policy-service npm run test:cov
```

## Running End To End Test
Same as above once running you can run this 
```
docker exec -it policy-service sh -c "NODE_ENV=test npm run test:e2e"
```
Before you run make sure you have .env.test . For unit test not require specific env since it only unit test and not interact with real connection to database . 

## Development 

You can use docker-compose.dev.yml for development purpose .For development you need to run on your own for migration and seed . 

```
docker compose -f docker-compose.dev.yml up
```

Since we use everything inside container , you might have an issue on linting since node_modules are inside the container . You can use dev container to resolve this . Or another way , you can use same node version that we using in docker file to install / setup dependency in host first . 

## Implementation 

For authentication and authorization we implementing Role-based access control (RBAC)by using decorators, guards, and middleware . 

```
# Decorator to attach metadata roles to routes handlers
@Roles()

# roles guard is to check current request based on require roles . We using reflector to get role from @Roles decorator
@UseGuards(RolesGuard)

Middleware used to run before reach any route or guard and extract the token . If the token valid the request will be continue to the route and guard . If not we throw UnauthorizedException . 
```

For billing we use BillingController to handling all HTTP requests related to billing records (GET, POST, PATCH, DELETE). The controller uses NestJS decorators for routing, validation, API documentation, caching, and guards to enforce role-based access control.

At the moment we only implement cache at one endpoint which is get by id . We also implement pagination for get all billing together with the filters . 

For swagger , we use some custom decorator to properly display the response example in swagger documentation . As example 
```
@UseApiDocs(ResponseBillingRecordDto, { ok: true, created: true })
```

We add basic logging also for using nestjs-pino to capture request log . 

In term of error handling and response , we create a global handler to ensure we have a consistent format especially for post request where we might need to give more clear error to be handle by front end developer . For this can refer in `common` directory all related to shared and global context put in here . 

In term of linting we add this linting - `@darraghor/eslint-plugin-nestjs-typed` , these ESLint rules will help you to prevent common bugs and issues in NestJs applications.


## Github Action

We implement automated linting , test and e2e test using github action .