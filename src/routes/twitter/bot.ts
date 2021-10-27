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

/**
 * Checking if bots are running (on AWS)
 * 
 * Return example: [
    {
        "instanceId": "i-03e28f160b2cf7515",
        "state": {
            "Code": 16,
            "Name": "running"
        }
    }
]
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const controller = new TwitterBotController();
    res.send(await controller.getBotInstancesStatus());
  } catch (err) {
    console.log("Error", err);
  }
});

/**
 * Start or stop bots
 * 
 * Params:
 *  action (required): "stop" | "start",
 *  id (optional): list of instance ids to apply the action to. If not specified, find all bot instances
 * 
 * Return example: 
 * {
    "success": true,
    "instanceStates": [
        {
            "CurrentState": {
                "Code": 80,
                "Name": "stopped"
            },
            "InstanceId": "i-03e28f160b2cf7515",
            "PreviousState": {
                "Code": 80,
                "Name": "stopped"
            }
        }
    ],
    "errorMessage": "",
    "errorCode": ""
}

{
    "success": false,
    "instanceStates": [],
    "errorCode": "IncorrectInstanceState",
    "errorMessage": "The instance is not in a state from which it can be started. It could be in the process of stopping. Please try again later"
}
 */
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
