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

import { UuidService } from '../../../services/uuid.service';
import { TestBed } from '@angular/core/testing';
import { primitive_types } from '../../../helpers/primitive-types';
import {
    expectedArrayMethodSuggestions,
    expectedArrayPropertiesSuggestions,
    expectedArraySignatureHelpers,
    expectedFunctionsSuggestions,
    expectedPrimitiveTypes
} from '../mocks/primitive-types.mock';
import { ModelingTypesService } from './modeling-types.service';
import { primitiveTypesSchema } from './expression-language/primitive-types-schema';
import { ModelingTypeSignatureHelper } from './modeling-type.model';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { INPUT_TYPE_ITEM_HANDLER } from '../../properties-viewer/value-type-inputs/value-type-inputs';
import { provideModelingJsonSchemaProvider } from '../../../services/modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../services/registered-inputs-modeling-json-schema-provider.service';

describe('ModelingTypesService', () => {
    let service: ModelingTypesService;

    const functions = [
        {
            signature: 'now',
            type: 'date',
            documentation: 'Return the current system date.'
        },
        {
            signature: 'list',
            type: 'array',
            documentation: 'Returns a list containing an arbitrary number of elements.',
            parameters: [
                {
                    label: 'elements',
                    documentation: 'obj: the elements to be contained in the list comma-separated'
                }
            ]
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: UuidService,
                    useValue: {
                        generate: () => 'generated-uuid'
                    }
                },
                ModelingTypesService,
                { provide: TranslationService, useClass: TranslationMock },
                { provide: INPUT_TYPE_ITEM_HANDLER, useValue: [] },
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider)
            ]
        });

        service = TestBed.inject(ModelingTypesService);
    });

    it('should return the methods suggestions', () => {
        const actual = service.getMethodsSuggestionsByModelSchema(primitiveTypesSchema.$defs.primitive['array']);

        expect(actual).toEqual(expectedArrayMethodSuggestions);
    });

    it('should return the properties suggestions', () => {
        const actual = service.getPropertiesSuggestionsByModelSchema(primitiveTypesSchema.$defs.primitive['array']);

        expect(actual).toEqual(expectedArrayPropertiesSuggestions);
    });

    it('should return the signature helpers', () => {
        const actual = service.getSignatureHelperByModelSchema(primitiveTypesSchema.$defs.primitive['array']);

        expect(actual).toEqual(expectedArraySignatureHelpers as ModelingTypeSignatureHelper[]);
    });

    it('should return the type', () => {
        const actual = service.getRegisteredType('array');

        expect(actual).toEqual(expectedPrimitiveTypes.array);
    });

    it('should include a type definition for each primitive type of the application', () => {
        primitive_types.forEach(type => {
            expect(service.getRegisteredType(type)).toBeDefined();
        });
    });

    it('should return the function suggestions', () => {
        const actual = service.getFunctionsSuggestions(functions);

        expect(actual).toEqual(expectedFunctionsSuggestions);
    });

    it('should the execution object has been registered', () => {
        expect(service.getRegisteredType('execution')).toBeDefined();
    });
});
