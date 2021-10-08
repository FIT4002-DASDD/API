import { googleTagDef } from "../definitions/google/googleTagDef.swagger";

export const tag = {
  "/google/tags": {
    get: {
      tags: ["/google"],
      summary: "Returns tags",
      operationId: "getTags",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: googleTagDef,
          },
        },
      },
    },
    post: {
      tags: ["/google"],
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
          schema: googleTagDef,
        },
      },
    },
  },

  "/google/tags/{id}": {
    get: {
      tags: ["/google"],
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
          schema: googleTagDef,
        },
      },
    },
  },
};
