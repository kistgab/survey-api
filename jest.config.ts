/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  collectCoverageFrom: ["src/**/*.ts", "!src/main/**"],
  coverageDirectory: "coverage",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  preset: "@shelf/jest-mongodb",
  testMatch: ["**/*.spec.ts", "**/*.integration-spec.ts"],
  watchPathIgnorePatterns: ["<rootDir>/globalConfig.json"],
};

export default config;
