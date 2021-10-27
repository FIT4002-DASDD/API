import express, { NextFunction, Request, Response } from "express";
import { TwitterBotController } from "~/controllers";
import { ec2Client } from "~/helpers/ec2Client";
import {
  DescribeInstancesCommand,
  Instance,
  StopInstancesCommand,
} from "@aws-sdk/client-ec2";
const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const controller = new TwitterBotController();
  try {
    res.send(await controller.getAll());
  } catch (err) {
    next(err);
  }
});
// Checking if bots are running (on AWS)
router.get("/status", async (req: Request, res: Response) => {
  try {
    const controller = new TwitterBotController();
    res.send(await controller.getBotInstancesStatus());
  } catch (err) {
    console.log("Error", err);
  }
});

// Checking if bots are running (on AWS)
router.get("/manage", async (req: Request, res: Response) => {
  let { action, id } = req.query;
  action = action ? String(action) : "";
  id = typeof id === "string" ? [id] : (id as string[]);
  const controller = new TwitterBotController();
  try {
    const data = await controller.manageBotInstances(action, id);
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log("Error", err);
  }
});

router.get(
  "/:username",
  async (req: Request, res: Response, next: NextFunction) => {
    const controller = new TwitterBotController();
    const { username } = req.params;
    try {
      res.send(await controller.getByUsername(username));
    } catch (err) {
      next(err);
    }
  }
);

export { router as twitterBotRoute };
