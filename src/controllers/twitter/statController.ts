import e from "cors";
import { createQueryBuilder, getConnection } from "typeorm";
import {
  TwitterAd,
  TwitterAdSeenByBot,
  TwitterAdTag,
  TwitterBot,
} from "~/models";

export class TwitterStatController {
  async getBotAlignmentStat() {
    let res: any = [];
    let rawRes = await TwitterBot.createQueryBuilder("bot")
      .select("COUNT(bot.id)", "count")
      .addSelect("bot.politicalRanking", "label")
      .groupBy("bot.politicalRanking")
      .orderBy("bot.politicalRanking")
      .getRawMany();
    res.push({
      type: "political ranking",
      data: rawRes,
    });

    return res;
  }

  async getCategoryStat() {
    let rawRes = await TwitterAd.createQueryBuilder("ad")
      .leftJoin("ad.adTags", "adTags")
      .leftJoin("adTags.tag", "tag")
      .select("COUNT(ad.id)", "count")
      .addSelect("tag.name", "label")
      .groupBy("tag.name")
      .getRawMany();
    rawRes.forEach((e) => {
      if (e.label === null) {
        e.label = "uncategorised";
      }
    });
    return rawRes;
  }

  async getCategoryBotStat() {
    let rawRes = await TwitterAd.createQueryBuilder("ad")
      .leftJoin("ad.adTags", "adTags")
      .leftJoin("adTags.tag", "tag")
      .leftJoin("ad.adBot", "adBot")
      .leftJoin("adBot.bot", "bot")
      .select("AVG(bot.politicalRanking)", "avgPolitical")
      .addSelect("tag.name", "label")
      .groupBy("tag.name")
      .getRawMany();

    rawRes.forEach((e) => {
      if (e.label === null) {
        e.label = "uncategorised";
      }
    });
    console.log(rawRes);
    return rawRes;
  }

  async getAdCounts(startDate: Date) {
    const start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-01`;
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
    const end = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-01`;

    const twitterAdTableName = TwitterAdSeenByBot.getRepository().metadata
      .tableName;
    const rawRes = await getConnection().manager.query(
      `
        SELECT date, count(a."createdAt") AS count
        FROM  generate_series($1::date, $2::date, interval '1 day') g(date)
        LEFT JOIN ${twitterAdTableName} a ON a."createdAt" >= g.date
                        AND a."createdAt"  <  g.date + interval '1 day'
        GROUP  BY 1
        ORDER  BY 1;
      `,
      [start, end]
    );

    return rawRes;
  }

  async getAdStats() {
    const adUniqueCount = (
      await TwitterAd.createQueryBuilder("ad")
        .select("COUNT(*)", "adCount")
        .getRawOne()
    ).adCount;

    const adSeenCount = (
      await TwitterAdSeenByBot.createQueryBuilder("adBot")
        .select("COUNT(*)", "adBot")
        .getRawOne()
    ).adBot;

    const adTagged = (
      await TwitterAdTag.createQueryBuilder("adtag")
        .select("COUNT(DISTINCT adtag.adId)", "adTaggedCount")
        .getRawOne()
    ).adTaggedCount;

    const botCount = (await TwitterBot.findAndCount())[1];

    return {
      adUniqueCount, // Unique ad count (i.e. # of entries in TwitterAd)
      adSeenCount, // All instances of ads seend (i.e. # of entries in TwitterAdSeenByBot)
      adTagged,
      adUniquePerBot: adUniqueCount / botCount,
      adSeenPerBot: adSeenCount / botCount,
    };
  }
}
