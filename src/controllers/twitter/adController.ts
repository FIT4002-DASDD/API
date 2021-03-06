/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:16:59 pm
 * Modified By: Sara Tran
 */
import { DeleteResult, FindManyOptions, In } from "typeorm";
import { TwitterAd, TwitterAdSeenByBot, TwitterAdTag } from "~/models";
import { PaginationParams, TwitterAdFilterParams } from "~/typings/global";

export class TwitterAdController {
  /**
   * Get many Twitter Ad instances based on queryParams. An instance is defined as when an ad was seen by a bot, regardless if that ad has been seen before.
   *
   * The filtering for TwitterAdFilterParams works as followed.
   * Different parameters are joined together with OR's while values of the same parameters are joined by AND's.
   * For example if the supplied parameters are:
   * ```
   * {bots:["bot1", "bot2"], startDate:"2020-11-09T23:50:56"}
   * ```
   * Then the filter logic will be `(bot="bot1" OR bot="bot2") AND startDate="2020-11-09T23:50:56"`
   * @param queryParams
   * @returns a collection of Twitter Ad instances, the total count (in the database) and the returned count
   */
  async getAdInstances(
    queryParams: PaginationParams & TwitterAdFilterParams
  ): Promise<{ totalCount: number; recordCount: number; records: any[] }> {
    const {
      limit,
      offset,
      tag,
      political,
      bots,
      botType,
      startDate,
      endDate,
      adType,
    } = queryParams;
    const politicalInt = political?.map((e) => parseInt(e));

    let findOptions: FindManyOptions = {
      take: limit ? limit : 30,
      skip: offset ? offset : 0,
      select: ["adSeenId", "createdAt"],
      join: {
        alias: "adBot",
        leftJoin: {
          bot: "adBot.bot",
          ad: "adBot.ad",
          adTags: "ad.adTags",
          tags: "adTags.tag",
        },
      },
      order: {
        createdAt: "DESC",
      },
    };

    // Workaround for finding entity with relation condition: https://github.com/typeorm/typeorm/issues/4396#issuecomment-566254087
    const whereConditions: any[][] = [];

    if (tag) {
      whereConditions.push(["tags.name ILIKE ANY(:tag)", { tag }]);
    }

    if (political) {
      whereConditions.push([
        "bot.politicalRanking = ANY(:political)",
        { political: politicalInt },
      ]);
    }

    if (bots) {
      whereConditions.push(["bot.id = ANY(:bots)", { bots }]);
    }

    if (botType) {
      whereConditions.push([
        "LOWER(bot.type::text) = ANY(:botType)",
        { botType: botType.map((e) => e.toLowerCase()) },
      ]);
    }

    if (startDate) {
      whereConditions.push(["adBot.createdAt >= :startDate", { startDate }]);
    }

    if (endDate) {
      whereConditions.push(["adBot.createdAt <= :endDate", { endDate }]);
    }

    if (adType) {
      whereConditions.push(["ad.adType = ANY(:adType)", { adType }]);
    }

    if (whereConditions.length > 0) {
      findOptions.where = (qb: any) => {
        for (let i = 0; i < whereConditions.length; i++) {
          if (i == 0) {
            qb.where(whereConditions[i][0], whereConditions[i][1]);
          } else {
            qb.andWhere(whereConditions[i][0], whereConditions[i][1]);
          }
        }
      };
    }

    // get ad ids that fit the options
    const adIds = (await TwitterAdSeenByBot.find(findOptions)).map(
      (e: TwitterAdSeenByBot) => e.adSeenId
    );
    const filteredAdNumber = adIds.length;

    const ads = await TwitterAdSeenByBot.find({
      relations: ["bot", "ad", "ad.adTags", "ad.adTags.tag"],
      where: {
        adSeenId: In(adIds),
      },
    });

    delete findOptions.take;
    delete findOptions.skip;

    const totalAdNumber = await TwitterAdSeenByBot.count(findOptions);

    // get ads with the required relations and data
    return {
      totalCount: totalAdNumber,
      recordCount: filteredAdNumber,
      records: ads,
    };
  }

