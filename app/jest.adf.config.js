const config = require('./jest.config');
const { overrideTsConfig } = require('../jest-utils');

module.exports = overrideTsConfig(config, "<rootDir>/tsconfig.spec.adf.json");
