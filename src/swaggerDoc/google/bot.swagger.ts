import { googleBotDef } from "../definitions/botDef.swagger";

export const bot = {
  "/google/bots": {
    get: {
      tags: ["/google"],
      summary: "Returns bots matching query",
      operationId: "getBots",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: googleBotDef,
          },
        },
      },
    },
  },

  "/google/bots/{username}": {
    get: {
      tags: ["/google"],
      summary: "Returns a bot",
      operationId: "getBotByUsername",
      produces: ["application/json"],
      parameters: [
        {
          in: "path",
          name: "username",
          description: "Bot username",
          required: true,
          type: "string",
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          schema: googleBotDef,
        },
      },
    },
  },
};
