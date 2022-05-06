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

import { TestBed } from '@angular/core/testing';
import { CodeEditorService } from '../code-editor/services/code-editor-service.service';
import { JSONSchemaToEntityPropertyService } from './json-schema-to-entity-property.service';
import { ModelingJSONSchemaService } from './modeling-json-schema.service';
import { PropertiesViewerBooleanInputComponent } from '../variables/properties-viewer/value-type-inputs/boolean-input.component';
import { PropertiesViewerIntegerInputComponent } from '../variables/properties-viewer/value-type-inputs/integer-input/integer-input.component';
import { PropertiesViewerStringInputComponent } from '../variables/properties-viewer/value-type-inputs/string-input/string-input.component';
import { provideInputTypeItemHandler } from '../variables/properties-viewer/value-type-inputs/value-type-inputs';
import { provideModelingJsonSchemaProvider } from './modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from './registered-inputs-modeling-json-schema-provider.service';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { PropertiesViewerJsonInputComponent } from '../variables/properties-viewer/value-type-inputs/json-input/json-input.component';
import { exampleJSONSchema } from '../mocks/json-schema.mock';

describe('JSONSchemaToEntityPropertyService', () => {
    let service: JSONSchemaToEntityPropertyService;
    let modelingJSONSchemaService: ModelingJSONSchemaService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CodeEditorService,
                ModelingJSONSchemaService,
                JSONSchemaToEntityPropertyService,
                { provide: TranslationService, useClass: TranslationMock },
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideInputTypeItemHandler('integer', PropertiesViewerIntegerInputComponent),
                provideInputTypeItemHandler('boolean', PropertiesViewerBooleanInputComponent),
                provideInputTypeItemHandler('employee', PropertiesViewerJsonInputComponent, 'json', exampleJSONSchema),
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider)
            ]
        });

        service = TestBed.inject(JSONSchemaToEntityPropertyService);
        modelingJSONSchemaService = TestBed.inject(ModelingJSONSchemaService);
        modelingJSONSchemaService.initializeProjectSchema('projectId');
    });

    describe('JSON Schema', () => {
        it('should get entities for string primitive type', () => {
            const JSONSchema = {
                type: 'string'
            };
            const expectedProperties = [
                {
                    id: 'string',
                    name: 'String',
                    label: 'String',
                    type: 'string',
                    readOnly: false,
                    required: false,
                    model: JSONSchema
                }
            ];

            const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

            expect(results).toEqual(expectedProperties);
        });

        it('should get entities for boolean primitive type', () => {
            const JSONSchema = {
                type: 'boolean'
            };
            const expectedProperties = [
                {
                    id: 'boolean',
                    name: 'Boolean',
                    label: 'Boolean',
                    type: 'boolean',
                    readOnly: false,
                    required: false,
                    model: JSONSchema
                }
            ];

            const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

            expect(results).toEqual(expectedProperties);
        });

        it('should get entities for an array type', () => {
            const JSONSchema = {
                type: 'array',
                items: {
                    type: 'string'
                }
            };
            const expectedProperties = [
                {
                    id: 'array',
                    name: 'Array',
                    label: 'Array',
                    type: 'array',
                    readOnly: false,
                    model: JSONSchema,
                    required: false
                }
            ];

            const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

            expect(results).toEqual(expectedProperties);
        });

        it('should get entities for an enum type', () => {
            const JSONSchema = {
                enum: ['a', 1, 2, 'c']
            };
            const expectedProperties = [
                {
                    id: 'enum',
                    name: 'Enum',
                    label: 'Enum',
                    type: 'enum',
                    readOnly: false,
                    model: JSONSchema,
                    required: false
                }
            ];

            const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

            expect(results).toEqual(expectedProperties);
        });

        it('should get entities for a const type', () => {
            const JSONSchema = {
                const: { a: 'b' }
            };
            const expectedProperties = [
                {
                    id: 'const',
                    name: 'Const',
                    label: 'Const',
                    type: 'json',
                    readOnly: true,
                    value: { a: 'b' },
                    required: false,
                    model: null
                }
            ];

            const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

            expect(results).toEqual(expectedProperties);
        });

        it('should get entities for an simple object type', () => {
            const JSONSchema = {
                type: 'object',
                properties: {
                    company: {
                        type: 'string',
                        default: 'Alfresco',
                        readOnly: true
                    },
                    domain: {
                        const: 'alfresco.com',
                        $comment: 'This is the company domain'
                    },
                    gender: {
                        enum: ['male', 'female']
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
                required: ['employeeNumber', 'disabled']
            };
            const expectedProperties = [
                {
                    id: 'company',
                    name: 'company',
                    label: 'company',
                    type: 'string',
                    readOnly: true,
                    value: 'Alfresco',
                    required: false,
                    model: JSONSchema.properties.company
                },
                {
                    id: 'domain',
                    name: 'domain',
                    label: 'domain',
                    type: 'json',
                    readOnly: true,
                    value: 'alfresco.com',
                    required: false,
                    placeholder: 'This is the company domain',
                    model: null
                },
                {
                    id: 'gender',
                    name: 'gender',
                    label: 'gender',
                    type: 'enum',
                    readOnly: false,
                    required: false,
                    model: JSONSchema.properties.gender
                },
                {
                    id: 'employeeNumber',
                    name: 'employeeNumber',
                    label: 'employeeNumber',
                    type: 'integer',
                    readOnly: false,
                    required: true,
                    model: JSONSchema.properties.employeeNumber
                },
                {
                    id: 'salary',
                    name: 'salary',
                    label: 'salary',
                    type: 'string',
                    readOnly: false,
                    required: false,
                    model: JSONSchema.properties.salary
                },
                {
                    id: 'positions',
                    name: 'positions',
                    label: 'positions',
                    type: 'array',
                    readOnly: false,
                    model: JSONSchema.properties.positions,
                    required: false
                },
                {
                    id: 'disabled',
                    name: 'disabled',
                    label: 'disabled',
                    type: 'boolean',
                    readOnly: false,
                    value: false,
                    required: true,
                    model: JSONSchema.properties.disabled
                }
            ];

            const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

            expect(results).toEqual(expectedProperties);
        });

        it('should get entities for a general referenced type', () => {
            const JSONSchema = {
                $ref: '#/$defs/primitive/boolean'
            };
            const expectedProperties = [
                {
                    id: 'boolean',
                    name: 'Boolean',
                    label: 'Boolean',
                    type: 'boolean',
                    readOnly: false,
                    required: false,
                    model: {
                        $ref: '#/$defs/primitive/boolean'
                    }
                }
            ];

            const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

            expect(results).toEqual(expectedProperties);
        });

        it('should get entities for a self referenced type', () => {
            const JSONSchema = {
                $ref: '#/$defs/my/boolean',
                $defs: {
                    my: {
                        boolean: {
                            type: 'boolean'
                        }
                    }
                }
            };
            const expectedProperties = [
                {
                    id: 'boolean',
                    name: 'Boolean',
                    label: 'Boolean',
                    type: 'boolean',
                    readOnly: false,
                    required: false,
                    model: {
                        type: 'boolean'
                    }
                }
            ];

            const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

            expect(results).toEqual(expectedProperties);
        });

        describe('anyOf', () => {
            it('should get entities for a anyOf type when it has one definition', () => {
                const JSONSchema = {
                    anyOf: [
                        {
                            $ref: '#/$defs/boolean',
                        }
                    ],
                    $defs: {
                        boolean: {
                            type: 'boolean'
                        }
                    }
                };
                const expectedProperties = [
                    {
                        id: 'boolean',
                        name: 'Boolean',
                        label: 'Boolean',
                        type: 'boolean',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'boolean'
                        }
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get entities for a anyOf type when it has no basic properties', () => {
                const JSONSchema = {
                    anyOf: [
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string'
                                }
                            }
                        },
                        {
                            type: 'object',
                            properties: {
                                second: {
                                    type: 'string'
                                }
                            }
                        }
                    ]
                };
                const expectedProperties = [
                    {
                        id: 'first',
                        name: 'first',
                        label: 'first',
                        type: 'string',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'string'
                        }
                    },
                    {
                        id: 'second',
                        name: 'second',
                        label: 'second',
                        type: 'string',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'string'
                        }
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get aggregated entity for a anyOf type when it has basic properties', () => {
                const JSONSchema = {
                    anyOf: [
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string'
                                }
                            }
                        },
                        {
                            type: 'integer'
                        }
                    ]
                };
                const expectedProperties = [
                    {
                        id: 'json',
                        name: 'Json',
                        label: 'Json',
                        type: 'json',
                        readOnly: false,
                        required: false,
                        aggregatedTypes: ['json', 'integer']
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get aggregated entity for a anyOf type when it has more than one definition', () => {
                const JSONSchema = {
                    anyOf: [
                        {
                            $ref: '#/$defs/boolean',
                        },
                        {
                            $ref: '#/$defs/integer'
                        }
                    ],
                    $defs: {
                        boolean: {
                            type: 'boolean'
                        },
                        integer: {
                            type: 'integer'
                        }
                    }
                };
                const expectedProperties = [
                    {
                        id: 'json',
                        name: 'Json',
                        label: 'Json',
                        type: 'json',
                        readOnly: false,
                        required: false,
                        aggregatedTypes: ['boolean', 'integer']
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });
        });

        describe('allOf', () => {
            it('should get entities for a allOf type when it has one definition', () => {
                const JSONSchema = {
                    allOf: [
                        {
                            $ref: '#/$defs/boolean',
                        }
                    ],
                    $defs: {
                        boolean: {
                            type: 'boolean'
                        }
                    }
                };
                const expectedProperties = [
                    {
                        id: 'boolean',
                        name: 'Boolean',
                        label: 'Boolean',
                        type: 'boolean',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'boolean'
                        }
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get entities for a allOf type when it has no basic properties', () => {
                const JSONSchema = {
                    allOf: [
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string'
                                }
                            }
                        },
                        {
                            type: 'object',
                            properties: {
                                second: {
                                    type: 'string'
                                }
                            }
                        }
                    ]
                };
                const expectedProperties = [
                    {
                        id: 'first',
                        name: 'first',
                        label: 'first',
                        type: 'string',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'string'
                        }
                    },
                    {
                        id: 'second',
                        name: 'second',
                        label: 'second',
                        type: 'string',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'string'
                        }
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get aggregated entity for a allOf type when it has basic properties', () => {
                const JSONSchema = {
                    allOf: [
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string'
                                }
                            }
                        },
                        {
                            type: 'integer'
                        }
                    ]
                };
                const expectedProperties = [
                    {
                        id: 'json',
                        name: 'Json',
                        label: 'Json',
                        type: 'json',
                        readOnly: false,
                        required: false,
                        aggregatedTypes: ['json', 'integer']
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get aggregated entity for a allOf type when it has more than one definition', () => {
                const JSONSchema = {
                    allOf: [
                        {
                            $ref: '#/$defs/boolean',
                        },
                        {
                            $ref: '#/$defs/integer'
                        }
                    ],
                    $defs: {
                        boolean: {
                            type: 'boolean'
                        },
                        integer: {
                            type: 'integer'
                        }
                    }
                };
                const expectedProperties = [
                    {
                        id: 'json',
                        name: 'Json',
                        label: 'Json',
                        type: 'json',
                        readOnly: false,
                        required: false,
                        aggregatedTypes: ['boolean', 'integer']
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });
        });

        describe('oneOf', () => {
            it('should get entities for a oneOf type when it has one definition', () => {
                const JSONSchema = {
                    oneOf: [
                        {
                            $ref: '#/$defs/boolean',
                        }
                    ],
                    $defs: {
                        boolean: {
                            type: 'boolean'
                        }
                    }
                };
                const expectedProperties = [
                    {
                        id: 'boolean',
                        name: 'Boolean',
                        label: 'Boolean',
                        type: 'boolean',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'boolean'
                        }
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get entities for a oneOf type when it has no basic properties', () => {
                const JSONSchema = {
                    oneOf: [
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string'
                                }
                            }
                        },
                        {
                            type: 'object',
                            properties: {
                                second: {
                                    type: 'string'
                                }
                            }
                        }
                    ]
                };
                const expectedProperties = [
                    {
                        id: 'first',
                        name: 'first',
                        label: 'first',
                        type: 'string',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'string'
                        }
                    },
                    {
                        id: 'second',
                        name: 'second',
                        label: 'second',
                        type: 'string',
                        readOnly: false,
                        required: false,
                        model: {
                            type: 'string'
                        }
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get aggregated entity for a oneOf type when it has basic properties', () => {
                const JSONSchema = {
                    oneOf: [
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string'
                                }
                            }
                        },
                        {
                            type: 'integer'
                        }
                    ]
                };
                const expectedProperties = [
                    {
                        id: 'json',
                        name: 'Json',
                        label: 'Json',
                        type: 'json',
                        readOnly: false,
                        required: false,
                        aggregatedTypes: ['json', 'integer']
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });

            it('should get aggregated entity for a oneOf type when it has more than one definition', () => {
                const JSONSchema = {
                    oneOf: [
                        {
                            $ref: '#/$defs/boolean',
                        },
                        {
                            $ref: '#/$defs/integer'
                        }
                    ],
                    $defs: {
                        boolean: {
                            type: 'boolean'
                        },
                        integer: {
                            type: 'integer'
                        }
                    }
                };
                const expectedProperties = [
                    {
                        id: 'json',
                        name: 'Json',
                        label: 'Json',
                        type: 'json',
                        readOnly: false,
                        required: false,
                        aggregatedTypes: ['boolean', 'integer']
                    }
                ];

                const results = service.getEntityPropertiesFromJSONSchema(JSONSchema);

                expect(results).toEqual(expectedProperties);
            });
        });
    });

    it('should get primitive referenced inputs in object properties', () => {
        const model = {
            type: 'object',
            properties: {
                file: {
                    $ref: '#/$defs/primitive/file'
                }
            }
        };

        const expectedProperties = [
            {
                id: 'file',
                name: 'file',
                label: 'file',
                type: 'file',
                readOnly: false,
                required: false,
                model: {
                    $ref: '#/$defs/primitive/file'
                }
            }
        ];

        const results = service.getEntityPropertiesFromJSONSchema(model);

        expect(results).toEqual(expectedProperties);
    });

    it('should get not add the model for json plain inputs', () => {
        const model = {
            type: 'object',
            properties: {
                obj: {
                    $ref: '#/$defs/primitive/json'
                }
            }
        };

        const expectedProperties = [
            {
                id: 'obj',
                name: 'obj',
                label: 'obj',
                type: 'json',
                readOnly: false,
                required: false,
                model: null
            }
        ];

        const results = service.getEntityPropertiesFromJSONSchema(model);

        expect(results).toEqual(expectedProperties);
    });

    it('should aggregate inputs in object properties', () => {
        const model = {
            type: 'object',
            properties: {
                aggregated: {
                    $ref: '#/$defs/primitive/file',
                    type: ['string', 'number']
                }
            }
        };

        const expectedProperties = [
            {
                id: 'aggregated',
                name: 'aggregated',
                label: 'aggregated',
                type: 'json',
                readOnly: false,
                required: false,
                aggregatedTypes: ['string', 'file']
            }
        ];

        const results = service.getEntityPropertiesFromJSONSchema(model);

        expect(results).toEqual(expectedProperties);
    });

    it('should resolve registered inputs in object properties', () => {
        const model = {
            type: 'object',
            properties: {
                employee: {
                    $ref: '#/$defs/primitive/employee'
                }
            }
        };

        const expectedProperties = [
            {
                id: 'employee',
                name: 'employee',
                label: 'employee',
                type: 'employee',
                readOnly: false,
                required: false,
                model: {
                    $ref: '#/$defs/primitive/employee'
                }
            }
        ];

        const results = service.getEntityPropertiesFromJSONSchema(model);

        expect(results).toEqual(expectedProperties);
    });
});
