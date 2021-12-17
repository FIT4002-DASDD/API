const relevantTag = {
  type: "array",
  items: {
    type: "string",
  },
};
const followedAccount = {
  type: "array",
  items: {
    type: "string",
  },
};
export const twitterBotDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    username: {
      type: "string",
    },
    type: {
      type: "string",
    },
    politicalRanking: {
      type: "integer",
    },
    followedAccounts: followedAccount,
    relevantTags: relevantTag,
    dob: {
      type: "string",
    },
  },
};
