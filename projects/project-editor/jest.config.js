const path = require('path');
const getJestConfig = require('../../jest.get-config');

module.exports = getJestConfig({
    rootDir: path.resolve(__dirname),
    setupFilesAfterEnv: [ path.resolve(__dirname, '..', '..', 'jest/jest-setup.ts') ],
    coverageDirectory: '<rootDir>/../../../../coverage/modeling-ce/project-editor',
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
        '@alfresco-dbp/modeling-shared/sdk': '<rootDir>/../../projects/modeling-shared/sdk/src/public-api.ts',
        '@alfresco-dbp/adf-candidates/core/dialog': '<rootDir>/../../projects/adf-candidates/core/dialog/public-api.ts'
    },
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json"
        }
    }
});
