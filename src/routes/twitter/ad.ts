import express, { NextFunction, Request, Response } from "express";
import { TwitterAdController } from "~/controllers";
import paginate from "~/helpers/paginate";

const router = express.Router();
const controller = new TwitterAdController();

router.get(
  "/",
  paginate.middleware(30, 100),
  async (req: Request, res: Response) => {
    let {
      offset,
      limit,
      political,
      tag,
      bots,
      botType,
      startDate,
      endDate,
      groupUnique,
      adType,
    } = req.query;
    /**
     * Input validation
     * TODO: possible refactoring using express-validator?
     */
    const queryParams = {
      offset: offset ? parseInt(offset as string) : 0, // page offset
      limit: limit ? parseInt(limit as string) : 30, // number of items in response
      political:
        typeof political === "string" ? [political] : (political as string[]),
      tag: typeof tag === "string" ? [tag] : (tag as string[]),
      bots: typeof bots === "string" ? [bots] : (bots as string[]),
      botType: typeof botType === "string" ? [botType] : (botType as string[]),
      startDate:
        typeof startDate === "string"
          ? new Date(parseInt(startDate as string))
          : null,
      endDate:
        typeof endDate === "string"
          ? new Date(parseInt(endDate as string))
          : null,
      groupUnique: groupUnique === "true" ? true : false,
      adType: typeof adType === "string" ? [adType] : (adType as string[]),
    };

    // Invalid negative offset and limit, return a blank array
    if (queryParams.offset < 0 || queryParams.limit < 0) {
      res.send([]);
      return;
    }

    let records, totalCount, recordCount;
    if (groupUnique) {
      ({ records, totalCount, recordCount } = await controller.getAdUniques(
        queryParams
      ));
    } else {
      ({ records, totalCount, recordCount } = await controller.getAdInstances(
        queryParams
      ));
    }

    const metadata = paginate.getMetadata(
      req,
      queryParams.offset,
      queryParams.limit,
      totalCount,
      recordCount
    );

    // Return response
    res.send({
      metadata,
      records,
    });
    return;
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    res.send(await controller.getById(id));
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/tags/:tagId",
  async (req: Request, res: Response, next: NextFunction) => {
    let { id, tagId } = req.params;
    try {
      await controller.addTagToAd(id, parseInt(tagId));
      res.send(await controller.getById(id));
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id/tags/:tagId",
  async (req: Request, res: Response, next: NextFunction) => {
    let { id, tagId } = req.params;
    try {
      await controller.deleteTagFromAd(id, parseInt(tagId));
      res.send(await controller.getById(id));
    } catch (err) {
      next(err);
    }
  }
);

export { router as twitterAdRoute };
