const config = require('./jest.config');

module.exports = {
    ...config,
    globals: {
        "ts-jest": {
            stringifyContentPathRegex: '\\.html?$',
            tsconfig:"<rootDir>/tsconfig.spec.adf.json"
        }
    },
}
