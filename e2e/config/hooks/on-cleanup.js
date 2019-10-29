const retry = require('protractor-retry').retry;

async function onCleanUp(results) {
    if (process.env.CI) {
        retry.onCleanUp(results);
    }
}

module.exports = onCleanUp;
