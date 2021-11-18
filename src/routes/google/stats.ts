/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:21:40 pm
 * Modified By: Sara Tran
 */
import express, { NextFunction, Request, Response } from "express";
import { GoogleStatController } from "~/controllers/index";

const router = express.Router();
const controller = new GoogleStatController();

router.get(
  "/bot-alignment",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(await controller.getBotAlignmentStat());
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/category",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(await controller.getCategoryStat());
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/category-bot",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(await controller.getCategoryBotStat());
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/ad-count",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startDate = req.query.startDate
        ? new Date(parseInt(req.query.startDate as string))
        : new Date();
      res.send(await controller.getAdCounts(startDate));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * example return:
 * {"adTotal":137303,"adTagged":80492,"adPerBot":5720.958333333333}
 */
router.get(
  "/ad-stat",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(await controller.getAdStats());
    } catch (e) {
      next(e);
    }
  }
);
export { router as googleStatRoute };
