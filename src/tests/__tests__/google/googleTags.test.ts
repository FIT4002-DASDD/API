import supertest from "supertest";
import { DeepPartial } from "typeorm";
import { app, server } from "~/app";
import { GoogleAd, GoogleAdTag, GoogleBot, GoogleTag } from "~/models";
import { googleAdMatcherSchema } from "~/tests/customMatchers";
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

describe("POST /google/tags", () => {
  beforeEach(async (done) => {
    // Create test data
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

    await GoogleBot.save([bot1]);

    const tag1 = GoogleTag.create({ name: "Tech" });
    const tag2 = GoogleTag.create({ name: "Food" });
    const tag3 = GoogleTag.create({ name: "Education" });

    await GoogleTag.save([tag1, tag2, tag3]);

    const ad1 = GoogleAd.create({
      id: "3883387e-8431-4cf6-ad87-6b274a882ff9",
      bot: bot1,
      createdAt: new Date("2020-11-01T23:52:56.000Z"),
      image: "https://project.s3.region.amazonaws.com/image_3.png",
      seenOn: "https://www.bbc.com/news/science-environment-54395534",
      loggedIn: false,
      headline: "Headline 1",
      html: "innerHTML",
      adLink: "www.donuts.com/",
    });

    const ad2 = GoogleAd.create({
      id: "3883387e-8431-4cf6-ad87-6b274a882ff1",
      bot: bot1,
      createdAt: new Date("2020-11-01T23:52:56.000Z"),
      image: "https://project.s3.region.amazonaws.com/image_3.png",
      seenOn: "https://www.bbc.com/news/science-environment-54395534",
      loggedIn: false,
      headline: "Headline 1",
      html: "innerHTML",
      adLink: "www.donuts.com/",
    });

    await GoogleAd.save([ad1, ad2]);

    const adTagsData: DeepPartial<GoogleAdTag>[] = [
      {
        ad: ad2,
        tag: tag1,
      },
      {
        ad: ad2,
        tag: tag2,
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
  test("Create new tags (valid) #API-16", async (done) => {
    const allTagsBeforeCreation = (await supertest(app).get("/google/tags"))
      .body;
    const newTag = { name: "Sports" };
    const response = await supertest(app)
      .post("/google/tags")
      .send(newTag)
      .expect(200);
    const allTagsAfterCreation = (await supertest(app).get("/google/tags"))
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

  test("Create new tags (duplicate name) #API-16", async (done) => {
    const allTagsBeforeCreation = (await supertest(app).get("/google/tags"))
      .body;
    const existingTag = allTagsBeforeCreation[0];
    const response = await supertest(app)
      .post("/google/tags")
      .send(existingTag)
      .expect(200);

    const allTagsAfterCreation = (await supertest(app).get("/google/tags"))
      .body;

    // check if tags are still the same
    expect(allTagsAfterCreation).toEqual(
      expect.arrayContaining(allTagsBeforeCreation)
    );
    done();
  });
});
