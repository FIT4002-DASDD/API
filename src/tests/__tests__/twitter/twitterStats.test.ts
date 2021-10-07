import supertest from "supertest";
import { DeepPartial } from "typeorm";
import { app, server } from "~/app";
import {
  TwitterAd,
  TwitterAdSeenByBot,
  TwitterAdTag,
  TwitterBot,
  TwitterTag,
} from "~/models";
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
  const bot1 = TwitterBot.create({
    id: "bot1",
    username: "bot1",
    type: TwitterBot.BOT_TYPE.AMERICA,
    politicalRanking: TwitterBot.POLITICAL_RANKING.LEFT,
    followedAccounts: ["@follow1", "@follow2"],
    relevantTags: ["#tag1", "#tag2"],
    dob: new Date("1980-10-29"),
  });

  const bot2 = TwitterBot.create({
    id: "bot2",
    username: "bot2",
    type: TwitterBot.BOT_TYPE.AMERICA,
    politicalRanking: TwitterBot.POLITICAL_RANKING.RIGHT,
    followedAccounts: ["@follow1", "@follow2"],
    relevantTags: ["#tag1", "#tag2"],
    dob: new Date("1980-10-29"),
  });

  const bot3 = TwitterBot.create({
    id: "bot3",
    username: "bot3",
    type: TwitterBot.BOT_TYPE.AMERICA,
    politicalRanking: TwitterBot.POLITICAL_RANKING.RIGHT,
    followedAccounts: ["@follow1", "@follow2"],
    relevantTags: ["#tag1", "#tag2"],
    dob: new Date("1980-10-29"),
  });

  await TwitterBot.save([bot1, bot2, bot3]);

  const tag1 = TwitterTag.create({ name: "Technology" });
  const tag2 = TwitterTag.create({ name: "Sports" });
  const tag3 = TwitterTag.create({ name: "Politics" });

  await TwitterTag.save([tag1, tag2, tag3]);

  const ad1 = TwitterAd.create({
    image: "http://placekitten.com/200/300",
    promoterHandle: "@promoter",
    content: "Hi this is a cute kitten",
    officialLink: "https://twittertest1.com",
    tweetLink: "https://twittertest1.com",
  });

  const ad2 = TwitterAd.create({
    image: "http://placekitten.com/200/300",
    promoterHandle: "@promoter",
    content: "Hi this is a cute kitten",
    officialLink: "https://twittertest2.com",
    tweetLink: "https://twittertest2.com",
  });

  const ad3 = TwitterAd.create({
    image: "http://placekitten.com/200/300",
    promoterHandle: "@promoter",
    content: "Hi this is a cute kitten",
    officialLink: "https://twittertest3.com",
    tweetLink: "https://twittertest3.com",
  });

  const ad4 = TwitterAd.create({
    image: "http://placekitten.com/200/300",
    promoterHandle: "@promoter",
    content: "Hi this is a cute kitten",
    officialLink: "https://twittertest4.com",
    tweetLink: "https://twittertest4.com",
  });

  await TwitterAd.save([ad1, ad2, ad3, ad4]);

  const adBotData: DeepPartial<TwitterAdSeenByBot>[] = [
    {
      ad: ad1,
      bot: bot1,
      createdAt: new Date("2020-11-01T23:52:56.000Z"),
    },
    {
      ad: ad1,
      bot: bot2,
      createdAt: new Date("2020-11-01T23:52:56.000Z"),
    },
    {
      ad: ad2,
      bot: bot2,
      createdAt: new Date("2020-11-05T23:52:56.000Z"),
    },
    {
      ad: ad3,
      bot: bot3,
      createdAt: new Date("2020-11-09T23:52:56.000Z"),
    },
  ];

  const adBots = adBotData.map((a) => TwitterAdSeenByBot.create(a));
  await TwitterAdSeenByBot.save(adBots);

  const adTagsData: DeepPartial<TwitterAdTag>[] = [
    {
      ad: ad1,
      tag: tag1,
    },
    {
      ad: ad1,
      tag: tag2,
    },
    {
      ad: ad3,
      tag: tag3,
    },
    {
      ad: ad4,
      tag: tag1,
    },
    {
      ad: ad4,
      tag: tag3,
    },
  ];
  const adTags = adTagsData.map((a) => TwitterAdTag.create(a));
  await TwitterAdTag.save(adTags);
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
