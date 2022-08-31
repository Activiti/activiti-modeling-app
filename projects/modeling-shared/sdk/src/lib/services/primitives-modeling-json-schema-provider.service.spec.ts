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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { primitiveTypesSchema } from '../variables/expression-code-editor/services/expression-language/primitive-types-schema';
import { expectedPrimitivesInputsItems } from '../mocks/modeling-json-schema.service.mock';
import { PropertiesViewerBooleanInputComponent } from '../variables/properties-viewer/value-type-inputs/boolean-input.component';
import { provideInputTypeItemHandler } from '../variables/properties-viewer/value-type-inputs/value-type-inputs';
import { provideModelingJsonSchemaProvider } from './modeling-json-schema-provider.service';
import { PrimitivesModelingJsonSchemaProvider } from './primitives-modeling-json-schema-provider.service';
import { PropertiesViewerStringInputComponent } from '../variables/properties-viewer/value-type-inputs/string-input/string-input.component';
import { PropertiesViewerIntegerInputComponent } from '../variables/properties-viewer/value-type-inputs/integer-input/integer-input.component';
import { PropertiesViewerJsonInputComponent } from '../variables/properties-viewer/value-type-inputs/json-input/json-input.component';
import { PropertyTypeItem } from '../variables/properties-viewer/property-type-item/models';
const cloneDeep = require('lodash/cloneDeep');

describe('PrimitivesModelingJsonSchemaProvider', () => {
    let service: PrimitivesModelingJsonSchemaProvider;

    const projectId = null;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideInputTypeItemHandler('integer', PropertiesViewerIntegerInputComponent),
                provideInputTypeItemHandler('boolean', PropertiesViewerBooleanInputComponent),
                provideInputTypeItemHandler('json', PropertiesViewerJsonInputComponent),
                provideModelingJsonSchemaProvider(PrimitivesModelingJsonSchemaProvider)
            ]
        });

        service = TestBed.inject(PrimitivesModelingJsonSchemaProvider);
    });

    it('should return inputs schemas', async () => {
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
            },
            {
                projectId,
                typeId: ['json'],
                schema: primitiveTypesSchema.$defs.primitive.json
            }
        ]);
    });

    it('should get property items form registered providers', async () => {
        const items = await service.getPropertyTypeItems(projectId).pipe(take(1)).toPromise();

        const expectedResult = removeValueFromPropertyItems(cloneDeep(expectedPrimitivesInputsItems));

        expect(items).toEqual(expectedResult);
    });
});

function removeValueFromPropertyItems(item: PropertyTypeItem): PropertyTypeItem {
    delete item.value;
    if (item.children) {
        item.children.forEach(child => removeValueFromPropertyItems(child));
    }
    return item;
}
