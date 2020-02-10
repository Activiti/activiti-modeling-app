const path = require('path');

module.exports = {
    preset: 'jest-preset-angular',
    rootDir: path.resolve(__dirname),
    verbose: true,
    testURL: 'http://localhost',
    setupTestFrameworkScriptFile: path.resolve(__dirname, 'jest/jest-setup.ts'),
    coverageDirectory: '<rootDir>/../../coverage/modeling-ce',
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '<rootDir>/projects/**/*.ts',
        '!<rootDir>/jest',
        '!<rootDir>/src/*.ts',
        '!<rootDir>/src/**/*.d.ts',
        '!<rootDir>/src/**/index.ts',
        '!<rootDir>/projects/**/*.d.ts',
        '!<rootDir>/ama-testing/src/e2e',
    ],
    roots: [
        path.resolve(__dirname, 'projects'),
        path.resolve(__dirname, 'src')
    ],
    transformIgnorePatterns: [
        'node_modules/(?!@alfresco\\/js-api)'
    ],
    setupFiles: ['core-js/es7/array'],
    transform: {
        '^.+\\.(ts|js|html)$': 'jest-preset-angular/preprocessor.js',
        '^.+\\.js$': 'babel-jest'
    },
    snapshotSerializers: [
        "jest-preset-angular/AngularSnapshotSerializer.js",
        "jest-preset-angular/HTMLCommentSerializer.js"
    ],
    globals: {
        "ts-jest": {
          "tsConfigFile": "<rootDir>/tsconfig.spec.json"
        },
        "__TRANSFORM_HTML__": true
    }
};
