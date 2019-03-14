const SpecReporter = require ('jasmine-spec-reporter').SpecReporter;
const jasmineReporters = require('jasmine-reporters') ;
const TimeProcessor = require('../utils/time-processor');
const disableCSSAnimation = require('../utils/disable-css-animation');
const fs = require('fs-extra');
const config = require('../config');

function onPrepare() {
    require('ts-node').register({ project: './e2e/tsconfig.e2e.json' });

    fs.ensureDirSync(config.paths.tmp);

    browser.manage().window().setSize(config.browserWidth, config.browserHeight);

    browser.waitForAngularEnabled(false);

    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
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

    /*
     * Add Jasmine Spec Reporter
     */
    jasmine.getEnv().addReporter(new SpecReporter({
        customProcessors: [TimeProcessor]
    }));

    // Create default download directory for Export file feature
    try {
        fs.ensureDirSync(config.paths.download);
    } catch (e) {
        console.warn("Unable to create default directory for export feature.", e);
    }

    return browser.driver.executeScript(disableCSSAnimation);
}

module.exports = onPrepare;
