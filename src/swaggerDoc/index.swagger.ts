import { googleAdDef } from "./definitions/google/googleAdDef.swagger";
import { googleBotDef } from "./definitions/google/googleBotDef.swagger";
import { googleTagDef } from "./definitions/google/googleTagDef.swagger";
import { googleSwagger } from "./google";
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
    // {
    //   name: "google/ad",
    // },
    // {
    //   name: "google/bot",
    // },
    // {
    //   name: "google/statistics",
    // },
    // {
    //   name: "google/tag",
    // },
    {
      name: "/google",
    },
  ],
  schemes: ["http"],
  paths: {
    ...googleSwagger,
  },
  definitions: {
    GoogleAd: googleAdDef,
    GoogleBot: googleBotDef,
    GoogleTag: googleTagDef,
  },
};
