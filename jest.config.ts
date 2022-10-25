import { Config } from "jest";

const config: Config = {
  verbose: true,
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  detectOpenHandles: true,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  roots: ["src/"],
  testEnvironment: "node",
  testRegex: ".*.(unit|integration).spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
  },
};

export default config;
