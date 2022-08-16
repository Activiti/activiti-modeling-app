const { resolve } = require('path');
const config = require('./jest.config');
const { overrideTsConfig } = require('./testing/jest/jest-utils');

module.exports = overrideTsConfig(config, resolve(__dirname, 'tsconfig.spec.adf.json'));
