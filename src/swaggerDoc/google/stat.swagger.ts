import {
  botAlignmentStatDef,
  dataDef,
} from "../definitions/google/googleStatDef.swagger";

export const stat = {
  "/google/stats/bot-alignment": {
    get: {
      tags: ["/google"],
      summary: "Returns bot alignment stat",
      operationId: "getGoogleBotAlignmentStat",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: botAlignmentStatDef,
          },
        },
      },
    },
  },

  "/google/stats/category": {
    get: {
      tags: ["/google"],
      summary: "Returns category stat",
      operationId: "getGoogleCategoryStat",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: dataDef,
        },
      },
    },
  },

  "/google/stats/ad-count": {
    get: {
      tags: ["/google"],
      summary: "Returns ad count stat",
      operationId: "getGoogleAdCountStat",
      produces: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "startDate",
          description: "Start date to get ad count. Default to current date",
          required: false,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                count: {
                  type: "integer",
                },
                date: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },

  "/google/stats/ad-stat": {
    get: {
      tags: ["/google"],
      summary: "Returns ad  stat",
      operationId: "getGoogleAdStat",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "object",
            properties: {
              adTotal: {
                type: "integer",
              },
              adTagged: {
                type: "integer",
              },
              adPerBot: {
                type: "integer",
              },
            },
          },
        },
      },
    },
  },
};
