module.exports = {
    "preset": "jest-preset-angular",
    "testURL": "http://localhost",
    "setupFilesAfterEnv": [ "<rootDir>/jest/jest-setup.ts" ],
    "collectCoverageFrom": ["src/**/*.ts", "projects/**/*.ts", "!jest", "!src/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
    "coverageDirectory": "./coverage/",
    "collectCoverage": false,
    "moduleNameMapper": {},
    "transformIgnorePatterns": [
        "node_modules/(?!bpmn-moddle|@alfresco\\/js-api)"
    ],
    "setupFiles": ["core-js/es7/array"],
    "transform": {
        "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
        "^.+\\.js$": "babel-jest"
    }
}
