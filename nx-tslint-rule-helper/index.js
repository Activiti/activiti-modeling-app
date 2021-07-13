'use strict';
const resolve = require('path').resolve;

Object.defineProperty(exports, '__esModule', { value: true });
var enforceModuleBoundaries = require('./nxEnforceModuleBoundariesRule.js');
exports.nxEnforceModuleBoundariesRule = enforceModuleBoundaries.Rule;
exports.rulesDirectory = resolve(__dirname);
