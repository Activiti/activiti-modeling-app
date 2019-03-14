const fs = require('fs-extra');

const getExtension = function (filename) {
    fileContent = fs.readFileSync(filename);
    return fileContent.toString('base64');
};

exports.getExtension = getExtension;
