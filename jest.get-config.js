module.exports = function getJestConfig(config) {
    return {
        preset: 'jest-preset-angular',
        verbose: true,
        testURL: 'http://localhost',
        collectCoverage: true,
        transformIgnorePatterns: [
            'node_modules/(?!@alfresco\\/js-api)'
        ],
        transform: {
            '^.+\\.(ts|js|html)$': 'ts-jest'
        },
        snapshotSerializers: [
            'jest-preset-angular/build/serializers/ng-snapshot',
            'jest-preset-angular/build/serializers/html-comment',
        ],

        ...config,

        globals: {
            ...config.globals,
            'ts-jest': {
                stringifyContentPathRegex: '\\.html?$',
                useESM: true,
                isolatedModules: true,
                ...config.globals['ts-jest'],
            },
        },
    };
};
