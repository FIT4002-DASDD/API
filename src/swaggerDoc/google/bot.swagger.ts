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
            items: {
              schema: { $ref: "#/definitions/GoogleBot" },
            },
          },
          examples: {
            "application/json": [
              {
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
              {
                id: "22b052aa-9f17-4bbc-aed7-50e3f5701519",
                username: "Phillipfranko44",
                dob: "1995-01-14T02:00:00.000Z",
                gender: "Unknown",
                fName: "Phillip",
                lName: "Franco",
                otherTermsCategory: 4,
                password: "Pf1234()",
                locLat: 35.941772,
                locLong: -97.256474,
                type: "google",
                politicalRanking: 4,
              },
            ],
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
          schema: { $ref: "#/definitions/GoogleBot" },
          examples: {
            "application/json": {
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
          },
        },
      },
    },
  },
};
