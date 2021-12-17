import { twitterBotDef } from "./twitterBotDef.swagger";
import { twitterTagDef } from "./twitterTagDef.swagger";

export const twitterAdDef = {
  type: "object",
  properties: {
    adSeenId: {
      type: "string",
      format: "uuid",
    },
    botId: {
      type: "string",
      format: "uuid",
    },
    createdAt: {
      type: "string",
    },
    promoterHandle: {
      type: "string",
    },
    content: {
      type: "string",
    },
    officialLink: {
      type: "string",
    },
    tweetLink: {
      type: "string",
    },
    image: {
      type: "string",
    },
    adType: {
      type: "string",
    },
  },
};

export const twitterAdUniqueDef = {
  type: "object",
  properties: {
    id: {
      type: "integer",
    },
    tags: {
      type: "array",
      items: twitterTagDef,
    },
    promoterHandle: {
      type: "string",
    },
    content: {
      type: "string",
    },
    officialLink: {
      type: "string",
    },
    tweetLink: {
      type: "string",
    },
    image: {
      type: "string",
    },
    adType: {
      type: "string",
    },
    seenInstances: {
      type: "array",
      items: {
        type: "object",
        properties: {
          adSeenId: {
            type: "integer",
          },
          adId: {
            type: "string",
            format: "uuid",
          },
          botId: {
            type: "string",
            format: "uuid",
          },
          createdAt: {
            type: "string",
          },
          bot: twitterBotDef,
        },
      },
    },
  },
};
