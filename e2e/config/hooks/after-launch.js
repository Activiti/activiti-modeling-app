const argv = require('yargs').argv;
const uploadOutput = require('../utils/upload-output');
const failFast = require('protractor-fail-fast');

const FOLDER = process.env.FOLDER || '',
    SAVE_SCREENSHOT = (process.env.SAVE_SCREENSHOT == 'true');

async function afterLaunch(statusCode) {

    if (SAVE_SCREENSHOT && statusCode === 1) {
        console.log(`Status code is ${statusCode}, trying to save screenshots.`);
        let retryCount = 1;
        if (argv.retry) {
            retryCount = ++argv.retry;
        }

        try {
            await uploadOutput(FOLDER, retryCount);
            console.log('Screenshots saved successfully.');
        } catch (e) {
            console.log('Error happened while trying to upload screenshots and test reports.');
            throw e;
        }
    } else {
        console.log(`Status code is ${statusCode}, no need to save screenshots.`);
    }

    failFast.clean();
}

module.exports = afterLaunch;
