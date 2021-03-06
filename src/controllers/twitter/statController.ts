/*
 * Author: Sara Tran, Andy Zhan
 * -----
 * Last Modified: Thursday, 18th November 2021 9:17:19 pm
 * Modified By: Sara Tran
 */

import { getConnection } from "typeorm";
import {
  TwitterAd,
  TwitterAdSeenByBot,
  TwitterAdTag,
  TwitterBot,
} from "~/models";

export class TwitterStatController {
  /**
   * @returns ad statistics based on bot alignments (political ranking)
   */
  async getBotAlignmentStat(): Promise<
    Array<{
      type: "political ranking";
      data: {
        label: string;
        count: string;
      };
    }>
  > {
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

  /**
   * Ad statistics based on their categories/tags.
   *
   * The `label` is the name of a tag and the `count` is how many times that tag has been attached to the ads.
   * @returns ad statistics based on their categories/tags
   */
  async getCategoryStat(): Promise<
    Array<{
      label: string;
      count: string;
    }>
  > {
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

  /**
   * @returns Bot stats grouped by tags of ads that they have seen.
   */
  async getCategoryBotStat(): Promise<
    Array<{
      avgGender: number;
      avgPolitical: number;
      label: string;
    }>
  > {
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

  /**
   * Get daily ad counts in a month from startDate
   */
  async getAdCounts(
    startDate: Date
  ): Promise<
    Array<{
      count: string;
      date: string;
    }>
  > {
    var start = new Date(
      Date.UTC(startDate.getFullYear(), startDate.getMonth(), 1, 0, 0, 0)
    );
    var end = new Date(
      Date.UTC(startDate.getFullYear(), startDate.getMonth() + 1, 0, 0, 0)
    );

    const twitterAdTableName = TwitterAdSeenByBot.getRepository().metadata
      .tableName;
    const rawRes = await getConnection().manager.query(
      `
        SELECT date, count(a."createdAt") AS count
        FROM  generate_series($1::timestamp, $2::timestamp, interval '1 day') g(date)
        LEFT JOIN ${twitterAdTableName} a ON a."createdAt" >= g.date
                        AND a."createdAt"  <  g.date + interval '1 day'
        GROUP  BY 1
        ORDER  BY 1;
      `,
      [start, end]
    );

    return rawRes;
  }

  async getAdStats(): Promise<{
    adUniqueCount: number;
    adSeenCount: number;
    adTagged: number;
    adUniquePerBot: number;
    adSeenPerBot: number;
  }> {
    const adUniqueCount: string = (
      await TwitterAd.createQueryBuilder("ad")
        .select("COUNT(*)", "adCount")
        .getRawOne()
    ).adCount;

    const adSeenCount: string = (
      await TwitterAdSeenByBot.createQueryBuilder("adBot")
        .select("COUNT(*)", "adBot")
        .getRawOne()
    ).adBot;

    const adTagged: string = (
      await TwitterAdTag.createQueryBuilder("adtag")
        .select("COUNT(DISTINCT adtag.adId)", "adTaggedCount")
        .getRawOne()
    ).adTaggedCount;

    const botCount = (await TwitterBot.findAndCount())[1];

    return {
      adUniqueCount: parseFloat(adUniqueCount), // Unique ad count (i.e. # of rows in TwitterAd)
      adSeenCount: parseFloat(adSeenCount), // All instances of ads seen (i.e. # of rows in TwitterAdSeenByBot)
      adTagged: parseFloat(adTagged),
      adUniquePerBot: parseFloat(adUniqueCount) / botCount,
      adSeenPerBot: parseFloat(adSeenCount) / botCount,
    };
  }
}
