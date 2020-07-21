const path = require('path');

module.exports = {
    preset: 'jest-preset-angular',
    rootDir: path.resolve(__dirname),
    verbose: true,
    testURL: 'http://localhost',
    setupFilesAfterEnv: [ path.resolve(__dirname, 'jest/jest-setup.ts') ],
    coverageDirectory: '<rootDir>/../../coverage/modeling-ce/app',
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/jest',
        '!<rootDir>/src/*.ts',
        '!<rootDir>/src/**/*.d.ts',
        '!<rootDir>/src/**/index.ts'
    ],
    roots: [
        path.resolve(__dirname, 'src')
    ],
    transformIgnorePatterns: [
        'node_modules/(?!@alfresco\\/js-api)'
    ],
    transform: {
        '^.+\\.(ts|js|html)$': 'ts-jest',
        '^.+\\.js$': 'babel-jest'
    },
    snapshotSerializers: [
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js',
    ],
    globals: {
        "ts-jest": {
            stringifyContentPathRegex: '\\.html?$',
            tsConfig: "<rootDir>/tsconfig.spec.json"
        }
    },
    moduleNameMapper: {
        '@alfresco-dbp/modeling-shared/sdk': '<rootDir>/projects/modeling-shared/sdk/src/public-api.ts'
    }
};
