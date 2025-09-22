/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "@swc/jest",
      {
        jsc: { parser: { syntax: "typescript", tsx: false }, target: "es2022" },
        // Compile tests to CJS for Jest runtime:
        module: { type: "commonjs" },
      },
    ],
  },
  // Handles relative `../Thing.js` imports pointing to TS sources
  resolver: "jest-ts-webcompat-resolver",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!**/*.d.ts"],
  coverageDirectory: "coverage",
};
