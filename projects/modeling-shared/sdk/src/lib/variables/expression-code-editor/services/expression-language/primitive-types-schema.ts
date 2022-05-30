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
            '$ref': '#/$defs/primitive/boolean'
        },
        {
            '$ref': '#/$defs/primitive/integer'
        },
        {
            '$ref': '#/$defs/primitive/string'
        },
        {
            '$ref': '#/$defs/primitive/json'
        },
        {
            '$ref': '#/$defs/primitive/date'
        },
        {
            '$ref': '#/$defs/primitive/datetime'
        },
        {
            '$ref': '#/$defs/primitive/file'
        },
        {
            '$ref': '#/$defs/primitive/folder'
        },
        {
            '$ref': '#/$defs/primitive/null'
        },
        {
            '$ref': '#/$defs/primitive/string-array'
        },
        {
            '$ref': '#/$defs/primitive/array'
        },
        {
            '$ref': '#/$defs/primitive/execution'
        }
    ],
    '$defs': {
        'primitive': {
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
                'type': 'string',
                'pattern': '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$'
            },
            'datetime': {
                'type': 'string',
                // eslint-disable-next-line max-len
                'pattern': '^((19|20)[0-9][0-9])[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])[T]([01][0-9]|[2][0-3])[:]([0-5][0-9])[:]([0-5][0-9])([+|-]([01][0-9]|[2][0-3])[:]([0-5][0-9])){0,1}$'
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
                    '$ref': '#/$defs/primitive/node'
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
                        '$ref': '#/$defs/primitive/content-info'
                    }
                }
            },
            'content-info': {
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
                    '$ref': '#/$defs/primitive/content'
                }
            },
            'file': {
                'type': [
                    {
                        '$ref': '#/$defs/primitive/content'
                    },
                    {
                        '$ref': '#/$defs/primitive/content-array'
                    }
                ]
            },
            'folder': {
                'type': [
                    {
                        '$ref': '#/$defs/primitive/node'
                    },
                    {
                        '$ref': '#/$defs/primitive/node-array'
                    }
                ]
            },
            'null': {
                'type': 'null'
            },
            'string-array': {
                'type': 'array',
                'items': {
                    '$ref': '#/$defs/primitive/string'
                }
            },
            'array': {
                'type': 'array',
                'items': {
                    '$ref': '#/$defs/primitive/json'
                }
            },
            'execution': {
                'type': 'execution'
            }
        }
    }
};
