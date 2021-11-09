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

describe("GET /twitter/ads", () => {
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
      id: "f5110c0c-cfbd-472d-9f8e-41dbd470d806",
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

  test("Get many ads with parameters (multiple tags) #API-31", async (done) => {
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

  test("/:id Get an ad by id (valid) #API-35", async (done) => {
    const res = await supertest(app)
      .get(`/twitter/ads/f5110c0c-cfbd-472d-9f8e-41dbd470d806`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toMatchObject({
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

  test("/:id Get an ad by id (invalid) #API-36", async (done) => {
    const res = await supertest(app)
      .get(`/twitter/ads/cf2eb713-bbcc-4cb9-b960-439fd85ec381`)
      .expect("Content-Type", /json/)
      .expect(404);
    done();
  });
});

describe("POST google/ads/:id/tags/:tagId ", () => {
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

    await TwitterBot.save([bot1]);

    const tag1 = TwitterTag.create({ name: "Technology" });
    const tag2 = TwitterTag.create({ name: "Sports" });
    const tag3 = TwitterTag.create({ name: "Politics" });

    await TwitterTag.save([tag1, tag2, tag3]);

    const ad3 = TwitterAd.create({
      id: "f5110c0c-cfbd-472d-9f8e-41dbd470d806",
      image: "http://placekitten.com/200/300",
      promoterHandle: "@promoter",
      content: "Hi this is a cute kitten",
      officialLink: "https://twittertest3.com",
      tweetLink: "https://twittertest3.com",
      adType: TwitterAdType.TWEET,
    });

    await TwitterAd.save([ad3]);

    const adBotData: DeepPartial<TwitterAdSeenByBot>[] = [
      {
        ad: ad3,
        bot: bot1,
        createdAt: new Date("2020-11-09T23:52:56.000Z"),
      },
    ];

    const adBots = adBotData.map((a) => TwitterAdSeenByBot.create(a));
    await TwitterAdSeenByBot.save(adBots);

    const adTagsData: DeepPartial<TwitterAdTag>[] = [
      {
        ad: ad3,
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
  test("Create new ad tag (valid case) #API-37", async (done) => {
    const ad = (await supertest(app).get("/twitter/ads?groupUnique=true")).body
      .records[0];
    const allTags = (await supertest(app).get("/twitter/tags")).body;
    const newTag = allTags.find(
      (t: any) => !ad.tags.map((adtag: any) => adtag.name).includes(t.name)
    );

    const res = await supertest(app)
      .post(`/twitter/ads/${ad.id}/tags/${newTag.id}`)
      .expect(200);

    const expected = {
      image: "http://placekitten.com/200/300",
      promoterHandle: "@promoter",
      content: "Hi this is a cute kitten",
      officialLink: "https://twittertest3.com",
      tweetLink: "https://twittertest3.com",
      adType: TwitterAdType.TWEET,
      tags: expect.arrayContaining([
        {
          id: newTag.id,
          name: newTag.name,
        },
      ]),
    };

    const { body } = res;
    expect(body).toMatchObject(expected);
    done();
  });

  test("Create new ad tag (invalid case) - invalid ad id with valid tag id #API-38-1", async (done) => {
    const ad = (await supertest(app).get("/twitter/ads?groupUnique=true")).body
      .records[0];
    const allTags = (await supertest(app).get("/twitter/tags")).body;
    const newTag = allTags.find(
      (t: any) => !ad.tags.map((adtag: any) => adtag.name).includes(t.name)
    );
    const res = await supertest(app)
      .post(`/twitter/ads/1/tags/${newTag.id}`)
      .expect("Content-Type", /json/)
      .expect(404);
    done();
  });

  test("Create new ad tag (invalid case) - valid ad id with invalid tag id #API-38-2", async (done) => {
    const ad = (await supertest(app).get("/twitter/ads?groupUnique=true")).body
      .records[0];
    const allTags = (await supertest(app).get("/twitter/tags")).body;
    const invalidTagId = Math.max(...allTags.map((t: any) => t.id)) + 1;
    const res = await supertest(app)
      .post(`/twitter/ads/${ad.id}/tags/${invalidTagId}`)
      .expect(404);
    done();
  });

  test("Create new ad tag (invalid case) - duplicate ad id and tag id #API-38-3", async (done) => {
    const ad = (await supertest(app).get("/twitter/ads?groupUnique=true")).body
      .records[0];
    const res = await supertest(app)
      .post(`/twitter/ads/${ad.id}/tags/${ad.tags[0].id}`)
      .expect(200);
    const adAfterCreate = (await supertest(app).get(`/twitter/ads/${ad.id}`))
      .body;

    // check that no new tag was added
    expect(adAfterCreate).toEqual(ad);
    done();
  });
});

describe("POST google/ads/:id/tags/:tagId ", () => {
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

    await TwitterBot.save([bot1]);

    const tag1 = TwitterTag.create({ name: "Technology" });
    const tag2 = TwitterTag.create({ name: "Sports" });
    const tag3 = TwitterTag.create({ name: "Politics" });

    await TwitterTag.save([tag1, tag2, tag3]);

    const ad3 = TwitterAd.create({
      id: "f5110c0c-cfbd-472d-9f8e-41dbd470d806",
      image: "http://placekitten.com/200/300",
      promoterHandle: "@promoter",
      content: "Hi this is a cute kitten",
      officialLink: "https://twittertest3.com",
      tweetLink: "https://twittertest3.com",
      adType: TwitterAdType.TWEET,
    });

    await TwitterAd.save([ad3]);

    const adBotData: DeepPartial<TwitterAdSeenByBot>[] = [
      {
        ad: ad3,
        bot: bot1,
        createdAt: new Date("2020-11-09T23:52:56.000Z"),
      },
    ];

    const adBots = adBotData.map((a) => TwitterAdSeenByBot.create(a));
    await TwitterAdSeenByBot.save(adBots);

    const adTagsData: DeepPartial<TwitterAdTag>[] = [
      {
        ad: ad3,
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
  test("Delete existing ad-tag (valid id) #API-39", async (done) => {
    const adWithTag = (
      await supertest(app).get("/twitter/ads?groupUnique=true")
    ).body.records.find((ad: any) => ad.tags.length >= 1);

    const existingAdTag = adWithTag.tags[0];

    const res = await supertest(app)
      .delete(`/twitter/ads/${adWithTag.id}/tags/${existingAdTag.id}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const adAfterDelete = (
      await supertest(app).get(`/twitter/ads/${adWithTag.id}`)
    ).body;

    // Check that the ad tag was deleted
    expect(adAfterDelete.tags).not.toEqual(
      expect.arrayContaining([existingAdTag])
    );

    // Check that the remaining tags are the same
    expect(adAfterDelete.tags).toEqual(
      expect.arrayContaining(adWithTag.tags.slice(1))
    );
    done();
  });
  test("Delete existing ad-tag (invalid ad id) #API-15-1", async (done) => {
    const aTag = (await supertest(app).get("/twitter/tags")).body[0];
    const invalidAdId = "invalid-id";
    const res = await supertest(app)
      .delete(`/twitter/ads/${invalidAdId}/tags/${aTag.id}`)
      .expect("Content-Type", /json/)
      .expect(404);
    done();
  });
  test("Delete existing ad-tag (invalid tag id) #API-15-2", async (done) => {
    const validAd = (await supertest(app).get("/twitter/ads?groupUnique=true"))
      .body.records[0];
    const allTags = (await supertest(app).get("/twitter/tags")).body;

    const tagNotInAd = allTags.find(
      (tag: any) => tag.id !== validAd.tags[0].id
    );
    const res = await supertest(app)
      .delete(`/twitter/ads/${validAd.id}/tags/${tagNotInAd}`)
      .expect("Content-Type", /json/)
      .expect(404);

    const adAfterDelete = (
      await supertest(app).get("/twitter/ads?groupUnique=true")
    ).body.records[0];

    // Check that ad remains the same
    expect(adAfterDelete).toEqual(validAd);
    done();
  });
});
