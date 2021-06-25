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
export const primitiveTypesSchema = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    '$id': 'primitiveTypes',
    'description': 'A schema that validates the minimum requirements for validation output',
    'anyOf': [
        {
            '$ref': '#/$defs/boolean'
        },
        {
            '$ref': '#/$defs/integer'
        },
        {
            '$ref': '#/$defs/string'
        },
        {
            '$ref': '#/$defs/json'
        },
        {
            '$ref': '#/$defs/date'
        },
        {
            '$ref': '#/$defs/datetime'
        },
        {
            '$ref': '#/$defs/file'
        },
        {
            '$ref': '#/$defs/folder'
        },
        {
            '$ref': '#/$defs/null'
        },
        {
            '$ref': '#/$defs/string-array'
        },
        {
            '$ref': '#/$defs/array'
        }
    ],
    '$defs': {
        'boolean': {
            'type': 'boolean'
        },
        'integer': {
            'type': 'integer'
        },
        'string': {
            'type': 'string'
        },
        'json': {
            'type': 'object',
            'additionalProperties': true
        },
        'date': {
            'type': 'object'
        },
        'datetime': {
            'type': 'object'
        },
        'node': {
            'type': 'object',
            'additionalProperties': true,
            'properties': {
                'id': {
                    'type': 'string',
                    'description': 'Node identifier'
                },
                'name': {
                    'type': 'string',
                    'description': 'Node name'
                }
            }
        },
        'node-array': {
            'type': 'array',
            'items': {
                '$ref': '#/$defs/node'
            }
        },
        'content': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'id': {
                    'type': 'string',
                    'description': 'Node identifier'
                },
                'name': {
                    'type': 'string',
                    'description': 'Node name'
                },
                'uri': {
                    'type': 'string',
                    'description': 'Node URI'
                },
                'content': {
                    '$ref': '#/$defs/content-metadata'
                }
            }
        },
        'content-metadata': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'sizeInBytes': {
                    'type': 'integer',
                    'description': 'Node size in bytes'
                },
                'mimeType': {
                    'type': 'string',
                    'description': 'Node mime type'
                }
            }
        },
        'content-array': {
            'type': 'array',
            'items': {
                '$ref': '#/$defs/content'
            }
        },
        'file': {
            'type': [
                {
                    '$ref': '#/$defs/content'
                },
                {
                    '$ref': '#/$defs/content-array'
                }
            ]
        },
        'folder': {
            'type': [
                {
                    '$ref': '#/$defs/node'
                },
                {
                    '$ref': '#/$defs/node-array'
                }
            ]
        },
        'null': {
            'type': 'null'
        },
        'string-array': {
            'type': 'array',
            'items': {
                '$ref': '#/$defs/string'
            }
        },
        'array': {
            'type': 'array',
            'items': {
                '$ref': '#/$defs/json'
            }
        }
    }
};
