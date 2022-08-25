/* eslint-disable */
const path = require('path');
const getJestConfig = require(__dirname +
    '/../../adf-candidates/testing/jest/jest.get-config');

export default getJestConfig(
    __dirname,
    {},
    'tsconfig.json',
    path.resolve(__dirname, '../../..')
);
