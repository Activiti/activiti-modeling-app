/* eslint-disable */
import { resolve } from 'path';
import { getJestConfig } from '@alfresco-dbp/shared/testing';

export default getJestConfig(
    __dirname,
    {},
    'tsconfig.json',
    resolve(__dirname, '../../..')
);
