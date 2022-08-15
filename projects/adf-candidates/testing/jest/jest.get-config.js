const { pathsToModuleNameMapper } = require('ts-jest/utils');
const path = require('path');
const DEFAULT_TS_CONFIG = 'tsconfig.base.json';
const ROOT_DIR = process.cwd();

module.exports = function getJestConfig(config, tsConfigFileName = DEFAULT_TS_CONFIG, rootDirectory = ROOT_DIR) {
    const { compilerOptions } = require(path.resolve(rootDirectory, tsConfigFileName));
    return {
        preset: './jest.preset.js',
        testRunner : 'jasmine2',
        rootDir: process.cwd(),
        verbose: false,
        testURL: 'http://localhost',
        setupFilesAfterEnv: ['<rootDir>/jest/jest-setup.ts'],
        collectCoverage: true,
        transformIgnorePatterns: [
            'node_modules/(?!.*\\.mjs$|@alfresco\\/js-api|diagram-js|bpmn-js|@ngrx)'
        ],
        transform: {
            '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
        },
        snapshotSerializers: [
            'jest-preset-angular/build/serializers/no-ng-attributes',
            'jest-preset-angular/build/serializers/ng-snapshot',
            'jest-preset-angular/build/serializers/html-comment',
        ],
        modulePathIgnorePatterns: [
            `dist`
        ],
        moduleDirectories: [
            'node_modules'
        ],
        roots: ['<rootDir>'],
        modulePaths: ['<rootDir>'],
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: rootDirectory }),
        ...config,
        globals: {
            ...config.globals,
            'ts-jest': {
                stringifyContentPathRegex: '\\.(html|svg)$',
                isolatedModules: true,
                ...config.globals['ts-jest'],
            },
        },
    };
};
