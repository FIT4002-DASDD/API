import express, { NextFunction, Request, Response } from "express";
import { TwitterAdController } from "~/controllers";
import { TwitterAdType } from "~/models/TwitterAd";

const router = express.Router();
const controller = new TwitterAdController();

router.get("/", async (req: Request, res: Response) => {
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
   *
   * TODO: Testing needed to confirm different combinations of query params work
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

  let response;
  if (groupUnique) {
    response = await controller.getAdUniques(queryParams);
  } else {
    response = await controller.getAdInstances(queryParams);
  }
  // Update the response with the Links data
  const metadata = response.metadata;
  const links = metadata.links;

  let originalURL = req.originalUrl;

  // check if the input includes offset and limit
  if (!originalURL.includes("offset=")) {
    if (originalURL[originalURL.indexOf("/ads") + 4] !== "?") {
      originalURL = originalURL + "?offset=0";
    } else {
      originalURL = originalURL + "&offset=0";
    }
  }
  if (!originalURL.includes("limit=")) {
    originalURL = originalURL + "&limit=30";
  }

  // for self link
  links.self = originalURL;
  // for first link
  links.first = originalURL.replace(String(queryParams.offset), "0");
  // for last link
  links.last = originalURL.replace(
    String(queryParams.offset),
    String(
      Math.floor(metadata.total_count / metadata.per_page) * metadata.per_page
    )
  );
  // for next link
  const nextOffset = queryParams.offset + metadata.per_page;
  if (nextOffset < metadata.total_count) {
    links.next = originalURL.replace(
      String(queryParams.offset),
      String(queryParams.offset + metadata.per_page)
    );
  } else {
    links.next = originalURL;
  }
  // for previous link
  const previousOffset = queryParams.offset - metadata.per_page;
  if (previousOffset > 0) {
    links.previous = originalURL.replace(
      String(queryParams.offset),
      String(previousOffset)
    );
  } else {
    links.previous = originalURL;
  }
  console.log(response);
  // Return response
  res.send(response);
  return;
});

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
