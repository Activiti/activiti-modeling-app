const argv = require('yargs').argv;
const uploadOutput = require('../utils/upload-output');
const retry = require('protractor-retry').retry;

const FOLDER = process.env.FOLDER || '',
    SAVE_SCREENSHOT = process.env.SAVE_SCREENSHOT === 'true';

async function afterLaunch(statusCode) {

    if (SAVE_SCREENSHOT && statusCode === 1) {
        console.log(`Status code is ${statusCode}, trying to save screenshots.`);
        let retryCount = 1;
        if (argv.retry) {
            retryCount = ++argv.retry;
        }

        try {
            console.log('Retry number: ', retryCount);
            await uploadOutput(FOLDER, retryCount);
            console.log('Screenshots saved successfully.');
        } catch (e) {
            console.log('Error happened while trying to upload screenshots and test reports: ', e);
        }
    } else {
        console.log(`Status code is ${statusCode}, no need to save screenshots.`);
    }

    if (process.env.CI) {
        return retry.afterLaunch(4);
    }
}

module.exports = afterLaunch;
