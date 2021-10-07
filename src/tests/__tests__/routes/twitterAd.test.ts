import supertest from "supertest";
import { DeepPartial } from "typeorm";
import { app, server } from "~/app";
import {
  TwitterAd,
  TwitterAdSeenByBot,
  TwitterAdTag,
  TwitterAdType,
  TwitterBot,
  TwitterTag,
} from "~/models";
import { twitterBotMatcherSchema } from "~/tests/customMatchers";
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

describe("GET /google/ads", () => {
  beforeEach(async (done) => {
    const bot1 = TwitterBot.create({
      id: "bot1",
      username: "bot1",
      type: TwitterBot.BOT_TYPE.AMERICA,
      politicalRanking: TwitterBot.POLITICAL_RANKING.LEFT,
      followedAccounts: ["@follow1", "@follow2"],
      relevantTags: ["#tag1", "#tag2"],
      dob: new Date("1980-10-29"),
    } as Object);

    const bot2 = TwitterBot.create({
      id: "bot2",
      username: "bot2",
      type: TwitterBot.BOT_TYPE.AMERICA,
      politicalRanking: TwitterBot.POLITICAL_RANKING.RIGHT,
      followedAccounts: ["@follow3", "@follow4"],
      relevantTags: ["#tag3", "#tag4"],
      dob: new Date("1980-10-29"),
    } as Object);

    const bot3 = TwitterBot.create({
      id: "bot3",
      username: "bot3",
      type: TwitterBot.BOT_TYPE.AMERICA,
      politicalRanking: TwitterBot.POLITICAL_RANKING.RIGHT,
      followedAccounts: ["@follow1", "@follow2"],
      relevantTags: ["#tag1", "#tag2"],
      dob: new Date("1980-10-29"),
    } as Object);

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
      adType: TwitterAdType.TWEET,
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
    done();
  });

  test("Get many ads with no parameters #API-26", async (done) => {
    const res = await supertest(app)
      .get("/twitter/ads?groupUnique=true")
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
      expect(element).toMatchObject({
        id: expect.any(String),
        promoterHandle: expect.any(String),
        officialLink: expect.any(String),
        tweetLink: expect.any(String),
        image: expect.any(String),
        adType: expect.toBeOneOf(Object.values(TwitterAdType)),
        tags: expect.toBeArray(),
      });

      const { seenInstances } = element;
      if (seenInstances.length > 0) {
        expect(seenInstances).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              adSeenId: expect.any(Number),
              adId: expect.any(String),
              botId: expect.any(String),
              createdAt: expect.any(String),
              bot: expect.objectContaining(twitterBotMatcherSchema),
            }),
          ])
        );
      }
    }

    done();
  });
  test("Check ads metadata pagination link #API-27", async (done) => {
    const res = await supertest(app)
      .get("/twitter/ads?groupUnique=true&limit=1")
      .expect("Content-Type", /json/)
      .expect(200);

    const metadata = res.body.metadata;
    expect(metadata).toMatchObject({
      page: 0,
      per_page: 1,
      page_count: 1,
      total_count: 4,
      links: {
        self: "/twitter/ads?groupUnique=true&limit=1&offset=0",
        first: "/twitter/ads?groupUnique=true&limit=1&offset=0",
        previous: "/twitter/ads?groupUnique=true&limit=1&offset=0",
        next: "/twitter/ads?groupUnique=true&limit=1&offset=1",
        last: "/twitter/ads?groupUnique=true&limit=1&offset=4",
      },
    });

    const res2 = await supertest(app)
      .get("/twitter/ads?groupUnique=true&limit=1&offset=1")
      .expect("Content-Type", /json/)
      .expect(200);

    const metadata2 = res2.body.metadata;
    expect(metadata2).toMatchObject({
      page: 1,
      per_page: 1,
      page_count: 1,
      total_count: 4,
      links: {
        self: "/twitter/ads?groupUnique=true&limit=1&offset=1",
        first: "/twitter/ads?groupUnique=true&limit=1&offset=0",
        previous: "/twitter/ads?groupUnique=true&limit=1&offset=0",
        next: "/twitter/ads?groupUnique=true&limit=1&offset=2",
        last: "/twitter/ads?groupUnique=true&limit=1&offset=4",
      },
    });
    done();
  });

  test("Get many ads with parameters (bots and tag) #API-28", async (done) => {
    const res = await supertest(app)
      .get("/twitter/ads?groupUnique=true")
      .query({
        limit: 1,
        bots: "bot1",
        tag: ["Technology"],
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const { records } = res.body;

    expect(records[0]).toMatchObject({
      id: expect.any(String),
      promoterHandle: "@promoter",
      content: "Hi this is a cute kitten",
      officialLink: "https://twittertest1.com",
      tweetLink: "https://twittertest1.com",
      image: "http://placekitten.com/200/300",
      adType: "AD_TYPE_UNSPECIFIED",
      seenInstances: expect.arrayContaining([
        expect.objectContaining({
          adSeenId: expect.any(Number),
          adId: expect.any(String),
          botId: "bot1",
          createdAt: "2020-11-01T23:52:56.000Z",
          bot: {
            id: "bot1",
            username: "bot1",
            type: "america",
            politicalRanking: 0,
            followedAccounts: ["@follow1", "@follow2"],
            relevantTags: ["#tag1", "#tag2"],
            dob: "1980-10-29",
          },
        }),
      ]),
      tags: expect.arrayContaining([
        expect.objectContaining({
          name: "Technology",
        }),
        expect.objectContaining({
          name: "Sports",
        }),
      ]),
    });
    done();
  });

  test("Get many ads with parameters (political ranking and bot type) #API-29", async (done) => {
    const res = await supertest(app)
      .get("/twitter/ads?groupUnique=true")
      .query({
        political: [4],
        type: "america",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const { records } = res.body;
    expect(records).toBeArrayOfSize(3);
    expect(records[0]).toMatchObject({
      id: expect.any(String),
      promoterHandle: "@promoter",
      content: "Hi this is a cute kitten",
      officialLink: "https://twittertest1.com",
      tweetLink: "https://twittertest1.com",
      image: "http://placekitten.com/200/300",
      adType: "AD_TYPE_UNSPECIFIED",
      seenInstances: expect.arrayContaining([
        expect.objectContaining({
          adSeenId: expect.any(Number),
          adId: expect.any(String),
          botId: "bot2",
          createdAt: "2020-11-01T23:52:56.000Z",
          bot: {
            id: "bot2",
            username: "bot2",
            type: "america",
            politicalRanking: 4,
            followedAccounts: ["@follow3", "@follow4"],
            relevantTags: ["#tag3", "#tag4"],
            dob: "1980-10-29",
          },
        }),
      ]),
      tags: expect.arrayContaining([
        expect.objectContaining({
          name: "Technology",
        }),
        expect.objectContaining({
          name: "Sports",
        }),
      ]),
    });
    done();
  });

  test("Get many ads with parameters (multiple tags) #API-30", async (done) => {
    const res = await supertest(app)
      .get("/twitter/ads?groupUnique=true")
      .query({
        tag: ["Technology", "Sports"],
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const { records } = res.body;
    expect(records).toBeArrayOfSize(2);
    expect(records[0]).toMatchObject({
      id: expect.any(String),
      promoterHandle: "@promoter",
      content: "Hi this is a cute kitten",
      officialLink: "https://twittertest1.com",
      tweetLink: "https://twittertest1.com",
      image: "http://placekitten.com/200/300",
      adType: "AD_TYPE_UNSPECIFIED",
      seenInstances: expect.arrayContaining([
        expect.objectContaining({
          adSeenId: expect.any(Number),
          adId: expect.any(String),
          botId: "bot2",
          createdAt: "2020-11-01T23:52:56.000Z",
          bot: {
            id: "bot2",
            username: "bot2",
            type: "america",
            politicalRanking: 4,
            followedAccounts: ["@follow3", "@follow4"],
            relevantTags: ["#tag3", "#tag4"],
            dob: "1980-10-29",
          },
        }),
      ]),
      tags: expect.arrayContaining([
        expect.objectContaining({
          name: "Technology",
        }),
        expect.objectContaining({
          name: "Sports",
        }),
      ]),
    });
    done();
  });

  test("Get many ads with parameters (multiple tags) #API-30", async (done) => {
    const res = await supertest(app)
      .get("/twitter/ads?groupUnique=true")
      .query({
        startDate: Date.parse("2020-11-09T23:50:56"),
        endDate: Date.parse("2020-11-11T23:50:56"),
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const { records } = res.body;
    expect(records).toBeArrayOfSize(1);
    expect(records[0]).toMatchObject({
      image: "http://placekitten.com/200/300",
      promoterHandle: "@promoter",
      content: "Hi this is a cute kitten",
      officialLink: "https://twittertest3.com",
      tweetLink: "https://twittertest3.com",
      adType: TwitterAdType.TWEET,
      seenInstances: expect.arrayContaining([
        expect.objectContaining({
          adSeenId: expect.any(Number),
          adId: expect.any(String),
          botId: "bot3",
          createdAt: "2020-11-09T23:52:56.000Z",
          bot: {
            id: "bot3",
            username: "bot3",
            type: TwitterBot.BOT_TYPE.AMERICA,
            politicalRanking: TwitterBot.POLITICAL_RANKING.RIGHT,
            followedAccounts: ["@follow1", "@follow2"],
            relevantTags: ["#tag1", "#tag2"],
            dob: "1980-10-29",
          },
        }),
      ]),
      tags: expect.arrayContaining([
        expect.objectContaining({
          name: "Politics",
        }),
      ]),
    });
    done();
  });
});
