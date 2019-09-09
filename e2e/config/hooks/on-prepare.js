const SpecReporter = require ('jasmine-spec-reporter').SpecReporter;
const jasmineReporters = require('jasmine-reporters') ;
const disableCSSAnimation = require('../utils/disable-css-animation');
const fs = require('fs-extra');
const config = require('../config');
const retry = require('protractor-retry').retry;
const configTs = require(__dirname + '/../../tsconfig.e2e.json');
const failFast = require('../utils/fail-fast');

function onPrepare() {

    retry.onPrepare();

    jasmine.getEnv().addReporter(failFast.init());

    require('ts-node').register({ project: './e2e/tsconfig.e2e.json' });
    require('tsconfig-paths').register({baseUrl: './e2e', paths: configTs.compilerOptions.paths});

    fs.ensureDirSync(config.paths.tmp);

    browser.manage().window().setSize(config.browserWidth, config.browserHeight);

    browser.waitForAngularEnabled(false);

    var generatedSuiteName = Math.random().toString(36).substr(2, 5);
    var junitReporter = new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: config.paths.junitReport,
        filePrefix: 'results.xml-' + generatedSuiteName,
    });
    jasmine.getEnv().addReporter(junitReporter);

    // enable browser file download for headless and no-headless modes
    browser.driver.sendChromiumCommand('Page.setDownloadBehavior', {
        'behavior': 'allow',
        'downloadPath': config.paths.download
    });

    jasmine.getEnv().addReporter(
        new SpecReporter({
            spec: {
                displayStacktrace: true,
                displayDuration: true
            }
        })
    );

    // Create default download directory for Export file feature
    try {
        fs.ensureDirSync(config.paths.download);
    } catch (e) {
        console.warn("Unable to create default directory for export feature.", e);
    }

    return browser.driver.executeScript(disableCSSAnimation);
}

module.exports = onPrepare;
