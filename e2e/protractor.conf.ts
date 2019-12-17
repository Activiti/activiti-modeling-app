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

const config = require('./config/config');
const onPrepare = require('./config/hooks/on-prepare');
const afterLaunch = require('./config/hooks/after-launch');
const onCleanUp = require('./config/hooks/on-cleanup');
const SmartRunner = require('protractor-smartrunner');
const resolve = require('path').resolve;
const os = require('os');

let arraySpecs = [];

require('dotenv').config({ path: process.env.ENV_FILE });

let E2E_PREFIX = 'e2e-';
if (!!process.env.E2E_PREFIX) {
    E2E_PREFIX = `${E2E_PREFIX}${process.env.E2E_PREFIX}-`;
} else {
    E2E_PREFIX = `${E2E_PREFIX}${os.userInfo().username}-`;
}

 let specs = function () {
     let LIST_SPECS;

     if (process.env.LIST_SPECS) {
         LIST_SPECS = process.env.LIST_SPECS;
     }

     if (LIST_SPECS && LIST_SPECS !== '') {
         arraySpecs = LIST_SPECS.split(',');
         arraySpecs = arraySpecs.map((el) => './' + el);
     } else {
         const FOLDER = process.env.FOLDER || '';
         const specsToRun = FOLDER ? `./tests/${FOLDER}/**/*.e2e.ts` : './tests/**/*.ts';
         arraySpecs = [specsToRun];

     }

     return arraySpecs;
 };

specs();

const E2E_HOST = process.env.E2E_HOST || 'http://localhost',
    E2E_PORT = process.env.E2E_PORT || 4200,
    BROWSER_RUN = process.env.BROWSER_RUN,
    MAXINSTANCES = process.env.MAXINSTANCES || 1;

exports.config = {
    SELENIUM_PROMISE_MANAGER: false,

    allScriptsTimeout: 30000,

    specs: arraySpecs,

    suites: {
        'connector+log-history': [
            './tests/connector/**/*.e2e.ts',
            './tests/log-history/**/*.e2e.ts'
        ],
        'process': [
            './tests/process/**/*.e2e.ts'
        ],
        'project+login-logout': [
            './tests/project/**/*.e2e.ts',
            './tests/login-logout/**/*.e2e.ts'
        ]
    },

    capabilities: {

        loggingPrefs: {
            browser: 'ALL' // "OFF", "SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST", "ALL".
        },

        browserName: 'chrome',

        maxInstances: MAXINSTANCES,

        shardTestFiles: true,

        chromeOptions: {
            ...(process.env.CI ? { binary: require('puppeteer').executablePath() } : {}),
            prefs: {
                'credentials_enable_service': false,
                'download': {
                    'prompt_for_download': false,
                    'directory_upgrade': true,
                    'default_directory': config.paths.download
                },
                'browser': {
                    'set_download_behavior': {
                        'behavior': 'allow'
                    }
                }
            },
            args: [
                '--disable-web-security',
                '--incognito',
                ...(BROWSER_RUN === 'true' ? [] : ['--headless']),
                `--window-size=${config.browserWidth},${config.browserHeight}`
            ],
        }
    },

    directConnect: true,

    baseUrl: `${E2E_HOST}${E2E_PORT ? `:${E2E_PORT}` : ''  }`,

    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000,
        includeStackTrace: true,
        print: () => {},
        ...SmartRunner.withOptionalExclusions(
            resolve(__dirname, 'protractor.excludes.json')
        )
    },
    stackTrace: true,

    plugins: [{
        package: 'jasmine2-protractor-utils',
        disableHTMLReport: false,
        disableScreenshot: false,
        screenshotOnExpectFailure: false,
        screenshotOnSpecFailure: true,
        clearFoldersBeforeTest: true,
        screenshotPath: config.paths.screenShots
    }
    ],

    params: {
        downloadDir: config.paths.download,
        config: { log: true },
        namePrefix: E2E_PREFIX
    },

    onPrepare,
    afterLaunch,
    onCleanUp
};
