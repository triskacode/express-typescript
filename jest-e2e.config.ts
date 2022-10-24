import { Config } from "jest";

const config: Config = {
  verbose: true,
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testTimeout: 60000,
  detectOpenHandles: true,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  roots: ["test/"],
  testEnvironment: "node",
  testRegex: ".e2e.spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleDirectories: ["<rootDir>/src/", "node_modules"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
  },
};

export default config;
