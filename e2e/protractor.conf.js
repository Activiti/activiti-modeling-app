const config = require('./config/config');
const onPrepare = require('./config/hooks/on-prepare');
const onComplete = require('./config/hooks/on-complete');
const afterLaunch = require('./config/hooks/after-launch');
const failFast = require('protractor-fail-fast');
require('dotenv').config();

const E2E_HOST = process.env.E2E_HOST || 'localhost',
    E2E_PORT = process.env.E2E_PORT || 4100,
    BROWSER_RUN = process.env.BROWSER_RUN,
    FAIL_FAST = process.env.E2E_FAIL_FAST === 'true';

exports.config = {
    SELENIUM_PROMISE_MANAGER: false,

    allScriptsTimeout: 30000,

    specs: [
        './tests/**/*.ts'
    ],

    suites: {
        test: [
            './tests/connector/export-connector.e2e.ts'
        ]
    },

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
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
                '--incognito',
//                '--no-sandbox',
                `--window-size=${config.browserWidth},${config.browserHeight}`,
                ...(BROWSER_RUN === 'true' ? [] : ['--headless'] )
            ],
            //extensions: [getOneExtension('./redux-devtools.crx')]
        }
    },

    directConnect: true,

    baseUrl: "http://" + E2E_HOST + ":" + E2E_PORT,

    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 60000,
        includeStackTrace: true,
        print: () => {}
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
        },
        ...(FAIL_FAST ? [failFast.init()] : [])
    ],

    params: {
        downloadDir: config.paths.download
    },

    onPrepare,
    afterLaunch,
    onComplete
};
