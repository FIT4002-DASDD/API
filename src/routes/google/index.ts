/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:21:38 pm
 * Modified By: Sara Tran
 */
import express from "express";
import { googleAdRoute } from "./ad";
import { googleBotRoute } from "./bot";
import { googleStatRoute } from "./stats";
import { googleTagRoute } from "./tag";

const router = express.Router();

router.use("/bots", googleBotRoute);
router.use("/ads", googleAdRoute);
router.use("/tags", googleTagRoute);
router.use("/stats", googleStatRoute);

export { router as googleRoute };
