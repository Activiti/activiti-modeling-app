module.exports = {
    "preset": "jest-preset-angular",
    "testURL": "http://localhost",
    "setupTestFrameworkScriptFile": "<rootDir>/jest/jest-setup.ts",
    "collectCoverageFrom": ["src/**/*.ts", "projects/**/*.ts", "!jest", "!src/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
    "coverageDirectory": "./coverage/",
    "collectCoverage": false,
    "moduleNameMapper": {},
    "transformIgnorePatterns": ["node_modules/?!(bpmn-moddle)"],
    "transform": {
        "^.+\\.(ts|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
        "^.+\\.js$": "babel-jest"
    }
}
