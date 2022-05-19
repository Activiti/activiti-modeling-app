const getJestConfig = require(__dirname + '/../projects/adf-candidates/testing/jest/jest.get-config');

module.exports = getJestConfig({
    coverageDirectory: '<rootDir>/../../../coverage/modeling-ce/app',
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
           tsconfig: "<rootDir>/tsconfig.spec.json"
        }
    }
}, path.resolve(__dirname, '..', 'tsconfig.json'), '<rootDir>/../');
