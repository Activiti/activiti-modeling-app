/* eslint-disable */
const path = require('path');
const getJestConfig = require(__dirname + '/testing/jest/jest.get-config');

export default getJestConfig(
    __dirname,
    {
        roots: [path.resolve(__dirname)],
    },
    'tsconfig.json',
    path.resolve(__dirname, '../..')
);
