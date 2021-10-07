# Testing

## Setting up test environment

We are using Jest as our testing framework. We need to put the credentials of the test database (**a different one from development and production since this database will be wiped**) in a `.test.env` file in the root folder of the project. If the database doesn't exist, the code should create one for you. An example of `.test.env` can be seen below:

```env
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

## To run tests

`yarn test`

With the current configuration, it'll run the test "in band" (i.e. only 1 test a time) to avoid race condition when reading and writing to the database. After the tests are done, the coverage report will be shown and its files can be found in the `/coverage` folder.

## Tools

We are using:

- [`jest`](https://jestjs.io/docs/getting-started)
  - Have a look at their documentation, specifically: using matchers (symmetric and asymmetric, custom matchers), testing async code, setup and teardown
- [`jest-extended`](https://github.com/jest-community/jest-extended): to have more assertions/matchers API
- [`jest-html-reporters`](https://www.npmjs.com/package/jest-html-reporters): to generate test and coverage result as HTML
- [`supertest`](https://www.npmjs.com/package/supertest): to make request to the Express server and allow us to make assertions on the responses

## Test files structure

- `.test.env`: store test database credentials and application configurations
- `jest.config.js`: [Jest configuration](https://jestjs.io/docs/configuration)
- `src/tests`: test related documents and utilities
  - `testConnection.ts`: database connection, create and clean up test data
- `src/tests/__tests__`: store test files
  - test file names should follow format `*.test.ts`

## Example test setup

Example test setup can be seen in `src/tests/__tests__/routes/googleBot.test.ts`.

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
  await connection.createTestData();
  done();
});

afterEach(async (done) => {
  await connection.clear();
  server.close();
  done();
});
```

The purpose of this setup is that the test data is created and cleared after **each** test and thus narrowing down the impact of a test case to its own scope and doesn't affect other test cases (i.e. you can run test cases out of order). More on scope of test setup and teardown: https://jestjs.io/docs/setup-teardown.

You can modify the `connection.createTestData();` function (or create additional functions) to add your own test data.

Also include the test case ID at the end of the test description for easy tracking.

## Current limitations and concerns

- Run tests on the built `js` files instead of `ts` files.
- Tests are being run with `--runInBand` config. This disallows running tests in parallel and is to prevent race conditions when reading and writing to the database. The disadvantage is that performance is greatly reduced and may be a problem when we have a large number of tests.
  - An alternative is to have each test case create and use an in-memory database. The problem is that I think only SQLite is available as in-memory.
- These tests are essentially integration tests so it may be difficult to debug. Consider unit tests with mocking?
