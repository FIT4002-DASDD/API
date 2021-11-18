/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:22:26 pm
 * Modified By: Sara Tran
 */
import { paginationMetadataDef } from "../definitions/paginationMetadataDef.swagger";

export const ad = {
  "/google/ads": {
    get: {
      tags: ["/google"],
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
          name: "gender",
          description: "Filter ads with one or more of the given bot genders",
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
          description: "Bots to filter by",
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
                    { $ref: "#/definitions/GoogleAd" },
                    {
                      type: "object",
                      properties: {
                        bot: {
                          $ref: "#/definitions/GoogleBot",
                        },
                        tags: {
                          type: "array",
                          items: {
                            $ref: "#/definitions/GoogleTag",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          examples: {
            "application/json": {
              metadata: {
                page: 0,
                per_page: 30,
                page_count: 30,
                total_count: 137303,
                links: {
                  self: "/google/ads?offset=0&limit=30",
                  next: "/google/ads?offset=30&limit=30",
                  previous: "/google/ads?offset=0&limit=30",
                  first: "/google/ads?offset=0&limit=30",
                  last: "/google/ads?offset=137280&limit=30",
                },
              },
              records: [
                {
                  id: "03984eea-65b0-4123-b0c0-bcc743095761",
                  botId: "f7bd2258-a38e-4388-b05e-27c6c89956f6",
                  createdAt: "2020-11-27T03:14:25.000Z",
                  image:
                    "https://dasdd-core-stack-dasddadimages-qdzmhix51zg8.s3.amazonaws.com/1606446865145_ad.png",
                  headline:
                    "ad.doubleclick.net/ddm/trackclk/N1142107.1434WASHINGTONPOSTDIGIT/B24115075.284807769",
                  html: "innerHTML",
                  adLink:
                    "ad.doubleclick.net/ddm/trackclk/N1142107.1434WASHINGTONPOSTDIGIT/B24115075.284807769",
                  loggedIn: false,
                  seenOn:
                    "https://www.washingtonpost.com/world/2020/09/21/trump-patriotic-education-china-orban/",
                  bot: {
                    id: "f7bd2258-a38e-4388-b05e-27c6c89956f6",
                    username: "damiandarsey",
                    dob: "1985-04-20T04:00:00.000Z",
                    gender: "Male",
                    fName: "Damian",
                    lName: "DArcey",
                    otherTermsCategory: 5,
                    password: "k3sDApFb6gKFsGK",
                    locLat: 33.4484,
                    locLong: -112.074,
                    type: "google",
                    politicalRanking: 4,
                  },
                  tags: [
                    {
                      id: 1,
                      name: "Technology",
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },

  "/google/ads/{id}": {
    get: {
      tags: ["/google"],
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
          schema: {
            allOf: [
              { $ref: "#/definitions/GoogleAd" },
              {
                type: "object",
                properties: {
                  bot: { $ref: "#/definitions/GoogleBot" },
                  tags: {
                    type: "array",
                    items: { $ref: "#/definitions/GoogleTag" },
                  },
                },
              },
            ],
          },
          examples: {
            "application/json": {
              id: "03984eea-65b0-4123-b0c0-bcc743095761",
              botId: "f7bd2258-a38e-4388-b05e-27c6c89956f6",
              createdAt: "2020-11-27T03:14:25.000Z",
              image:
                "https://dasdd-core-stack-dasddadimages-qdzmhix51zg8.s3.amazonaws.com/1606446865145_ad.png",
              headline:
                "ad.doubleclick.net/ddm/trackclk/N1142107.1434WASHINGTONPOSTDIGIT/B24115075.284807769",
              html: "innerHTML",
              adLink:
                "ad.doubleclick.net/ddm/trackclk/N1142107.1434WASHINGTONPOSTDIGIT/B24115075.284807769",
              loggedIn: false,
              seenOn:
                "https://www.washingtonpost.com/world/2020/09/21/trump-patriotic-education-china-orban/",
              bot: {
                id: "f7bd2258-a38e-4388-b05e-27c6c89956f6",
                username: "damiandarsey",
                dob: "1985-04-20T04:00:00.000Z",
                gender: "Male",
                fName: "Damian",
                lName: "DArcey",
                otherTermsCategory: 5,
                password: "k3sDApFb6gKFsGK",
                locLat: 33.4484,
                locLong: -112.074,
                type: "google",
                politicalRanking: 4,
              },
              tags: [
                {
                  id: 1,
                  name: "Technology",
                },
              ],
            },
          },
        },
      },
    },
  },
  "/google/ads/:id/tags/:tagId": {
    post: {
      tags: ["/google"],
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
              { $ref: "#/definitions/GoogleAd" },
              {
                type: "object",
                properties: {
                  bot: { $ref: "#/definitions/GoogleBot" },
                  tags: {
                    type: "array",
                    items: { $ref: "#/definitions/GoogleTag" },
                  },
                },
              },
            ],
          },
          examples: {
            "application/json": {
              id: "03984eea-65b0-4123-b0c0-bcc743095761",
              botId: "f7bd2258-a38e-4388-b05e-27c6c89956f6",
              createdAt: "2020-11-27T03:14:25.000Z",
              image:
                "https://dasdd-core-stack-dasddadimages-qdzmhix51zg8.s3.amazonaws.com/1606446865145_ad.png",
              headline:
                "ad.doubleclick.net/ddm/trackclk/N1142107.1434WASHINGTONPOSTDIGIT/B24115075.284807769",
              html: "innerHTML",
              adLink:
                "ad.doubleclick.net/ddm/trackclk/N1142107.1434WASHINGTONPOSTDIGIT/B24115075.284807769",
              loggedIn: false,
              seenOn:
                "https://www.washingtonpost.com/world/2020/09/21/trump-patriotic-education-china-orban/",
              bot: {
                id: "f7bd2258-a38e-4388-b05e-27c6c89956f6",
                username: "damiandarsey",
                dob: "1985-04-20T04:00:00.000Z",
                gender: "Male",
                fName: "Damian",
                lName: "DArcey",
                otherTermsCategory: 5,
                password: "k3sDApFb6gKFsGK",
                locLat: 33.4484,
                locLong: -112.074,
                type: "google",
                politicalRanking: 4,
              },
              tags: [
                {
                  id: 1,
                  name: "Technology",
                },
              ],
            },
          },
        },
      },
    },

    delete: {
      tags: ["/google"],
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
