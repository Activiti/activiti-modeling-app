const path = require('path');

module.exports = {
    preset: 'jest-preset-angular',
    rootDir: path.resolve(__dirname),
    verbose: true,
    testURL: 'http://localhost',
    setupFilesAfterEnv: [ path.resolve(__dirname, '..', '..', '..', 'jest/jest-setup.ts') ],
    coverageDirectory: '<rootDir>/../../../../../coverage/modeling-ce/modeling-sdk',
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
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
        '^.+\\.(ts|js|html)$': 'ts-jest'
    },
    snapshotSerializers: [
        'jest-preset-angular/build/serializers/ng-snapshot.js',
        'jest-preset-angular/build/serializers/html-comment.js',
    ],
    globals: {
        "ts-jest": {
            stringifyContentPathRegex: '\\.html?$',
            tsconfig: "<rootDir>/tsconfig.spec.json"
        }
    }
};
