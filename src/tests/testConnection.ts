import { createDatabase } from "pg-god";
import {
  Connection,
  createConnection,
  DeepPartial,
  getConnection,
} from "typeorm";
import ORMConfig from "~/configs/ormconfig";
import { GoogleAd, GoogleAdTag, GoogleBot, GoogleTag } from "~/models";
import {
  TwitterAd,
  TwitterAdTag,
  TwitterBot,
  TwitterTag,
  TwitterAdSeenByBot,
} from "~/models";
const env = process.env;
if (env.NODE_ENV !== "test") {
  console.error("Test utilities only available in testing mode");
}

const connection = {
  async create() {
    // await createConnection();

    await createDatabase(
      { databaseName: ORMConfig.database },
      {
        user: ORMConfig.username,
        port: ORMConfig.port,
        host: ORMConfig.host,
        password:
          typeof ORMConfig.password === "undefined"
            ? undefined
            : typeof ORMConfig.password === "string"
            ? ORMConfig.password
            : await ORMConfig.password(),
      }
    );

    let connection: Connection | undefined;
    try {
      connection = getConnection();
    } catch (e) {}

    try {
      if (connection) {
        if (!connection.isConnected) {
          connection = await connection.connect();
        }
      }
      connection = await createConnection({ ...ORMConfig, dropSchema: true });
      return connection;
    } catch (e) {
      throw e;
    }
  },

  async close() {
    const connection = getConnection();
    // await connection.dropDatabase();
    await connection.close();
  },

  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`TRUNCATE ${entity.tableName} CASCADE`);
    }
  },

  async createGoogleTestData() {
    getConnection();
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
  },

  async createGoogleStatsTestData() {
    getConnection();
    const bot1 = GoogleBot.create({
      username: "bot1",
      dob: new Date("1999-07-14"),
      gender: "Male",
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
      gender: "Female",
      fName: "Second",
      lName: "Bot",
      otherTermsCategory: 4,
      password: "password12345",
      locLat: -33.152826,
      locLong: -12.139062,
      type: "google",
      politicalRanking: 4,
    });

    const bot3 = GoogleBot.create({
      username: "bot3",
      dob: new Date("1980-10-29"),
      gender: "Female",
      fName: "Third",
      lName: "Bot",
      otherTermsCategory: 4,
      password: "password1234",
      locLat: -32.152826,
      locLong: -11.139062,
      type: "google",
      politicalRanking: 4,
    });

    await GoogleBot.save([bot1, bot2, bot3]);

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
      bot: bot3,
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
  },

  async createTwitterStatsTestData() {
    getConnection();
    const bot1 = TwitterBot.create({
      id: "bot1",
      username: "bot1",
      type: TwitterBot.BOT_TYPE.AMERICA,
      politicalRanking: TwitterBot.POLITICAL_RANKING.LEFT,
      followedAccounts: ["@follow1", "@follow2"],
      relevantTags: ["#tag1", "#tag2"],
      dob: new Date("1980-10-29"),
      adBot: [],
    });

    const bot2 = TwitterBot.create({
      id: "bot2",
      username: "bot2",
      type: TwitterBotType.AMERICA,
      politicalRanking: TwitterPoliticalRanking.RIGHT,
      followedAccounts: ["@follow1", "@follow2"],
      relevantTags: ["#tag1", "#tag2"],
      dob: new Date("1980-10-29"),
      adBot: [],
    });

    const bot3 = TwitterBot.create({
      id: "bot3",
      username: "bot3",
      type: TwitterBotType.AMERICA,
      politicalRanking: TwitterPoliticalRanking.RIGHT,
      followedAccounts: ["@follow1", "@follow2"],
      relevantTags: ["#tag1", "#tag2"],
      dob: new Date("1980-10-29"),
      adBot: [],
    });

    await TwitterBot.save([bot1, bot2, bot3]);

    const tag1 = TwitterTag.create({ name: "Tech" });
    const tag2 = TwitterTag.create({ name: "Food" });
    const tag3 = TwitterTag.create({ name: "Education" });

    await TwitterTag.save([tag1, tag2, tag3]);

    const ad1 = TwitterAd.create({
      bot: bot1,
      createdAt: new Date("2020-11-01T23:52:56.000Z"),
      loggedIn: true,
      seenOn: "https://www.theatlantic.com/",
      image: "https://project.s3.region.amazonaws.com/image_1.png",
      headline: "Headline 1",
      html: "innerHTML",
      adLink: "www.cars.com/",
    });

    const ad2 = TwitterAd.create({
      bot: bot1,
      createdAt: new Date("2020-11-10T23:52:56.000Z"),
      loggedIn: false,
      seenOn: "https://www.youtube.com/",
      image: "https://project.s3.region.amazonaws.com/image_2.png",
      headline: "Headline 2",
      adLink: "www.donuts.com/",
    });

    const ad3 = TwitterAd.create({
      bot: bot2,
      createdAt: new Date("2020-11-05T23:52:56.000Z"),
      loggedIn: true,
      seenOn: "https://www.bbc.com/news/science-environment-54395534",
      image: "https://project.s3.region.amazonaws.com/image_3.png",
      headline: "Headline 1",
      html: "innerHTML",
    });

    const ad4 = TwitterAd.create({
      bot: bot3,
      createdAt: new Date("2020-11-20T23:52:56.000Z"),
      loggedIn: false,
      headline: "Headline 2",
      html: "innerHTML",
      adLink: "www.donuts.com/",
    });

    await TwitterAd.save([ad1, ad2, ad3, ad4]);

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
  },
};

export { connection };
