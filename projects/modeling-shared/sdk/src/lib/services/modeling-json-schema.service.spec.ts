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
import { primitiveTypesSchema } from '../code-editor/services/expression-language/primitive-types-schema';
import { provideModelingJsonSchemaProvider } from './modeling-json-schema-provider.service';
import { exampleJSONSchema, exampleJSONSchemaWithSelfReference } from '../mocks/json-schema.mock';
import { RegisteredInputsModelingJsonSchemaProvider } from './registered-inputs-modeling-json-schema-provider.service';
import { PropertiesViewerStringInputComponent } from '../variables/properties-viewer/value-type-inputs/string-input/string-input.component';
import { PropertiesViewerIntegerInputComponent } from '../variables/properties-viewer/value-type-inputs/integer-input/integer-input.component';
import { PropertiesViewerJsonInputComponent } from '../variables/properties-viewer/value-type-inputs/json-input/json-input.component';
import { take } from 'rxjs/operators';
import { expectedItems } from '../mocks/modeling-json-schema.service.mock';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';

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

    it('should get property items form registered providers', async() => {
        const items = await service.getPropertyTypeItems().pipe(take(1)).toPromise();

        expect(items).toEqual(expectedItems);
    });
});
