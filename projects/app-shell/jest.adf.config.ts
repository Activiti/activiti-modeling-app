/* eslint-disable */
import { resolve } from 'path';
import { overrideTsConfig } from '@alfresco-dbp/shared/testing';
const config = require('./jest.config');

export default overrideTsConfig(
    config,
    resolve(__dirname, 'tsconfig.spec.adf.json')
);
