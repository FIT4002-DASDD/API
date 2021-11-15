import { twitterTagDef } from "../definitions/twitter/twitterTagDef.swagger";

export const tag = {
  "/twitter/tags": {
    get: {
      tags: ["/twitter"],
      summary: "Returns tags",
      operationId: "getTags",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: twitterTagDef,
          },
        },
      },
    },
    post: {
      tags: ["/twitter"],
      summary: "Create new tag",
      operationId: "createTag",
      produces: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "name",
          description: "tag name",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: twitterTagDef,
        },
      },
    },
  },

  "/twitter/tags/{id}": {
    get: {
      tags: ["/twitter"],
      summary: "Returns a tag",
      operationId: "getTagById",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "id",
          description: "Tag id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: twitterTagDef,
        },
      },
    },
  },
};
