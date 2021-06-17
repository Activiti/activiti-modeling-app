const path = require('path');
const getJestConfig = require('../../../jest.get-config');

module.exports = getJestConfig({
    rootDir: path.resolve(__dirname),
    setupFilesAfterEnv: [ path.resolve(__dirname, '..', '..', '..', 'jest/jest-setup.ts') ],
    coverageDirectory: '<rootDir>/../../../../../coverage/modeling-ce/modeling-sdk',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/*.ts',
        '!<rootDir>/src/**/*.d.ts',
        '!<rootDir>/src/**/index.ts'
    ],
    roots: [
        path.resolve(__dirname, 'src')
    ],
    moduleNameMapper: {
        '@alfresco-dbp/adf-candidates/core/(.*)': '<rootDir>/../../../projects/adf-candidates/core/$1'
    },
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json"
        }
    }
});
