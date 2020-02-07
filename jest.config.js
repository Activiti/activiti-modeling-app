const path = require('path');

module.exports = {
    preset: 'jest-preset-angular',
    rootDir: process.cwd(),
    verbose: true,
    testURL: 'http://localhost',
    setupTestFrameworkScriptFile: path.resolve(__dirname, 'jest/jest-setup.ts'),
    coverageDirectory: '<rootDir>/coverage/modeling-community',
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/apps/modeling-community/src/**/*.ts',
        '<rootDir>/apps/modeling-community/projects/**/*.ts',
        '!<rootDir>/apps/modeling-community/jest',
        '!<rootDir>/apps/modeling-community/src/*.ts',
        '!<rootDir>/apps/modeling-community/src/**/*.d.ts',
        '!<rootDir>/apps/modeling-community/src/**/index.ts',
        '!<rootDir>/apps/modeling-community/projects/**/*.d.ts',
        '!<rootDir>/apps/modeling-community/ama-testing/src/e2e',
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
        '^.+\\.(ts|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
        '^.+\\.js$': 'babel-jest'
    }
};
