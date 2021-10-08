const { compilerOptions } = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest/utils");

module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src",
  }),
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: [
    "/lib/",
    "/node_modules/",
    "<rootDir>/src/swaggerDoc",
    "<rootDir>/dist",
    "/migrations/",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/swaggerDoc",
    "<rootDir>/dist",
    "/migrations/",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  setupFilesAfterEnv: ["jest-extended"],
  coverageDirectory: "<rootDir>/coverage",
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./coverage",
        filename: "index.html",
        expand: true,
        openReport: true,
      },
    ],
  ],
};
