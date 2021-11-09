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

test("GET twitter/bots - return multiple bots #API-32", async (done) => {
  const res = (await supertest(app).get(`/twitter/bots`).expect(200)).body;
  for (const bot of res) {
    expect(bot).toMatchObject({
      id: expect.any(String),
      username: expect.any(String),
      politicalRanking: expect.any(Number),
      type: expect.any(String),
      followedAccounts: expect.any(Array),
      relevantTags: expect.any(Array),
      dob: expect.any(String),
    });
  }
  done();
});

test("GET twitter/bots/:id - get bot by id (valid) #API-33", async (done) => {
  const res = (await supertest(app).get(`/twitter/bots/bot1`).expect(200)).body;
  expect(res).toEqual({
    id: "bot1",
    username: "bot1",
    type: "america",
    politicalRanking: 0,
    followedAccounts: ["@follow1", "@follow2"],
    relevantTags: ["#tag1", "#tag2"],
    dob: "1980-10-29",
  });
  done();
});

test("GET twitter/bots/:id - get bot by id (invalid) #API-34", async (done) => {
  await supertest(app).get(`/twitter/bots/asdwe`).expect(404);
  done();
});
