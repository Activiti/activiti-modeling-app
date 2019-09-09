const retry = require('protractor-retry').retry;

async function onCleanUp(results) {
    retry.onCleanUp(results);
}

module.exports = onCleanUp;
