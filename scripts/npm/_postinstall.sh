#!/usr/bin/env bash

lessc ./node_modules/bpmn-js-properties-panel/styles/properties.less .tmp/bpmn-properties.css
node ./jest/transpile-es2015-modules-for-jest.js
webdriver-manager update --gecko=false --versions.chrome=$npm_package_config_chromeDriver
