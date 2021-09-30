import express, { NextFunction, Request, Response } from "express";
import { GoogleAdController } from "~/controllers/google/adController";
import paginate from "~/helpers/paginate";

const router = express.Router();
const controller = new GoogleAdController();

router.get(
  "/",
  paginate.middleware(30, 100),
  async (req: Request, res: Response) => {
    let {
      offset,
      limit,
      political,
      gender,
      tag,
      bots,
      startDate,
      endDate,
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
      gender: typeof gender === "string" ? [gender] : (gender as string[]),
      tag: typeof tag === "string" ? [tag] : (tag as string[]),
      bots: typeof bots === "string" ? [bots] : (bots as string[]),
      startDate:
        typeof startDate === "string"
          ? new Date(parseInt(startDate as string))
          : null,
      endDate:
        typeof endDate === "string"
          ? new Date(parseInt(endDate as string))
          : null,
    };

    // Invalid negative offset and limit, return a blank array
    if (queryParams.offset < 0 || queryParams.limit < 0) {
      res.send([]);
      return;
    }

    // Update the response with the Links data
    const { records, totalCount, recordCount } = await controller.getAll(
      queryParams
    );

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

export { router as googleAdRoute };
