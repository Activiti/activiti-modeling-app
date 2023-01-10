/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ProcessEntitiesState } from '../store/process-entities.state';
import { ModelScope, Process } from '@alfresco-dbp/modeling-shared/sdk';

export const mockProcessEntityWithoutProperties: Process = {
    description: '',
    version: '0.0.1',
    createdBy: 'modeler',
    creationDate: new Date('2023-01-10T17:15:53.497+0000'),
    lastModifiedBy: 'modeler',
    lastModifiedDate: new Date('2023-01-10T17:15:53.498+0000'),
    id: '01182f5e-1c9d-4be4-b10f-8777a7dd8a7b',
    type: 'process',
    name: 'mockProcessEntity',
    category: '',
    scope: ModelScope.PROJECT,
    extensions: {
        'Process_N8lZYocU': {
            constants: {},
            mappings: {},
            properties: {},
            assignments: {}
        }
    },
    projectIds: [
        '99032ace-b5e2-4118-a8c8-a4741d268fb1'
    ]
};

export const mockProcessEntityWithProperties: Process = {
    description: '',
    version: '0.0.1',
    createdBy: 'modeler',
    creationDate: new Date('2023-01-10T17:15:53.497+0000'),
    lastModifiedBy: 'modeler',
    lastModifiedDate: new Date('2023-01-10T17:15:53.498+0000'),
    id: '01182f5e-1c9d-4be4-b10f-8777a7dd8a7b',
    type: 'process',
    name: 'mockProcessEntity',
    category: '',
    scope: ModelScope.PROJECT,
    extensions: {
        'Process_N8lZYocU': {
            constants: {},
            mappings: {},
            properties: {
                '1a334de2-d6f0-4521-823a-76c1063705bd': {
                    id: '1a334de2-d6f0-4521-823a-76c1063705bd',
                    name: 'test',
                    type: 'string',
                    analytics: false,
                    required: false,
                    model: {
                        $ref: '#/$defs/primitive/string'
                    }
                }
            },
            assignments: {}
        }
    },
    projectIds: [
        '99032ace-b5e2-4118-a8c8-a4741d268fb1'
    ]
};

export const mockProcessEntitiesState: ProcessEntitiesState = {
    ids: ['01182f5e-1c9d-4be4-b10f-8777a7dd8a7b'],
    loading: false,
    loaded: true,
    entityContents: {},
    entities: {
        ['01182f5e-1c9d-4be4-b10f-8777a7dd8a7b']: {
            ...mockProcessEntityWithoutProperties
        }
    },
    draftEntities: {
        entities: {
            ['01182f5e-1c9d-4be4-b10f-8777a7dd8a7b']: {
                ...mockProcessEntityWithProperties
            }
        },
        entityContents: {}
    }
};
