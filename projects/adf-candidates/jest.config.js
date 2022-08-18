const path = require('path');
const getJestConfig = require(__dirname + '/testing/jest/jest.get-config');

module.exports = getJestConfig(
    __dirname,
    {
        roots: [ path.resolve(__dirname) ],
    },
    'tsconfig.json',
    path.resolve(__dirname, '../..')
);
