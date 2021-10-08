import { googleBotDef } from "../definitions/google/googleBotDef.swagger";

export const bot = {
  "/google/bots": {
    get: {
      tags: ["/google"],
      summary: "Returns bots matching query",
      operationId: "getGoogleBots",
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
      operationId: "getGoogleBotByUsername",
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
