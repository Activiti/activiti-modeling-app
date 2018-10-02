import { Process, ServicesParameterMappings, PROCESS } from 'ama-sdk';

const deepFreeze = require('deep-freeze-strict');

export const variablesMappings: ServicesParameterMappings = {
    'taskId': {
        input: {
            'input-param': 'terrifying-variable'
        },
        output: {
            'output-param': 'beautiful-variable'
        }
    }
};

export const mockProcess: Process = deepFreeze({
    type: PROCESS,
    id: 'id1',
    name: 'Process 1',
    createdAt: new Date(),
    createdByUser: {
        id: 'idd',
        displayName: 'Test'
    },
    modifiedAt: new Date(),
    modifiedByUser: {
        id: 'idd',
        displayName: 'Test'
    },
    description: '',
    version: '',
    extensions: {
        properties: [{name: '', type: '', required: false, value: ''}],
        variablesMappings
    }
});
