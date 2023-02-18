/** @type {import('jest').Config} */
const config = {
    testEnvironment: "node",
    testMatch: ["**/**/*.test.js"],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
};

module.exports = config;