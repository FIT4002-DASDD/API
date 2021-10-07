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
import {
  twitterAdMatcherSchema,
  twitterBotMatcherSchema,
} from "~/tests/customMatchers";
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
      followedAccounts: ["@follow1", "@follow2"],
      relevantTags: ["#tag1", "#tag2"],
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
});
