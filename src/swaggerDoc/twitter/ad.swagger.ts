/*
 * Author: Xi Zhang
 * -----
 * Last Modified: Thursday, 18th November 2021 9:22:54 pm
 * Modified By: Sara Tran
 */

import { paginationMetadataDef } from "../definitions/paginationMetadataDef.swagger";
import {
  twitterAdDef,
  twitterAdUniqueDef,
} from "../definitions/twitter/twitterAdDef.swagger";
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
          description: `Filter ads with one or more of the given ad types.
          Valid values: AD_TYPE_UNSPECIFIED, AD_TYPE_TWEET, AD_TYPE_FOLLOW
          `,
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
          description: `Filter ads with one or more of the given bot political rankings
          Valid values: 0, 1, 2, 3, 4
          LEFT = 0,
          CENTRE_LEFT = 1,
          CENTRE = 2,
          CENTRE_RIGHT = 3,
          RIGHT = 4,
          `,
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "number",
          },
        },
        {
          in: "query",
          name: "gender",
          description:
            "Filter ads with one or more of the given bot genders. Valid values = {female, male}",
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "string",
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
          description:
            "Bot ids to filter by e.g. f7bd2258-a38e-4388-b05e-27c6c89956f6",
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
          description: `Filter ads by bot type (political region).
          Valid values: america, australia, unspecified`,
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
            type: "object",
            properties: {
              metadata: paginationMetadataDef,
              records: {
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
    },
  },
  "/twitter/ads?groupUnique=true": {
    get: {
      tags: ["/twitter"],
      summary:
        "Returns ads matching query. Each ad is unique and can be seen multiple times by multiple bots",
      operationId: "getAdsUnique",
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
          description: `Filter ads with one or more of the given ad types.
          Valid values: AD_TYPE_UNSPECIFIED, AD_TYPE_TWEET, AD_TYPE_FOLLOW
          `,
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
          description: `Filter ads with one or more of the given bot political rankings
          Valid values: 0, 1, 2, 3, 4
          LEFT = 0,
          CENTRE_LEFT = 1,
          CENTRE = 2,
          CENTRE_RIGHT = 3,
          RIGHT = 4,
          `,
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "number",
          },
        },
        {
          in: "query",
          name: "gender",
          description:
            "Filter ads with one or more of the given bot genders. Valid values = {female, male}",
          required: false,
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "string",
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
          description:
            "Bot ids to filter by e.g. f7bd2258-a38e-4388-b05e-27c6c89956f6",
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
          description: `Filter ads by bot type (political region).
          Valid values: america, australia, unspecified`,
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
            type: "object",
            properties: {
              metadata: paginationMetadataDef,
              records: {
                type: "array",
                items: {
                  ...twitterAdUniqueDef,
                },
              },
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
