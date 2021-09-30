import { DeleteResult, FindManyOptions, In } from "typeorm";
import { GoogleAd, GoogleAdTag } from "~/models";
import { GoogleAdFilterParams, PaginationParams } from "~/typings/global";

export class GoogleAdController {
  /**
   * Get many Google Ads based on queryParams.
   *
   * The filtering for GoogleAdFilterParams works as followed.
   * Different parameters are joined together with OR's while values of the same parameters are joined by AND's.
   * For example if the supplied parameters are:
   * ```
   * {bots:["bot1", "bot2"], gender:["female", "male"], startDate:"2020-11-09T23:50:56"}
   * ```
   * Then the filter logic will be `(bot="bot1" OR bot="bot2") AND (gender="female" OR gender="male") AND startDate="2020-11-09T23:50:56"`
   * @param queryParams
   * @returns a collection of Google Ads, the total count (in the database) and the returned count
   */
  async getAll(
    queryParams: PaginationParams & GoogleAdFilterParams
  ): Promise<{ totalCount: number; recordCount: number; records: GoogleAd[] }> {
    const {
      limit,
      offset,
      gender,
      tag,
      political,
      bots,
      startDate,
      endDate,
    } = queryParams;
    const politicalInt = political?.map((e) => parseInt(e));
    let findOptions: FindManyOptions = {
      take: limit ? limit : 30,
      skip: offset ? offset : 0,
      select: ["id", "createdAt"],
      join: {
        alias: "ad",
        leftJoin: {
          adTags: "ad.adTags",
          tags: "adTags.tag",
          bot: "ad.bot",
        },
      },
      order: {
        createdAt: "DESC",
      },
    };

    // Workaround for finding entity with relation condition: https://github.com/typeorm/typeorm/issues/4396#issuecomment-566254087

    /**
     * All WHERE conditions to filter ads in the database
     *
     * Notes:
     * - Tight connescence with SQL, more specifically POSTGRES, syntax and functions
     * - Tight connescence with the table alias used in findOptions
     * - Each condition / element in whereConditions is joined together using an AND
     */
    const whereConditions: any[][] = [];
    if (gender) {
      whereConditions.push(["bot.gender ILIKE ANY(:gender)", { gender }]);
    }

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

    if (startDate) {
      whereConditions.push(["ad.createdAt >= :startDate", { startDate }]);
    }

    if (endDate) {
      whereConditions.push(["ad.createdAt <= :endDate", { endDate }]);
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
    const adIds = (await GoogleAd.find(findOptions)).map((e) => e.id);

    const filteredAdNumber = adIds.length;

    const ads = await GoogleAd.find({
      relations: ["bot", "adTags", "adTags.tag"],
      where: {
        id: In(adIds),
      },
    });

    delete findOptions.take;
    delete findOptions.skip;

    const totalAdNumber = await GoogleAd.count(findOptions);

    // get ads with the required relations and data
    return {
      records: ads,
      totalCount: totalAdNumber,
      recordCount: filteredAdNumber,
    };
  }

  async getById(id: string): Promise<GoogleAd> {
    return await GoogleAd.findOneOrFail({
      where: { id },
      relations: ["adTags", "adTags.tag"],
    });
  }

  /**
   * Attach a Tag to an Ad
   *
   * This essentially creates a new GoogleAdTag that links the specified Tag and Ad together.
   * @param adId
   * @param tagId
   * @returns
   */
  async addTagToAd(adId: string, tagId: number): Promise<GoogleAdTag> {
    const newAdTag = GoogleAdTag.create({
      adId,
      tagId,
    });
    return await GoogleAdTag.save(newAdTag);
  }

  /**
   * Remove a Tag from an Ad.
   *
   * This essentially deletes a GoogleAdTag row and does not delete any Tag or Ad row.
   * @param adId
   * @param tagId
   * @returns
   */
  async deleteTagFromAd(adId: string, tagId: number): Promise<DeleteResult> {
    const adTagToDelete = GoogleAdTag.create({
      adId,
      tagId,
    });
    return await GoogleAdTag.delete(adTagToDelete);
  }
}
