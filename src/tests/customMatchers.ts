expect.extend({
  toBeTypeOrNull(received, classTypeOrNull) {
    try {
      expect(received).toEqual(expect.any(classTypeOrNull));
      return {
        message: () => `Ok`,
        pass: true,
      };
    } catch (error) {
      return received === null
        ? {
            message: () => `Ok`,
            pass: true,
          }
        : {
            message: () =>
              `expected ${received} to be ${classTypeOrNull} type or null`,
            pass: false,
          };
    }
  },
});

export const googleBotMatcherSchema = {
  id: expect.any(String),
  username: expect.any(String),
  gender: expect.toBeOneOf(["male", "female"]),
  fName: expect.any(String),
  lName: expect.any(String),
  otherTermsCategory: expect.toBeOneOf([0, 1, 2, 3, 4, 5, 6]),
  password: expect.any(String),
  locLat: expect.any(Number),
  locLong: expect.any(Number),
  type: expect.any(String),
  politicalRanking: expect.toBeOneOf([0, 1, 2, 3, 4]),
};

export const googleAdMatcherSchema = {
  id: expect.any(String),
  bot: expect.objectContaining(googleBotMatcherSchema),
  createdAt: expect.any(String),
  loggedIn: expect.toBeTypeOrNull(Boolean),
  headline: expect.toBeTypeOrNull(String),
  html: expect.toBeTypeOrNull(String),
  adLink: expect.toBeTypeOrNull(String),
};

export const twitterBotMatcherSchema = {
  id: expect.any(String),
  username: expect.any(String),
  type: expect.any(String),
  politicalRanking: expect.toBeOneOf([0, 1, 2, 3, 4]),
  followedAccounts: expect.toBeArray(),
  relevantTags: expect.toBeArray(),
  dob: expect.any(String),
};

export const twitterAdMatcherSchema = {
  adSeenId: expect.any(Number),
  adId: expect.any(String),
  createdAt: expect.any(String),
  // bot: expect.objectContaining(twitterBotMatcherSchema),
  promoterHandle: expect.any(String),
  content: expect.any(String),
  officialLink: expect.any(String),
  tweetLink: expect.any(String),
  image: expect.any(String),
  adType: expect.any(String),
  tags: expect.any([]),
};