  /**
   * Get many unique Twitter Ads based on queryParams.
   *
   * The filtering for TwitterAdFilterParams works as followed.
   * Different parameters are joined together with OR's while values of the same parameters are joined by AND's.
   * For example if the supplied parameters are:
   * ```
   * {bots:["bot1", "bot2"], startDate:"2020-11-09T23:50:56"}
   * ```
   * Then the filter logic will be `(bot="bot1" OR bot="bot2") AND startDate="2020-11-09T23:50:56"`
   * @param queryParams
   * @returns a collection of unique Twitter Ads, the total count (in the database) and the returned count
   */
  async getAdUniques(
    queryParams: PaginationParams & TwitterAdFilterParams
  ): Promise<{ totalCount: number; recordCount: number; records: any[] }> {
    const {
      limit,
      offset,
      tag,
      political,
      bots,
      botType,
      startDate,
      endDate,
      adType,
    } = queryParams;
    const politicalInt = political?.map((e) => parseInt(e));

    let findOptions: FindManyOptions = {
      take: limit ? limit : 30,
      skip: offset ? offset : 0,
      select: ["id"],
      join: {
        alias: "ad",
        leftJoin: {
          adBot: "ad.adBot",
          bot: "adBot.bot",
          adTags: "ad.adTags",
          tags: "adTags.tag",
        },
      },
      order: {
        id: "DESC",
      },
    };

    // Workaround for finding entity with relation condition: https://github.com/typeorm/typeorm/issues/4396#issuecomment-566254087

    const whereConditions: any[][] = [];

    if (tag) {
      whereConditions.push(["tags.name ILIKE ANY(:tag)", { tag }]);
    }

    if (political) {
      whereConditions.push([
        "bot.politicalRanking = ANY(:political)",
        { political: politicalInt },
      ]);
    }

    if (bots) {
      whereConditions.push(["bot.id = ANY(:bots)", { bots }]);
    }

    if (botType) {
      whereConditions.push([
        "LOWER(bot.type::text) = ANY(:botType)",
        { botType: botType.map((e) => e.toLowerCase()) },
      ]);
    }

    if (startDate) {
      whereConditions.push(["adBot.createdAt >= :startDate", { startDate }]);
    }

    if (endDate) {
      whereConditions.push(["adBot.createdAt <= :endDate", { endDate }]);
    }

    if (adType) {
      whereConditions.push(["ad.adType = ANY(:adType)", { adType }]);
    }

    if (whereConditions.length > 0) {
      findOptions.where = (qb: any) => {
        for (let i = 0; i < whereConditions.length; i++) {
          if (i == 0) {
            qb.where(whereConditions[i][0], whereConditions[i][1]);
          } else {
            qb.andWhere(whereConditions[i][0], whereConditions[i][1]);
          }
        }
      };
    }

    // get ad ids that fit the options
    const adIds = (await TwitterAd.find(findOptions)).map(
      (e: TwitterAd) => e.id
    );

    const filteredAdNumber = adIds.length;

    const ads: any[] = await TwitterAd.find({
      relations: ["adBot", "adBot.bot", "adTags", "adTags.tag"],
      where: {
        id: In(adIds),
      },
    });
    ads.map((e): any => {
      e.seenInstances = e.adBot;
      delete e.adBot;
    });

    delete findOptions.take;
    delete findOptions.skip;

    const totalAdNumber = await TwitterAd.count(findOptions);

    // get ads with the required relations and data
    return {
      totalCount: totalAdNumber,
      recordCount: filteredAdNumber,
      records: ads,
    };
  }

  async getById(id: string): Promise<TwitterAd> {
    let ad: any = await TwitterAd.findOneOrFail({
      relations: ["adBot", "adBot.bot", "adTags", "adTags.tag"],
      where: {
        id,
      },
    });
    ad.seenInstances = ad.adBot;
    delete ad.adBot;
    return ad;
  }

  /**
   * Attach a Tag to an Ad
   *
   * This essentially creates a new TwitterAdTag that links the specified Tag and Ad together.
   * @param adId
   * @param tagId
   * @returns
   */
  async addTagToAd(adId: string, tagId: number): Promise<TwitterAdTag> {
    const newAdTag = TwitterAdTag.create({
      adId,
      tagId,
    });
    return await TwitterAdTag.save(newAdTag);
  }

  /**
   * Remove a Tag from an Ad.
   *
   * This essentially deletes a TwitterAdTag row and does not delete any Tag or Ad row.
   * @param adId
   * @param tagId
   * @returns
   */
  async deleteTagFromAd(adId: string, tagId: number): Promise<DeleteResult> {
    const adTagToDelete = TwitterAdTag.create({
      adId,
      tagId,
    });
    return await TwitterAdTag.delete(adTagToDelete);
  }
}
