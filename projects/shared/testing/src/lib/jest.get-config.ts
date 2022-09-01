/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { pathsToModuleNameMapper } from 'ts-jest';
import { resolve, relative } from 'path';
const DEFAULT_TS_CONFIG = 'tsconfig.base.json';
const ROOT_DIR = process.cwd();

export function getJestConfig(projectDirectory: string, config = {}, tsConfigFileName = DEFAULT_TS_CONFIG, rootDirectory = ROOT_DIR) {
    const { compilerOptions } = require(resolve(rootDirectory, tsConfigFileName));
    process.env['TZ'] = 'UTC';
    return {
        preset: './jest.preset.js',
        testRunner : 'jasmine2',
        rootDir: process.cwd(),
        roots: [
            resolve(projectDirectory, 'src')
        ],
        verbose: false,
        testURL: 'http://localhost',
        setupFilesAfterEnv: ['<rootDir>/jest/jest-setup.ts'],
        collectCoverage: true,
        coverageDirectory: resolve(process.cwd(), 'coverage', relative(process.cwd(), projectDirectory)),
        collectCoverageFrom: [
            `${resolve(projectDirectory, 'src')}/**/*.ts`,
            `!${resolve(projectDirectory, 'src')}/src/*.ts`,
            `!${resolve(projectDirectory, 'src')}/src/**/*.d.ts`,
            `!${resolve(projectDirectory, 'src')}/src/**/index.ts`
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
                tsconfig: resolve(projectDirectory, 'tsconfig.spec.json'),
            },
        },
    };
};
