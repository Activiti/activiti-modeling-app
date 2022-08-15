const path = require('path');
const getJestConfig = require(__dirname + '/testing/jest/jest.get-config');

module.exports = getJestConfig({
    coverageDirectory: '<rootDir>/../../../../coverage/modeling-ce/adf-candidates',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '<rootDir>/**/*.ts',
        '!<rootDir>/src/*.ts',
        '!<rootDir>/src/**/*.d.ts',
        '!<rootDir>/src/**/index.ts'
    ],
    roots: [
        path.resolve(__dirname)
    ],
    globals: {
       "ts-jest": {
            tsconfig: path.resolve(__dirname, 'tsconfig.spec.json'),
        }
    },
}, 'tsconfig.json', path.resolve(__dirname, '../..'));
