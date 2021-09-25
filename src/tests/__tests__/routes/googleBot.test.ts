import supertest from "supertest";
import { app, server } from "~/app";
import { googleBotMatcherSchema } from "~/tests/customMatchers";
import { connection } from "../../testConnection";

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

test("GET /google/bots - Get all bots #API-1", async (done) => {
  const res = await supertest(app)
    .get("/google/bots")
    .expect("Content-Type", /json/)
    .expect(200);

  const { body } = res;
  for (const element of body) {
    expect(element).toMatchObject(googleBotMatcherSchema);
  }
  done();
});

describe("GET /google/bot/:username", () => {
  test("Get bot with valid username #API-2 ", async (done) => {
    const res = await supertest(app)
      .get("/google/bots/bot1")
      .expect("Content-Type", /json/)
      .expect(200);

    const expected = {
      id: expect.any(String),
      username: "bot1",
      dob: "1999-07-14T00:00:00.000Z",
      gender: "male",
      fName: "First",
      lName: "Bot",
      otherTermsCategory: 0,
      password: "password123",
      locLat: -23.139826,
      locLong: 34.139062,
      type: "google",
      politicalRanking: 0,
    };

    const { body } = res;
    expect(body).toMatchObject(expected);
    done();
  });

  test("Get bot with invalid username #API-3", async (done) => {
    const res = await supertest(app)
      .get("/google/bots/iojio")
      .expect("Content-Type", /json/)
      .expect(404);
    done();
  });
});
