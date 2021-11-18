/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:21:36 pm
 * Modified By: Sara Tran
 */
import express, { NextFunction, Request, Response } from "express";
import { GoogleBotController } from "~/controllers";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const controller = new GoogleBotController();
  try {
    res.send(await controller.getAll());
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:username",
  async (req: Request, res: Response, next: NextFunction) => {
    const controller = new GoogleBotController();
    const { username } = req.params;
    try {
      res.send(await controller.getByUsername(username));
    } catch (err) {
      next(err);
    }
  }
);

export { router as googleBotRoute };
