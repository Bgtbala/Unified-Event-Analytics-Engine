export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/tests/**/*.test.js"],
  injectGlobals: true,
  setupFiles: ["<rootDir>/tests/setup/setupTests.js"],
};
