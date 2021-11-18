/*
 * Author: Xi Zhang
 * -----
 * Last Modified: Thursday, 18th November 2021 9:22:54 pm
 * Modified By: Sara Tran
 */
import {
  botAlignmentStatDef,
  dataDef,
} from "../definitions/twitter/twitterStatDef.swagger";

export const stat = {
  "/twitter/stats/bot-alignment": {
    get: {
      tags: ["/twitter"],
      summary: "Returns bot alignment stat",
      operationId: "getBotAlignmentStat",
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

  "/twitter/stats/category": {
    get: {
      tags: ["/twitter"],
      summary: "Returns category stat",
      operationId: "getCategoryStat",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: dataDef,
        },
      },
    },
  },

  "/twitter/stats/ad-count": {
    get: {
      tags: ["/twitter"],
      summary: "Returns ad count stat",
      operationId: "getAdCountStat",
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

  "/twitter/stats/ad-stat": {
    get: {
      tags: ["/twitter"],
      summary: "Returns ad  stat",
      operationId: "getAdStat",
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
