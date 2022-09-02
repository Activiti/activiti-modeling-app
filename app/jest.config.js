import { resolve } from 'path';
import { getJestConfig } from '@alfresco-dbp/shared/testing';

module.exports = getJestConfig(
    __dirname,
    {
        roots: [ resolve(__dirname) ],
    },
    'tsconfig.json',
    resolve(__dirname, '..')
);
