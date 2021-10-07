import csv from "csvtojson";
import path from "path";
import { DBConnect } from "~/helpers/dbConnection";
import {
  TwitterAd,
  TwitterAdSeenByBot,
  TwitterAdType,
  TwitterBot,
} from "~/models";

const main = async () => {
  const connection = await DBConnect();
  // Import twitter bots.csv
  await importBots();
  await importAds();
  await connection?.close();
};

main();

async function importBots() {
  const botFilePath = path.resolve("src/twitter-data/twitter_bots.csv");
  let count = 0;

  let entries: any[] = [];
  const botJson = await csv().fromFile(botFilePath);
  console.log(botJson);
  for (const bot of botJson) {
    count++;
    entries.push(
      TwitterBot.create({
        id: bot.id,
        politicalRanking: bot.politicalRanking,
        username: bot.username,
      })
    );
    if (count % 100 === 0) {
      await TwitterBot.save(entries);
      entries = [];
    }
  }
  if (entries.length > 0) {
    await TwitterBot.save(entries);
    entries = [];
  }
}

type AdJson = {
  botId: string;
  promoter_handle: string;
  content: string;
  screenshot: string;
  created_at: string;
  seen_on: string;
  official_ad_link: string;
  ad_type: string;
};

async function importAds() {
  const adFilePath = path.resolve("src/twitter-data/twitter_ads.csv");

  let adBotEntries: any[] = [];

  const adJsonList: AdJson[] = await csv().fromFile(adFilePath);
  console.log(adJsonList);
  for (const adJson of adJsonList) {
    const adFound = await TwitterAd.findOne({ tweetLink: adJson.seen_on });
    // Not super efficient to search and write one by one but there's a current bug
    // when inserting duplicated key/constraint: https://github.com/typeorm/typeorm/issues/8045
    if (!adFound) {
      const newAd = TwitterAd.create({
        promoterHandle: adJson.promoter_handle,
        content: adJson.content,
        officialLink: adJson.official_ad_link,
        tweetLink: adJson.seen_on,
        adType: adJson.ad_type as TwitterAdType,
        image: adJson.screenshot,
      });
      await TwitterAd.save(newAd);
    }
  }

  for (const adJson of adJsonList) {
    const adFound = await TwitterAd.findOneOrFail({
      tweetLink: adJson.seen_on,
    });
    adBotEntries.push(
      TwitterAdSeenByBot.create({
        adId: adFound.id,
        botId: adJson.botId,
        createdAt: adJson.created_at,
      })
    );
    if (adBotEntries.length % 100 === 0) {
      await TwitterAdSeenByBot.save(adBotEntries);
      adBotEntries = [];
    }
  }
  await TwitterAdSeenByBot.save(adBotEntries);
  adBotEntries = [];
}
