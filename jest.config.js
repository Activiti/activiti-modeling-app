const { getJestProjects } = require('@nrwl/jest');

module.exports = {
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    transform: {
        '^.+\\.(ts|js|html|mjs)$': 'jest-preset-angular',
    },
    resolver: '@nrwl/jest/plugins/resolver',
    moduleFileExtensions: ['ts', 'js', 'html', 'mjs'],
    coverageReporters: ['html'],
    projects: getJestProjects(),
};
