const path = require('path');
const getJestConfig = require(__dirname + '/../adf-candidates/testing/jest/jest.get-config');

module.exports = getJestConfig({
    coverageDirectory: '<rootDir>/../../../../coverage/modeling-ce/connector-editor',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/*.ts',
        '!<rootDir>/src/**/*.d.ts',
        '!<rootDir>/src/**/index.ts'
    ],
    roots: [
        path.resolve(__dirname, 'src')
    ],
    globals: {
       "ts-jest": {
            tsconfig: path.resolve(__dirname, 'tsconfig.spec.json'),
        }
    }
}, 'tsconfig.json', path.resolve(__dirname, '../..'));
