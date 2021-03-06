/*
 * Author: Sara Tran, Xi Zhang
 * -----
 * Last Modified: Thursday, 18th November 2021 9:22:54 pm
 * Modified By: Sara Tran
 */
import { googleAdDef } from "./definitions/google/googleAdDef.swagger";
import { googleBotDef } from "./definitions/google/googleBotDef.swagger";
import { googleTagDef } from "./definitions/google/googleTagDef.swagger";
import { twitterAdDef } from "./definitions/twitter/twitterAdDef.swagger";
import { twitterBotDef } from "./definitions/twitter/twitterBotDef.swagger";
import { twitterTagDef } from "./definitions/twitter/twitterTagDef.swagger";
import { googleSwagger } from "./google";
import { twitterSwagger } from "./twitter";
const env = process.env;

// googleSwagger.reduce((ac, cv)=> {return {...ac, ...cv}})

export const swaggerDocument = {
  swagger: "2.0",
  info: {
    description:
      " This is the api documentation for the Monash Dark Ads Scraping Dashboard",
    version: "1.0.0",
    title: "Monash Dark Ads Scraping",
  },
  basePath:
    env.NODE_ENV === "prod" || env.NODE_ENV === "production" ? "/api" : "/",
  tags: [
    {
      name: "/google",
    },
    {
      name: "/twitter",
    },
  ],
  schemes: ["http"],
  paths: {
    ...googleSwagger,
    ...twitterSwagger,
  },
  definitions: {
    GoogleAd: googleAdDef,
    GoogleBot: googleBotDef,
    GoogleTag: googleTagDef,
    TwitterAd: twitterAdDef,
    TwitterBot: twitterBotDef,
    TwitterTag: twitterTagDef,
  },
};
