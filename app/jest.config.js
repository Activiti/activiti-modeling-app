const path = require('path');

module.exports = {
    preset: 'jest-preset-angular',
    rootDir: path.resolve(__dirname),
    verbose: true,
    testURL: 'http://localhost',
    setupFilesAfterEnv: [ path.resolve(__dirname, '..', 'jest/jest-setup.ts') ],
    coverageDirectory: '<rootDir>/../../../coverage/modeling-ce/app',
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
            useESM: true,
            isolatedModules: true,
            stringifyContentPathRegex: '\\.html?$',
            tsconfig: "<rootDir>/tsconfig.spec.json"
        }
    },
    moduleNameMapper: {
        '@alfresco-dbp/modeling-shared/sdk': '<rootDir>/../projects/modeling-shared/sdk/src/public-api.ts',
        '@alfresco-dbp/adf-candidates/core/(.*)': '<rootDir>/../projects/adf-candidates/core/$1'
    }
};
