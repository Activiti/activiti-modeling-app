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
import { ModelingJSONSchemaService } from './modeling-json-schema.service';
import { PropertiesViewerBooleanInputComponent } from '../variables/properties-viewer/value-type-inputs/boolean-input.component';
import { provideInputTypeItemHandler } from '../variables/properties-viewer/value-type-inputs/value-type-inputs';
import { provideModelingJsonSchemaProvider } from './modeling-json-schema-provider.service';
import { exampleJSONSchema, exampleJSONSchemaWithSelfReference } from '../mocks/json-schema.mock';
import { RegisteredInputsModelingJsonSchemaProvider } from './registered-inputs-modeling-json-schema-provider.service';
import { PropertiesViewerStringInputComponent } from '../variables/properties-viewer/value-type-inputs/string-input/string-input.component';
import { PropertiesViewerIntegerInputComponent } from '../variables/properties-viewer/value-type-inputs/integer-input/integer-input.component';
import { PropertiesViewerJsonInputComponent } from '../variables/properties-viewer/value-type-inputs/json-input/json-input.component';
import { first, take } from 'rxjs/operators';
import { expectedItems } from '../mocks/modeling-json-schema.service.mock';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { EntityProperty } from '../api/types';
import { primitiveTypesSchema } from '../variables/expression-code-editor/services/expression-language/primitive-types-schema';

