import supertest from "supertest";
import { app, server } from "~/app";
import { adMatcherSchema, botMatcherSchema } from "~/tests/customMatchers";
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
  await connection.createTestData();
  done();
});

afterEach(async (done) => {
  await connection.clear();
  server.close();
  done();
});

describe("GET /google/ads", () => {
  test("Get many ads with no parameters #API-4", async (done) => {
    const res = await supertest(app)
      .get("/google/ads")
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = res;
    const metadata = body.metadata;
    expect(metadata.page).toBeGreaterThanOrEqual(0);
    expect(metadata.per_page).toBeGreaterThanOrEqual(0);
    expect(metadata.page_count).toBeGreaterThan(0);
    expect(metadata.total_count).toBeGreaterThanOrEqual(0);

    const links = metadata.links;
    expect(links).toMatchObject({
      self: expect.any(String),
      first: expect.any(String),
      previous: expect.any(String),
      next: expect.any(String),
      last: expect.any(String),
    });
    for (const element of body.records) {
      expect(element).toMatchObject(adMatcherSchema);
    }
    done();
  });

  test("Check ads metadata pagination link #API-5", async (done) => {
    const res = await supertest(app)
      .get("/google/ads?limit=1")
      .expect("Content-Type", /json/)
      .expect(200);

    const metadata = res.body.metadata;
    expect(metadata).toMatchObject({
      page: 0,
      per_page: 1,
      page_count: 1,
      total_count: 4,
      links: {
        self: "/google/ads?limit=1&offset=0",
        first: "/google/ads?limit=1&offset=0",
        previous: "/google/ads?limit=1&offset=0",
        next: "/google/ads?limit=1&offset=1",
        last: "/google/ads?limit=1&offset=4",
      },
    });

    const res2 = await supertest(app)
      .get("/google/ads?limit=1&offset=1")
      .expect("Content-Type", /json/)
      .expect(200);

    const metadata2 = res2.body.metadata;
    expect(metadata2).toMatchObject({
      page: 1,
      per_page: 1,
      page_count: 1,
      total_count: 4,
      links: {
        self: "/google/ads?limit=1&offset=1",
        first: "/google/ads?limit=1&offset=0",
        previous: "/google/ads?limit=1&offset=0",
        next: "/google/ads?limit=1&offset=2",
        last: "/google/ads?limit=1&offset=4",
      },
    });
    done();
  });

  test("Get many ads with parameters (bots and tag) #API-6", async (done) => {
    const res = await supertest(app)
      .get("/google/ads")
      .query({
        limit: 1,
        bots: "919222a3-c13e-4c8e-8f23-82fa872512cf",
        tag: ["tech"],
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const { records } = res.body;

    expect(records[0]).toMatchObject({
      id: expect.any(String),
      botId: "919222a3-c13e-4c8e-8f23-82fa872512cf",
      createdAt: "2020-11-01T12:52:56.000Z",
      image: "https://project.s3.region.amazonaws.com/image_1.png",
      headline: "Headline 1",
      html: "innerHTML",
      adLink: "www.cars.com/",
      loggedIn: true,
      seenOn: "https://www.theatlantic.com/",
      bot: expect.objectContaining({
        id: "919222a3-c13e-4c8e-8f23-82fa872512cf",
        username: "bot1",
        gender: "male",
        fName: "First",
        lName: "Bot",
        otherTermsCategory: 0,
        password: "password123",
        locLat: -23.139826,
        locLong: 34.139062,
        type: "google",
        politicalRanking: 0,
      }),
      tags: expect.arrayContaining([
        expect.objectContaining({
          name: "Tech",
        }),
        expect.objectContaining({
          name: "Food",
        }),
      ]),
    });
    done();
  });

  test("Get many ads with parameters (political and gender) #API-7", async (done) => {
    const res = await supertest(app)
      .get("/google/ads")
      .query({
        gender: ["male"],
        political: [0],
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const { records } = res.body;

    expect(records[0]).toMatchObject({
      id: expect.any(String),
      botId: "919222a3-c13e-4c8e-8f23-82fa872512cf",
      createdAt: "2020-11-10T12:52:56.000Z",
      image: "https://project.s3.region.amazonaws.com/image_2.png",
      headline: "Headline 2",
      html: null,
      adLink: "www.donuts.com/",
      loggedIn: false,
      seenOn: "https://www.youtube.com/",
      bot: expect.objectContaining({
        id: "919222a3-c13e-4c8e-8f23-82fa872512cf",
        username: "bot1",
        gender: "male",
        fName: "First",
        lName: "Bot",
        otherTermsCategory: 0,
        password: "password123",
        locLat: -23.139826,
        locLong: 34.139062,
        type: "google",
        politicalRanking: 0,
      }),
      tags: [],
    });

    expect(records[1]).toMatchObject({
      id: expect.any(String),
      botId: "919222a3-c13e-4c8e-8f23-82fa872512cf",
      createdAt: "2020-11-01T12:52:56.000Z",
      image: "https://project.s3.region.amazonaws.com/image_1.png",
      headline: "Headline 1",
      html: "innerHTML",
      adLink: "www.cars.com/",
      loggedIn: true,
      seenOn: "https://www.theatlantic.com/",
      bot: expect.objectContaining({
        id: "919222a3-c13e-4c8e-8f23-82fa872512cf",
        username: "bot1",
        gender: "male",
        fName: "First",
        lName: "Bot",
        otherTermsCategory: 0,
        password: "password123",
        locLat: -23.139826,
        locLong: 34.139062,
        type: "google",
        politicalRanking: 0,
      }),
      tags: expect.any(Array),
    });

    done();
  });

  test("Get many ads with parameters (multiple tags) #API-8", async (done) => {
    const res = await supertest(app)
      .get("/google/ads")
      .query({
        tag: ["tech", "Education"],
      })
      .expect("Content-Type", /json/)
      .expect(200);

    console.log(res.body);
    const { records } = res.body;

    for (const record of records) {
      // Each ad needs to contain at least one of the specified tags
      expect(record.tags).toBeOneOf([
        expect.arrayContaining([
          expect.objectContaining({
            name: "Tech",
          }),
        ]),
        expect.arrayContaining([
          expect.objectContaining({
            name: "Education",
          }),
        ]),
      ]);
    }

    done();
  });

  test("Get many ads with parameters (startDate and endDate) #API-9", async (done) => {
    const res = await supertest(app)
      .get("/google/ads")
      .query({
        startDate: Date.parse("2020-11-09T23:50:56"),
        endDate: Date.parse("2020-11-11T23:50:56"),
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const { records } = res.body;

    expect(records[0]).toMatchObject({
      id: expect.any(String),
      botId: "919222a3-c13e-4c8e-8f23-82fa872512cf",
      createdAt: "2020-11-10T12:52:56.000Z",
      image: "https://project.s3.region.amazonaws.com/image_2.png",
      headline: "Headline 2",
      html: null,
      adLink: "www.donuts.com/",
      loggedIn: false,
      seenOn: "https://www.youtube.com/",
      bot: expect.objectContaining({
        id: "919222a3-c13e-4c8e-8f23-82fa872512cf",
        username: "bot1",
        gender: "male",
        fName: "First",
        lName: "Bot",
        otherTermsCategory: 0,
        password: "password123",
        locLat: -23.139826,
        locLong: 34.139062,
        type: "google",
        politicalRanking: 0,
      }),
      tags: [],
    });

    done();
  });
});
