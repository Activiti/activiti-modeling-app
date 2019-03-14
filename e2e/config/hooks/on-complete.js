const fs = require('fs-extra');
const config = require('../config');

function onComplete() {
    fs.removeSync(config.paths.tmp);
}

module.exports = onComplete;
