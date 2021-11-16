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