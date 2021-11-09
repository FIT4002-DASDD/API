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
describe("GET /twitter/tags", () => {
  test("get all tags #API-41", async (done) => {
    const allTags = (await supertest(app).get("/twitter/tags").expect(200))
      .body;
    const newTag = { name: "Sports" };
    const response = await supertest(app)
      .post("/twitter/tags")
      .send(newTag)
      .expect(200);

    for (const element of allTags) {
      expect(element).toMatchObject({
        id: expect.anything(),
        name: expect.any(String),
      });
    }
    done();
  });

  test("get a tag by id #API-42", async (done) => {
    const aTag = (await supertest(app).get("/twitter/tags").expect(200))
      .body[0];
    const aTag2 = (
      await supertest(app).get(`/twitter/tags/${aTag.id}`).expect(200)
    ).body;
    expect(aTag).toEqual(aTag2);
    done();
  });

  test("get a tag by invalid id #API-43", async (done) => {
    const aTag2 = await supertest(app)
      .get(`/twitter/tags/invalid-id`)
      .expect(404);
    done();
  });
});

describe("POST /twitter/tags", () => {
  test("Create new tags (valid) #API-44", async (done) => {
    const allTagsBeforeCreation = (await supertest(app).get("/twitter/tags"))
      .body;
    const newTag = { name: "Sports" };
    const response = await supertest(app)
      .post("/twitter/tags")
      .send(newTag)
      .expect(200);
    const allTagsAfterCreation = (await supertest(app).get("/twitter/tags"))
      .body;

    // check if the new tag was created
    expect(allTagsAfterCreation).toEqual(
      expect.arrayContaining(allTagsBeforeCreation)
    );
    expect(
      allTagsAfterCreation.find(
        (tag: any) => tag.name === newTag.name.toLowerCase()
      )
    ).toMatchObject({
      id: expect.anything(),
      name: newTag.name.toLowerCase(),
    });

    done();
  });

  test("Create new tags (duplicate name) #API-45", async (done) => {
    const allTagsBeforeCreation = (await supertest(app).get("/twitter/tags"))
      .body;
    const existingTag = allTagsBeforeCreation[0];
    const response = await supertest(app)
      .post("/twitter/tags")
      .send(existingTag)
      .expect(200);

    const allTagsAfterCreation = (await supertest(app).get("/twitter/tags"))
      .body;

    // check if tags are still the same
    expect(allTagsAfterCreation).toEqual(
      expect.arrayContaining(allTagsBeforeCreation)
    );
    done();
  });
});
