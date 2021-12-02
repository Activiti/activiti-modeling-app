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

export const exampleJSONSchema = {
    type: 'object',
    properties: {
        company: {
            type: 'string',
            default: 'Alfresco',
            readOnly: true
        },
        employeeNumber: {
            type: 'integer',
        },
        salary: {
            type: 'number'
        },
        positions: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        disabled: {
            type: 'boolean',
            default: false
        }
    }
};

export const exampleJSONSchemaWithSelfReference = {
    type: 'object',
    properties: {
        company: {
            $ref: '#/definitions/company'
        },
        employeeNumber: {
            type: 'integer',
        },
        salary: {
            type: 'number'
        },
        positions: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        disabled: {
            type: 'boolean',
            default: false
        }
    },
    definitions: {
        company: {
            type: 'string',
            default: 'Alfresco',
            readOnly: true
        }
    }
};
