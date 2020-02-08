const path = require('path');

module.exports = {
    preset: 'jest-preset-angular',
    rootDir: process.cwd(),
    verbose: true,
    testURL: 'http://localhost',
    setupTestFrameworkScriptFile: path.resolve(__dirname, 'jest/jest-setup.ts'),
    coverageDirectory: '<rootDir>/coverage/modeling-ce',
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/apps/modeling-ce/src/**/*.ts',
        '<rootDir>/apps/modeling-ce/projects/**/*.ts',
        '!<rootDir>/apps/modeling-ce/jest',
        '!<rootDir>/apps/modeling-ce/src/*.ts',
        '!<rootDir>/apps/modeling-ce/src/**/*.d.ts',
        '!<rootDir>/apps/modeling-ce/src/**/index.ts',
        '!<rootDir>/apps/modeling-ce/projects/**/*.d.ts',
        '!<rootDir>/apps/modeling-ce/ama-testing/src/e2e',
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
