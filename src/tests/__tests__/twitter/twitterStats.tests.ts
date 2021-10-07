import supertest from "supertest";
import { app, server } from "~/app";
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
  await connection.createTwitterStatsTestData();
  done();
});

afterEach(async (done) => {
  await connection.clear();
  server.close();
  done();
});

describe("GET /twitter/stats", () => {
  test("GET /twitter/stats/bot-alignment - Get alignment stats for bots #API-46", async (done) => {
    const res = await supertest(app)
      .get("/twitter/stats/bot-alignment")
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
    ];
    expect(body).toEqual(expected);
    done();
  });

  test("GET /twitter/stats/category - Get category stats for bots #API-47", async (done) => {
    const res = await supertest(app)
      .get("/twitter/stats/category")
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
        label: "Sports",
      },
      {
        count: "2",
        label: "Technology",
      },
      {
        count: "2",
        label: "Politics",
      },
    ];
    expect(body).toEqual(expected);
    done();
  });

  test("GET /twitter/stats/ad-count - Get ad scraping stats for bots #API-24 ", async (done) => {
    const startDate = Date.parse("2020-11-01T23:52:56");

    const res = await supertest(app)
      .get(`/twitter/stats/ad-count?startDate=${startDate}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = res;
    const expected = [
      {
        count: "2",
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
        count: "1",
        date: "2020-11-09T00:00:00.000Z",
      },
      {
        count: "0",
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
        count: "0",
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

  test("GET /twitter/stats/ad-stat - Get general ad stats for bots #API-25 ", async (done) => {
    const res = await supertest(app)
      .get("/twitter/stats/ad-stat")
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = res;

    const expected = {
      adSeenCount: 4,
      adSeenPerBot: 4 / 3,
      adTagged: 3,
      adUniqueCount: 4,
      adUniquePerBot: 4 / 3,
    };
    expect(body).toEqual(expected);
    done();
  });
});
