const path = require('path');
const getJestConfig = require(__dirname + '/../../adf-candidates/testing/jest/jest.get-config');

module.exports = getJestConfig(
    __dirname,
    {},
    'tsconfig.json',
    path.resolve(__dirname, '../../..')
);
