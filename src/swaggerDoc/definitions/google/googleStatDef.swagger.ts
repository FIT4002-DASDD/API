export const dataDef = {
  type: "object",
  properties: {
    count: {
      type: "integer",
      example: 12,
    },
    label: {
      type: "string",
      example: "female",
    },
  },
};

export const botAlignmentStatDef = {
  type: "object",
  properties: {
    type: {
      type: "string",
      example: "gender",
    },
    data: dataDef,
  },
};
