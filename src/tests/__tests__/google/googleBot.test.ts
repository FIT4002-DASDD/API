import supertest from "supertest";
import { DeepPartial } from "typeorm";
import { app, server } from "~/app";
import { GoogleAd, GoogleAdTag, GoogleBot, GoogleTag } from "~/models";
import { googleBotMatcherSchema } from "~/tests/customMatchers";
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
  const bot1 = GoogleBot.create({
    id: "919222a3-c13e-4c8e-8f23-82fa872512cf",
    username: "bot1",
    dob: new Date("1999-07-14"),
    gender: "male",
    fName: "First",
    lName: "Bot",
    otherTermsCategory: 0,
    password: "password123",
    locLat: -23.139826,
    locLong: 34.139062,
    type: "google",
    politicalRanking: 0,
  });

  const bot2 = GoogleBot.create({
    username: "bot2",
    dob: new Date("1980-10-29"),
    gender: "female",
    fName: "Second",
    lName: "Bot",
    otherTermsCategory: 4,
    password: "password12345",
    locLat: -33.152826,
    locLong: -12.139062,
    type: "google",
    politicalRanking: 4,
  });

  await GoogleBot.save([bot1, bot2]);

  const tag1 = GoogleTag.create({ name: "Tech" });
  const tag2 = GoogleTag.create({ name: "Food" });
  const tag3 = GoogleTag.create({ name: "Education" });

  await GoogleTag.save([tag1, tag2, tag3]);
  const ad1 = GoogleAd.create({
    bot: bot1,
    createdAt: new Date("2020-11-01T23:52:56.000Z"),
    loggedIn: true,
    seenOn: "https://www.theatlantic.com/",
    image: "https://project.s3.region.amazonaws.com/image_1.png",
    headline: "Headline 1",
    html: "innerHTML",
    adLink: "www.cars.com/",
  });

  const ad2 = GoogleAd.create({
    bot: bot1,
    createdAt: new Date("2020-11-10T23:52:56.000Z"),
    loggedIn: false,
    seenOn: "https://www.youtube.com/",
    image: "https://project.s3.region.amazonaws.com/image_2.png",
    headline: "Headline 2",
    adLink: "www.donuts.com/",
  });

  const ad3 = GoogleAd.create({
    bot: bot2,
    createdAt: new Date("2020-11-05T23:52:56.000Z"),
    loggedIn: true,
    seenOn: "https://www.bbc.com/news/science-environment-54395534",
    image: "https://project.s3.region.amazonaws.com/image_3.png",
    headline: "Headline 1",
    html: "innerHTML",
  });

  const ad4 = GoogleAd.create({
    bot: bot2,
    createdAt: new Date("2020-11-20T23:52:56.000Z"),
    loggedIn: false,
    headline: "Headline 2",
    html: "innerHTML",
    adLink: "www.donuts.com/",
  });

  await GoogleAd.save([ad1, ad2, ad3, ad4]);

  const adTagsData: DeepPartial<GoogleAdTag>[] = [
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
  const adTags = adTagsData.map((a) => GoogleAdTag.create(a));
  await GoogleAdTag.save(adTags);
  done();
});

afterEach(async (done) => {
  await connection.clear();
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
