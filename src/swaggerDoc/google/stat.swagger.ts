/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:22:40 pm
 * Modified By: Sara Tran
 */
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
          examples: {
            "application/json": [
              {
                type: "political ranking",
                data: [
                  {
                    count: "10",
                    label: "0",
                  },
                  {
                    count: "3",
                    label: "2",
                  },
                  {
                    count: "11",
                    label: "4",
                  },
                ],
              },
              {
                type: "gender",
                data: [
                  {
                    label: "Female",
                    count: "8",
                  },
                  {
                    label: "Male",
                    count: "13",
                  },
                  {
                    label: "Other",
                    count: "1",
                  },
                  {
                    label: "Unknown",
                    count: "2",
                  },
                ],
              },
            ],
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
          examples: {
            "json/application": [
              {
                label: "uncategorised",
                count: "56812",
              },
              {
                label: "entertainment",
                count: "19984",
              },
              {
                label: "fashion",
                count: "20209",
              },
              {
                label: "technology",
                count: "20518",
              },
              {
                label: "sports",
                count: "19780",
              },
            ],
          },
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
          examples: {
            "application/json": [
              {
                date: "2021-10-01T00:00:00.000Z",
                count: "10",
              },
              {
                date: "2021-10-02T00:00:00.000Z",
                count: "3",
              },
              {
                date: "2021-10-02T23:00:00.000Z",
                count: "23",
              },
              {
                date: "2021-10-03T23:00:00.000Z",
                count: "45",
              },
              {
                date: "2021-10-04T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-05T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-06T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-07T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-08T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-09T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-10T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-11T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-12T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-13T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-14T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-15T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-16T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-17T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-18T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-19T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-20T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-21T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-22T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-23T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-24T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-25T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-26T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-27T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-28T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-29T23:00:00.000Z",
                count: "0",
              },
              {
                date: "2021-10-30T23:00:00.000Z",
                count: "0",
              },
            ],
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
          examples: {
            "application/json": {
              adTotal: 137303,
              adTagged: 80491,
              adPerBot: 5720.958333333333,
            },
          },
        },
      },
    },
  },
};