describe('ModelingJSONSchemaService', () => {
    let service: ModelingJSONSchemaService;
    let codeService: CodeEditorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideInputTypeItemHandler('integer', PropertiesViewerIntegerInputComponent),
                provideInputTypeItemHandler('boolean', PropertiesViewerBooleanInputComponent),
                provideInputTypeItemHandler('employee', PropertiesViewerJsonInputComponent, 'json', exampleJSONSchema),
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider)
            ]
        });

        service = TestBed.inject(ModelingJSONSchemaService);
        codeService = TestBed.inject(CodeEditorService);
    });

    describe('project schema', () => {
        beforeEach(() => {
            service.initializeProjectSchema('test');
        });

        it('should initialize the project schema URI', () => {
            const projectSchemaUri = service.getProjectSchemaUri();

            expect(projectSchemaUri).toEqual('test://json:*');
        });

        it('should register project schema in code editor', () => {
            const projectSchemaUri = service.getProjectSchemaUri();

            expect(codeService.getSchema(projectSchemaUri)).toBeDefined();
        });

        it('should retrieve project schema', () => {
            service.initializeProjectSchema('second');
            service.registerTypeModel(['path', 'to', 'type'], exampleJSONSchema, 'second', true);

            const projectSchemaUri = service.getProjectSchemaUri('second');

            expect(projectSchemaUri).toEqual('second://json:*');
            expect(codeService.getSchema(projectSchemaUri)).toEqual({
                $id: projectSchemaUri,
                $defs: {
                    primitive: { ...primitiveTypesSchema.$defs.primitive, employee: exampleJSONSchema },
                    path: {
                        to: {
                            type: exampleJSONSchema
                        }
                    }
                }
            });
        });

        it('should retrieve schema from project reference', () => {
            service.registerTypeModel(['path', 'to', 'type'], exampleJSONSchema);

            const schema = service.getSchemaFromReference('#/$defs/path/to/type');

            expect(schema).toEqual(exampleJSONSchema);
        });

        it('should retrieve schema from registered inputs', () => {
            const schema = service.getSchemaFromReference(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH + '/employee');

            expect(schema).toEqual(exampleJSONSchema);
        });

        it('should fix schema references for registered types', () => {
            service.registerTypeModel(['path', 'to', 'type'], exampleJSONSchemaWithSelfReference);

            const schema = service.getSchemaFromReference('#/$defs/path/to/type');

            expect(schema.properties.company.$ref).not.toEqual(exampleJSONSchemaWithSelfReference.properties.company.$ref);
            expect(schema.properties.company.$ref).toEqual('#/$defs/path/to/type/definitions/company');
        });
    });

    it('should retrieve schema from given schema', () => {
        service.registerTypeModel(['path', 'to', 'type'], exampleJSONSchema);

        const schema = service.getSchemaFromReference('#/$defs/path/to/type', { ...exampleJSONSchema, $defs: { path: { to: { type: { type: 'string' } } } } });

        expect(schema).toEqual({ type: 'string' });
    });

    it('should get property items form registered providers', async () => {
        const items = await service.getPropertyTypeItems().pipe(take(1)).toPromise();

        expect(items).toEqual(expectedItems);
    });

    it('should get the primitive type used in mapping from a type represented as string', () => {
        expect(service.getMappingPrimitiveTypeForString('string')).toEqual('string');
        expect(service.getMappingPrimitiveTypeForString('integer')).toEqual('integer');
        expect(service.getMappingPrimitiveTypeForString('boolean')).toEqual('boolean');
        expect(service.getMappingPrimitiveTypeForString('employee')).toEqual('json');
        expect(service.getMappingPrimitiveTypeForString('non-existing')).toEqual('json');
    });

    describe('should get the primitive type used in mapping from an entity property', () => {
        it('the entity property does not have a model', () => {
            const property: EntityProperty = {
                id: 'test',
                name: 'test',
                type: 'string'
            };

            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, type: 'string' })).toEqual(['string']);
            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, type: 'integer' })).toEqual(['integer']);
            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, type: 'boolean' })).toEqual(['boolean']);
            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, type: 'employee' })).toEqual(['json']);
            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, type: 'non-existing' })).toEqual(['json']);
        });

        it('the entity property has one type in the model', () => {
            const property: EntityProperty = {
                id: 'test',
                name: 'test',
                type: undefined,
                model: {
                    $ref: '#/$defs/primitive/string'
                }
            };

            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property })).toEqual(['string']);
            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, model: { $ref: '#/$defs/primitive/integer' } })).toEqual(['integer']);
            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, model: { $ref: '#/$defs/primitive/boolean' } })).toEqual(['boolean']);
            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, model: { $ref: '#/$defs/primitive/employee' } })).toEqual(['json']);
            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property, model: { $ref: '#/$defs/primitive/non-existing' } })).toEqual(['json']);
        });

        it('the entity property has two types in the model', () => {
            const property: EntityProperty = {
                id: 'test',
                name: 'test',
                type: undefined,
                model: {
                    type: ['string', 'boolean']
                }
            };

            expect(service.getMappingPrimitiveTypeForEntityProperty({ ...property })).toEqual(['string', 'boolean']);
        });
    });

    it('should return if a variable matches the filter types', () => {
        const property: EntityProperty = {
            id: 'test',
            name: 'test',
            type: undefined,
            model: {
                type: ['string', 'boolean']
            }
        };

        expect(service.variableMatchesTypeFilter(property, ['string'])).toBeTruthy();
        expect(service.variableMatchesTypeFilter(property, ['boolean'])).toBeTruthy();
        expect(service.variableMatchesTypeFilter(property, ['string', 'boolean'])).toBeTruthy();
        expect(service.variableMatchesTypeFilter(property, ['integer', 'json'])).toBeFalsy();
        expect(service.variableMatchesTypeFilter(property, [])).toBeFalsy();
    });

    describe('flat schema reference', () => {
        let model;

        beforeEach(() => {
            service.initializeProjectSchema('test');
            model = {
                $ref: '#/$defs/primitive/employee'
            };
        });

        it('do not flat primitive types', () => {
            expect(service.flatSchemaReference(model, true)).toEqual(exampleJSONSchema);
        });

        it('flat primitive types', () => {
            expect(service.flatSchemaReference(model)).toEqual(model);
        });

        it('multiple modeling types', () => {
            model = {
                type: ['boolean', 'string'],
                $ref: '#/$defs/primitive/employee'
            };

            expect(service.flatSchemaReference(model, true)).toEqual({
                type: ['boolean', 'string'],
                allOf: [exampleJSONSchema]
            });
        });

        it('do not flat date and datetime types', () => {
            expect(service.flatSchemaReference({ $ref: '#/$defs/primitive/date' })).toEqual({ $ref: '#/$defs/primitive/date' });
            expect(service.flatSchemaReference({ $ref: '#/$defs/primitive/date' }, true)).toEqual({ $ref: '#/$defs/primitive/date' });
            expect(service.flatSchemaReference({ $ref: '#/$defs/primitive/datetime' })).toEqual({ $ref: '#/$defs/primitive/datetime' });
            expect(service.flatSchemaReference({ $ref: '#/$defs/primitive/datetime' }, true)).toEqual({ $ref: '#/$defs/primitive/datetime' });
        });

    });

    describe('get primitive types', () => {

        it('get types from multiple model', () => {
            const model = {
                type: ['boolean', 'string'],
                $ref: '#/$defs/primitive/employee',
                enum: [1, 2, 3]
            };

            expect(service.getPrimitiveTypes(model)).toEqual(['json', 'boolean', 'string']);
        });

        it('get types from simple json models', () => {
            expect(service.getPrimitiveTypes({ type: 'boolean' })).toEqual(['boolean']);
            expect(service.getPrimitiveTypes({ type: 'string' })).toEqual(['string']);
            expect(service.getPrimitiveTypes({ type: 'integer' })).toEqual(['integer']);
            expect(service.getPrimitiveTypes({ type: 'array' })).toEqual(['array']);
            expect(service.getPrimitiveTypes({ type: 'number' })).toEqual(['string']);
            expect(service.getPrimitiveTypes({ type: 'object' })).toEqual(['json']);
        });

        it('return json by default', () => {
            expect(service.getPrimitiveTypes(null)).toEqual(['json']);
            expect(service.getPrimitiveTypes(undefined)).toEqual(['json']);
            expect(service.getPrimitiveTypes({})).toEqual(['json']);
            expect(service.getPrimitiveTypes({ type: 'non-existing' })).toEqual(['json']);
        });
    });

    it('should notify schemaChanges when provider schemas changes', async () => {
        const notification = await service.schemasChanged$.pipe(first()).toPromise();

        const expectedNotification = [
            {
                projectId: null,
                schema: {
                    type: 'string',
                },
                typeId: ['string']
            },
            {
                projectId: null,
                schema: {
                    type: 'integer',
                },
                typeId: ['integer']
            },
            {
                projectId: null,
                schema: {
                    type: 'boolean',
                },
                typeId: ['boolean']
            },
            {
                projectId: null,
                schema: exampleJSONSchema,
                typeId: ['employee']
            }
        ];

        expect(notification).toEqual(expectedNotification);
    });

    it('should return execution as modeling type when is type is execution', () => {
        expect(service.getModelingTypeFromJSONSchemaType('execution')).toEqual('execution');
    });

    it('should return execution as primitive type when is type is execution', () => {
        expect(service.getPrimitiveTypes({ type: 'execution' })).toEqual(['execution']);
    });
});
