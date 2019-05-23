module.exports = {
    clearMocks: true,
    coverageDirectory: "./coverage",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testEnvironmentOptions: {
        runScripts: "dangerously"
    },
};
