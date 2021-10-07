import supertest from "supertest";
import { app, server } from "~/app";
import { connection } from "../../testConnection";

beforeAll(async (done) => {
  await connection.create();
  done();
});
afterAll(async (done) => {
  await connection.close();
  server.close();
  done();
});

beforeEach(async (done) => {
  await connection.createGoogleStatsTestData();
  done();
});

afterEach(async (done) => {
  await connection.clear();
  done();
});

describe("GET /google/stats", () => {
  test("GET /google/stats/bot-alignment - Get alignment stats for bots #API-21", async (done) => {
    const res = await supertest(app)
      .get("/google/stats/bot-alignment")
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = res;
    const expected = [
      {
        data: [
          {
            count: "1",
            label: "0",
          },
          {
            count: "2",
            label: "4",
          },
        ],
        type: "political ranking",
      },
      {
        data: [
          {
            count: "2",
            label: "Female",
          },
          {
            count: "1",
            label: "Male",
          },
        ],
        type: "gender",
      },
    ];
    expect(body).toEqual(expected);
    done();
  });

  test("GET /google/stats/category - Get category stats for bots #API-22", async (done) => {
    const res = await supertest(app)
      .get("/google/stats/category")
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = res;
    const expected = [
      {
        count: "1",
        label: "uncategorised",
      },
      {
        count: "1",
        label: "Food",
      },
      {
        count: "2",
        label: "Tech",
      },
      {
        count: "2",
        label: "Education",
      },
    ];
    expect(body).toEqual(expected);
    done();
  });

  test("GET /google/stats/category-bot - Get category distribution based on bots #API-23", async (done) => {
    const res = await supertest(app)
      .get("/google/stats/category-bot")
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = res;

    const expected = [
      {
        avgGender: 1,
        avgPolitical: 0,
        label: "uncategorised",
      },
      {
        avgGender: 1,
        avgPolitical: 0,
        label: "Food",
      },
      {
        avgGender: 0.5,
        avgPolitical: 2,
        label: "Tech",
      },
      {
        avgGender: 0,
        avgPolitical: 4,
        label: "Education",
      },
    ];
    expect(body).toEqual(expected);

    done();
  });
});

test("GET /google/stats/ad-count - Get ad scraping stats for bots #API-24 ", async (done) => {
  const startDate = Date.parse("2020-11-01T23:52:56");

  const res = await supertest(app)
    .get(`/google/stats/ad-count?startDate=${startDate}`)
    .expect("Content-Type", /json/)
    .expect(200);

  const { body } = res;
  const expected = [
    {
      count: "1",
      date: "2020-11-01T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-02T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-03T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-04T00:00:00.000Z",
    },
    {
      count: "1",
      date: "2020-11-05T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-06T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-07T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-08T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-09T00:00:00.000Z",
    },
    {
      count: "1",
      date: "2020-11-10T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-11T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-12T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-13T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-14T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-15T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-16T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-17T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-18T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-19T00:00:00.000Z",
    },
    {
      count: "1",
      date: "2020-11-20T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-21T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-22T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-23T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-24T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-25T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-26T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-27T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-28T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-29T00:00:00.000Z",
    },
    {
      count: "0",
      date: "2020-11-30T00:00:00.000Z",
    },
  ];

  expect(body).toEqual(expected);
  done();
});

test("GET /google/stats/ad-stat - Get general ad stats for bots #API-25 ", async (done) => {
  const res = await supertest(app)
    .get("/google/stats/ad-stat")
    .expect("Content-Type", /json/)
    .expect(200);

  const { body } = res;

  const expected = {
    adPerBot: 1.3333333333333333,
    adTagged: "3",
    adTotal: "4",
  };
  expect(body).toEqual(expected);
  done();
});
