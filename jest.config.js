const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["./jestEnv.js"],
};

// https://github.com/vercel/next.js/issues/35634
async function jestConfig() {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  nextJestConfig.transformIgnorePatterns[0] = "/node_modules/(?!mui)/";
  return nextJestConfig;
}

module.exports = jestConfig;
