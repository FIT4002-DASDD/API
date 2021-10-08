export const googleBotDef = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    username: {
      type: "string",
    },
    dob: {
      type: "string",
    },
    gender: {
      type: "string",
    },
    lName: {
      type: "string",
    },
    otherTermsCategory: {
      type: "integer",
    },
    password: {
      type: "string",
    },
    locLat: {
      type: "number",
    },
    locLong: {
      type: "number",
    },
    type: {
      type: "string",
    },
    politicalRanking: {
      type: "integer",
    },
  },
};
