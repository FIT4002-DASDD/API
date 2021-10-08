export const googleAdDef = {
  type: "object",
  properties: {
    id: {
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
    headline: {
      type: "string",
    },
    html: {
      type: "string",
    },
    adLink: {
      type: "string",
    },
    loggedIn: {
      type: "boolean",
    },
    seenOn: {
      type: "integer",
    },
  },
};
