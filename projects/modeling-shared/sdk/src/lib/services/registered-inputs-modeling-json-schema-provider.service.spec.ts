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
import { primitiveTypesSchema } from '../code-editor/services/expression-language/primitive-types-schema';
import { PropertiesViewerBooleanInputComponent } from '../variables/properties-viewer/value-type-inputs/boolean-input.component';
import { PropertiesViewerIntegerInputComponent } from '../variables/properties-viewer/value-type-inputs/integer-input/integer-input.component';
import { PropertiesViewerStringInputComponent } from '../variables/properties-viewer/value-type-inputs/string-input/string-input.component';
import { provideInputTypeItemHandler } from '../variables/properties-viewer/value-type-inputs/value-type-inputs';
import { provideModelingJsonSchemaProvider } from './modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from './registered-inputs-modeling-json-schema-provider.service';

describe('RegisteredInputsModelingJsonSchemaProvider', () => {
    let service: RegisteredInputsModelingJsonSchemaProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideInputTypeItemHandler('integer', PropertiesViewerIntegerInputComponent),
                provideInputTypeItemHandler('boolean', PropertiesViewerBooleanInputComponent),
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider)
            ]
        });

        service = TestBed.inject(RegisteredInputsModelingJsonSchemaProvider);
    });

    it('should return inputs schemas', async () => {
        const projectId = null;
        const jsonSchemas = await service.initializeModelingJsonSchemasForProject(projectId).toPromise();
        expect(jsonSchemas).toEqual([
            {
                projectId,
                typeId: ['string'],
                schema: primitiveTypesSchema.$defs.primitive.string
            },
            {
                projectId,
                typeId: ['integer'],
                schema: primitiveTypesSchema.$defs.primitive.integer
            },
            {
                projectId,
                typeId: ['boolean'],
                schema: primitiveTypesSchema.$defs.primitive.boolean
            }
        ]);
    });
});
