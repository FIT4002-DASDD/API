/*
 * Author: Sara Tran, Andy Zhan
 * -----
 * Last Modified: Thursday, 18th November 2021 9:16:26 pm
 * Modified By: Sara Tran
 */

import { getConnection } from "typeorm";
import { GoogleAd, GoogleAdTag, GoogleBot } from "~/models";

export class GoogleStatController {
  /**
   * @returns ad statistics based on bot alignments (political ranking and gender)
   */
  async getBotAlignmentStat(): Promise<
    Array<{
      type: "political ranking" | "gender";
      data: {
        label: string;
        count: string;
      };
    }>
  > {
    let res: any = [];
    let rawRes = await GoogleBot.createQueryBuilder("bot")
      .select("COUNT(bot.id)", "count")
      .addSelect("CAST(bot.politicalRanking AS char)", "label")
      .groupBy("bot.politicalRanking")
      .orderBy("bot.politicalRanking")
      .getRawMany();
    res.push({
      type: "political ranking",
      data: rawRes,
    });

    rawRes = await GoogleBot.createQueryBuilder("bot")
      .select("COUNT(bot.id)", "count")
      .addSelect("bot.gender", "label")
      .groupBy("bot.gender")
      .orderBy("bot.gender")
      .getRawMany();

    res.push({
      type: "gender",
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
    let rawRes = await GoogleAd.createQueryBuilder("ad")
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
    let rawRes = await GoogleAd.createQueryBuilder("ad")
      .leftJoin("ad.adTags", "adTags")
      .leftJoin("adTags.tag", "tag")
      .leftJoin("ad.bot", "bot")
      .select(
        `SUM(CASE
        WHEN bot.gender = 'Male' THEN 1
        WHEN bot.gender = 'Female' THEN 0
        ELSE 0.5 END)/COUNT(ad.id)`,
        "avgGender"
      )
      .addSelect("AVG(bot.politicalRanking)", "avgPolitical")
      .addSelect("tag.name", "label")
      .groupBy("tag.name")
      .getRawMany();
    rawRes.forEach((e) => {
      if (e.label === null) {
        e.label = "uncategorised";
      }
      e.avgGender = parseFloat(e.avgGender);
      e.avgPolitical = parseFloat(e.avgPolitical);
    });
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
    const googleAdTableName = GoogleAd.getRepository().metadata.tableName;
    const rawRes = await getConnection().manager.query(
      `
        SELECT date, count(a."createdAt") AS count
        FROM  generate_series($1::timestamp, $2::timestamp, interval '1 day') g(date)
        LEFT JOIN ${googleAdTableName} a ON a."createdAt" >= g.date
                        AND a."createdAt"  <  g.date + interval '1 day'
        GROUP  BY 1
        ORDER  BY 1;
      `,
      [start, end]
    );

    return rawRes;
  }

  async getAdStats(): Promise<{
    adPerBot: number;
    adTagged: number;
    adTotal: number;
  }> {
    const adTotal: string = (
      await GoogleAd.createQueryBuilder("ad")
        .select("COUNT(*)", "adCount")
        .getRawOne()
    ).adCount;
    const adTagged: string = (
      await GoogleAdTag.createQueryBuilder("adtag")
        .select("COUNT(DISTINCT adtag.adId)", "adTaggedCount")
        .getRawOne()
    ).adTaggedCount;
    const botCount = (await GoogleBot.findAndCount())[1];

    return {
      adTotal: parseFloat(adTotal),
      adTagged: parseFloat(adTagged),
      adPerBot: parseFloat(adTotal) / botCount,
    };
  }
}
