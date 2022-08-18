const { pathsToModuleNameMapper } = require('ts-jest/utils');
const path = require('path');
const DEFAULT_TS_CONFIG = 'tsconfig.base.json';
const ROOT_DIR = process.cwd();

module.exports = function getJestConfig(projectDirectory, config = {}, tsConfigFileName = DEFAULT_TS_CONFIG, rootDirectory = ROOT_DIR) {
    const { compilerOptions } = require(path.resolve(rootDirectory, tsConfigFileName));
    return {
        preset: './jest.preset.js',
        testRunner : 'jasmine2',
        rootDir: process.cwd(),
        roots: [
            path.resolve(projectDirectory, 'src')
        ],
        verbose: false,
        testURL: 'http://localhost',
        setupFilesAfterEnv: ['<rootDir>/jest/jest-setup.ts'],
        collectCoverage: true,
        coverageDirectory: path.resolve(process.cwd(), 'coverage', path.relative(process.cwd(), projectDirectory)),
        collectCoverageFrom: [
            `${path.resolve(projectDirectory, 'src')}/**/*.ts`,
            `!${path.resolve(projectDirectory, 'src')}/src/*.ts`,
            `!${path.resolve(projectDirectory, 'src')}/src/**/*.d.ts`,
            `!${path.resolve(projectDirectory, 'src')}/src/**/index.ts`
        ],
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
        modulePaths: ['<rootDir>'],
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: rootDirectory }),
        ...config,
        globals: {
            'ts-jest': {
                stringifyContentPathRegex: '\\.(html|svg)$',
                isolatedModules: true,
                tsconfig: path.resolve(projectDirectory, 'tsconfig.spec.json'),
            },
        }
    };
};
