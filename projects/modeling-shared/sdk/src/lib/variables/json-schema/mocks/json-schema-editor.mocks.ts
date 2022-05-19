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

import { JSONSchemaInfoBasics } from '../../../api/types';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../services/registered-inputs-modeling-json-schema-provider.service';

export const mockJsonSchema: JSONSchemaInfoBasics = {
    type: 'object',
    title: 'condition',
    properties: {
        name: {
            type: 'string',
            title: 'name',
            maxLength: 10,
            minLength: 2
        },
        appId: {
            title: 'appId',
            type: 'integer'
        },
        createDate: {
            title: 'creation date',
            $ref: '#/$defs/date'
        },
        references: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
    },
    required: [
        'name',
        'appId',
        'createDate'
    ],
    $defs: {
        date: {
            type: 'string',
            pattern: '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$'
        }
    }
};

export const expectedProperties = [
    { key: 'name', definition: { type: 'string', title: 'name', maxLength: 10, minLength: 2 } },
    { key: 'appId', definition: { title: 'appId', type: 'integer' } },
    { key: 'createDate', definition: { title: 'creation date', $ref: '#/$defs/date' } },
    { key: 'references', definition: { type: 'array', items: { type: 'string' } } }
];

export const expectedDefinitions = [
    {
        accessor: '#/$defs/date',
        key: 'date',
        definition: {
            type: 'string',
            pattern: '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$'
        }
    }
];

export const hierarchy = [
    {
        displayName: 'integer',
        iconName: 'assignment_turned_in',
        isCustomIcon: false,
        provider: RegisteredInputsModelingJsonSchemaProvider.PROVIDER_NAME,
        typeId: ['integer'],
        value: {
            $ref: '#/$defs/primitive/integer'
        }
    },
    {
        displayName: 'filter me',
        iconName: 'assignment_return',
        isCustomIcon: false,
        provider: 'a-provider',
        typeId: ['aProvider', '2'],
        value: {
            $ref: '#/$defs/a-provider/filter-me'
        }
    },
    {
        displayName: 'custom',
        iconName: 'assignment_returned',
        isCustomIcon: false,
        provider: 'custom-provider',
        typeId: ['custom', '2'],
        value: {
            $ref: '#/$defs/custom'
        }
    }
];
