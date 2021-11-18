/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:22:04 pm
 * Modified By: Sara Tran
 */
import express from "express";
import { twitterAdRoute } from "./ad";
import { twitterBotRoute } from "./bot";
import { twitterStatRoute } from "./stats";
import { twitterTagRoute } from "./tag";

const router = express.Router();

router.use("/bots", twitterBotRoute);
router.use("/ads", twitterAdRoute);
router.use("/tags", twitterTagRoute);
router.use("/stats", twitterStatRoute);

export { router as twitterRoute };
