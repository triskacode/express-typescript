import { Config } from "jest";

const config: Config = {
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testTimeout: 20000,
  detectOpenHandles: true,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleDirectories: ["<rootDir>/../src", "node_modules"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/../src/$1",
  },
};

export default config;
