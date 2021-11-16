const relevantTag = {
    type: "string",
}
const followedAccount = {
    type: "string",
}
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
      followedAccounts: [
        followedAccount,
      ],
      relevantTags: [
        relevantTag,
      ],
      dob: {
        type: "string",
      },
    },
  };
  