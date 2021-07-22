const config = require('./jest.config');
const { overrideTsConfig } = require('../adf-candidates/testing/jest/jest-utils');

module.exports = overrideTsConfig(config, "<rootDir>/tsconfig.spec.adf.json");
