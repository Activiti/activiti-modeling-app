module.exports = {
    preset: 'jest-preset-angular',
    testURL: 'http://localhost',
    setupFilesAfterEnv: [ '<rootDir>/jest/jest-setup.ts' ],
    collectCoverageFrom: ['src/**/*.ts', 'projects/**/*.ts', '!jest', '!src/*.ts', '!src/**/*.d.ts', '!src/**/index.ts'],
    coverageDirectory: './coverage/',
    collectCoverage: false,
    moduleNameMapper: {
        '^moddle$': '<rootDir>/node_modules/moddle-transpiled',
        '^moddle/(.*)$': '<rootDir>/node_modules/moddle-transpiled/$1',
        '^moddle-xml$': '<rootDir>/node_modules/moddle-xml-transpiled',
        '^moddle-xml/(.*)$': '<rootDir>/node_modules/moddle-xml-transpiled/$1',
        '^bpmn-moddle$': '<rootDir>/node_modules/bpmn-moddle-transpiled',
        '^bpmn-moddle/(.*)$': '<rootDir>/node_modules/bpmn-moddle-transpiled/$1',
        '^bpmn-js$': '<rootDir>/node_modules/bpmn-js-transpiled',
        '^bpmn-js/(.*)$': '<rootDir>/node_modules/bpmn-js-transpiled/$1',
        '^diagram-js$': '<rootDir>/node_modules/diagram-js-transpiled',
        '^diagram-js/(.*)$': '<rootDir>/node_modules/diagram-js-transpiled/$1'
    },
    transformIgnorePatterns: [
        'node_modules/(?!@alfresco\\/js-api)'
    ],
    modulePathIgnorePatterns: [
        `<rootDir>/dist`
    ],
    setupFiles: ['core-js/es7/array'],
    transform: {
        '^.+\\.(ts|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
        '^.+\\.js$': 'babel-jest'
    },
    globals: {
        '__TRANSFORM_HTML__': true
    }
}
