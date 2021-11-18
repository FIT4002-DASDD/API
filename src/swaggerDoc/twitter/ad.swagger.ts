/*
 * Author: Xi Zhang
 * -----
 * Last Modified: Thursday, 18th November 2021 9:22:54 pm
 * Modified By: Sara Tran
 */

import { twitterAdDef } from "../definitions/twitter/twitterAdDef.swagger";
import { twitterBotDef } from "../definitions/twitter/twitterBotDef.swagger";
import { twitterTagDef } from "../definitions/twitter/twitterTagDef.swagger";

export const ad = {
  "/twitter/ads": {
    get: {
      tags: ["/twitter"],
      summary: "Returns ads matching query",
      operationId: "getAds",
      produces: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "offset",
          description: "record offset",
          required: false,
          type: "number",
        },
        {
          in: "query",
          name: "limit",
          description: "max number of records to return",
          required: false,
          type: "number",
        },
        {
          in: "query",
          name: "startDate",
          description:
            "Filter ads created after this date. This should be a timestamp in ms",
          required: false,
          type: "number",
        },
        {
          in: "query",
          name: "endDate",
          description:
            "Filter ads created before this date. This should be a timestamp in ms",
          required: false,
          type: "number",
        },
        {
          in: "query",
          name: "adType",
          description: "Filter ads with one or more of the given ad type",
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "political",
          description:
            "Filter ads with one or more of the given bot political rankings",
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "number",
          },
        },
        {
          in: "query",
          name: "tag",
          description: "Filter ads with one or more of the given tag names",
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "number",
          },
        },
        {
          in: "query",
          name: "bots",
          description: "Bots to filter by",
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "botType",
          description: "Filter ads by bot type",
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "botType",
          description: "Filter ads by bot type",
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "string",
          },
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: {
              allOf: [
                twitterAdDef,
                {
                  type: "object",
                  properties: {
                    bot: twitterBotDef,
                    tags: {
                      type: "array",
                      items: twitterTagDef,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },

  "/twitter/ads/{id}": {
    get: {
      tags: ["/twitter"],
      summary: "Returns an ad",
      operationId: "getAdById",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Ad id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: twitterAdDef,
        },
      },
    },
  },
  "/twitter/ads/:id/tags/:tagId": {
    post: {
      tags: ["/twitter"],
      summary: "Attach a tag to an ad",
      operationId: "createAdTag",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Ad id",
          required: true,
          type: "string",
        },
        {
          in: "path",
          name: "tagId",
          description: "Tag id",
          required: true,
          type: "integer",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            allOf: [
              twitterAdDef,
              {
                type: "object",
                properties: {
                  // bot: botDef,
                  tags: {
                    type: "array",
                    items: twitterTagDef,
                  },
                },
              },
            ],
          },
        },
      },
    },

    delete: {
      tags: ["/twitter"],
      summary: "Remove a tag from an ad",
      operationId: "removeAdTag",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Ad id",
          required: true,
          type: "string",
        },
        {
          in: "path",
          name: "tagId",
          description: "Tag id",
          required: true,
          type: "integer",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
        },
      },
    },
  },
};
