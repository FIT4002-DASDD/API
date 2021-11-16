import { twitterBotDef } from "../definitions/twitter/twitterBotDef.swagger";

export const bot = {
  "/twitter/bots": {
    get: {
      tags: ["/twitter"],
      summary: "Returns bots matching query",
      operationId: "getBots",
      produces: ["application/json"],
      responses: {
        "200": {
          description: "successful operation",
          schema: {
            type: "array",
            items: twitterBotDef,
          },
        },
      },
    },
  },

  "/twitter/bots/{username}": {
    get: {
      tags: ["/twitter"],
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
          schema: twitterBotDef,
        },
      },
    },
  },
};
