# Dark Ad Scraping API <!-- omit in toc -->

- [Quickstart](#quickstart)
- [Project structure](#project-structure)
- [Typical workflows](#typical-workflows)
  - [Adding new model or table](#adding-new-model-or-table)
  - [Adding new route](#adding-new-route)
  - [Database migration for production](#database-migration-for-production)
- [Testing](#testing)
  - [Setting up test environment](#setting-up-test-environment)
  - [To run tests](#to-run-tests)
  - [Test tools](#test-tools)
  - [Test files structure](#test-files-structure)
  - [Example test setup](#example-test-setup)
  - [Current limitations and concerns](#current-limitations-and-concerns)
- [Viewing API documentation](#viewing-api-documentation)

## Quickstart

- Install:
  - PostgreSQL
  - Node.js
  - Yarn
  - DataGrip (Optional)
- Create a database in Postgres using PGAdmin. Put the credentials inside `.dev.env` following the structure of `.example.env`
  - For the AWS credentials, it's recommended to create an IAM user with permissions to check the status, start and stop EC2 instances.
- Run `yarn` in the project root to install the Node dependencies
- Run `yarn schema:sync` to create tables in the database using the models defined in `src\models`.
- You will need to run this **every time the models are changed** or you can set the `DB_SYNC=true` in the `.dev.env` for automatic synchronisation. This is only recommended for development, **not production**, as syncing may drop data.
- Import the csv files in `src/google-data` into the tables by running `yarn import-data` or using PGAdmin or DataGrip
- Start the development server on port 5000: `yarn start`

## Project structure

- Important configuration files:
  - You need to provide `.dev.env` and/or `.test.env` in the project root directory to correctly load the environment variables. See `.example.env`
  - `jest.config.js`: Jest configuration
  - `tsconfig.json`: TypeScript configuration
  - `package.json`: some important scripts are
    - `start`: start development server
    - `build`: build / transpile code for production
    - `migration:create`, `migration:generate`, `migration:run`, `migration:revert`: various scripts for database migration, typically used to update production database after a change in the schema/models
    - `test`: run test files
    - `schema:drop`, `schema:sync`: drop and sync database schema (uses `.dev.env` creds). **DO NOT** use this on production database or you risk losing on the data
- `/configs`:
  - `config.ts` checks the current environment that it&#39;s running (test, dev, prod) and loads the corresponding .env file in the project route. This allows for convenient context switching between different environments.
  - `ormconfig.ts` configure TypeORM options based on the environment variables.
- `/controllers`:
  - The controllers&#39; main functionality is to handle connection to the database using the models and TypeORM functionalities
  - Typically there should be one controller for each router
- `/helpers`:
  - Miscellaneous functionality
  - dbConnection is used to check, create or get the connection to the database
- `/models`:
  - Data models for our application. All of the current models are used by TypeORM to create and map data from each table in our database
- `/routes`:
  - The routers of the application. This defines the REST API interface that the frontend client consumes
- `/swaggerDoc`:
  - The Swagger doc is defined using TypeScript file instead of yml to leverage type checking and code completion.
  - Changes to the routes mean that you should also update the swagger doc
- `/tests`:
  - Our Jest test files and utility functions. Ideally one test file for each route and/or each controller

## Typical workflows

### Adding new model or table

- Create a new TS model file in `/models`
- Create a class that extends TypeORM BaseEntity and annotate the class and attributes as appropriate (see [TypeORM API](https://typeorm.io/#/))
- Update the `index.ts` file for cleaner exporting and importing
- For development, run `yarn schema:sync` to update the local database. If that doesn't work, run `yarn schema:drop` and then `schema:sync`
- For production, see [database migration](#_6sc9utugvi8g).

### Adding new route

- Add a new router file in `/routes` and a new controller file in `/controllers`
- The router file should not contain any database logic. It delegates those functionalities to the controller.

### Database migration for production

- These should be done after a change to the schema is made, is merged into the master branch and has been deployed
- The migration scripts in package.json will use the `.dev.env` values so a workaround to update the production database is to put its credentials in `.dev.env`. REMEMBER to change it back to the dev credentials after you&#39;re done.
- Run `yarn migration:generate <migration-name>` to generate migration code. Check in `/migrations` folder that a corresponding TS file is created and that its up() and down() methods are correct.
- Run `yarn migration:run` to update the database
- Run `yarn migration:revert` if you didn&#39;t intend to update the database
- Migration of the database should be done manually to check if the logic generated is correct or else we risk dropping the data.

## Testing

### Setting up test environment

We need to put the credentials of the test database ( **a different one from development and production since this database will be wiped** ) in a `.test.env` file in the root folder of the project. If the database doesn&#39;t exist, the code should create one for you. An example of `.test.env` can be seen below:

```
PORT=5000
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="fit4002-test"
DB_USERNAME="postgres"
DB_PASSWORD="postgres"
DB_SYNC=true
DB_LOGS=false
NODE_ENV=test
CLIENT_ORIGIN=http://localhost:3000
```

### To run tests

`yarn test`

With the current configuration, it&#39;ll run the test &quot;in band&quot; (i.e. only 1 test a time) to avoid race conditions when reading and writing to the database. After the tests are done, the coverage report will be shown and its files can be found in the `/coverage` folder.

### Test tools

We are using:

- [`jest`](https://jestjs.io/docs/getting-started)

- Have a look at their documentation, specifically: using matchers (symmetric and asymmetric, custom matchers), testing async code, setup and teardown

- [`jest-extended`](https://github.com/jest-community/jest-extended): to have more assertions/matchers API

- [`jest-html-reporters`](https://www.npmjs.com/package/jest-html-reporters): to generate test and coverage result as HTML

- [`supertest`](https://www.npmjs.com/package/supertest): to make request to the Express server and allow us to make assertions on the responses

### Test files structure

- `.test.env`: store test database credentials and application configurations

- `jest.config.js`: [Jest configuration](https://jestjs.io/docs/configuration)

- `src/tests`: test related documents and utilities

- `testConnection.ts`: database connection, create and clean up test data

- `src/tests/ __tests__ `: store test files

- test file names should follow format `*.test.ts`

### Example test setup

Example test setup can be seen in `src/tests/ __tests__ /routes/googleBot.test.ts`.

A typical test setup before and after each test case can be seen below:

```typescript
beforeAll(async (done) => {
  await connection.create();
  done();
});
afterAll(async (done) => {
  await connection.close();
  done();
});

beforeEach(async (done) => {
  await connection.createGoogleTestData();
  done();
});

afterEach(async (done) => {
  await connection.clear();
  server.close();
  done();
});
```

The purpose of this setup is that the test data is created and cleared after \*\*each\*\* test and thus narrowing down the impact of a test case to its own scope and doesn&#39;t affect other test cases (i.e. you can run test cases out of order). More on scope of test setup and teardown: https://jestjs.io/docs/setup-teardown.

You can modify the `connection.createTestData()` function (or create additional functions) to add your own test data.

Also include the test case ID at the end of the test description for easy tracking.

### Current limitations and concerns

- Run tests on the built `js` files instead of `ts` files.
- Tests are being run with `--runInBand` config. This disallows running tests in parallel and is to prevent race conditions when reading and writing to the database. The disadvantage is that performance is greatly reduced and may be a problem when we have a large number of tests.
- An alternative is to have each test case create and use an in-memory database. The problem is that I think only SQLite is available as in-memory.
- These tests are essentially integration tests so it may be difficult to debug. Consider unit tests with mocking?

## Viewing API documentation

- Start the development server and go to `localhost:5000/doc/` to view the API doc
- The API doc is generated based on the files in `src/swaggerDoc`
