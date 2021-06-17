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

import { UuidService } from '../../services/uuid.service';
import { TestBed } from '@angular/core/testing';
import { primitive_types } from '../../helpers/primitive-types';
import { expectedArrayMethodSuggestions, expectedArrayPropertiesSuggestions, expectedArraySignatureHelpers, expectedPrimitiveTypes } from '../mocks/primitive-types.mock';
import { ModelingTypeSignatureHelper, provideModelingTypeProvider } from './modeling-type-provider.service';
import { ModelingTypesService } from './modeling-types.service';
import { PrimitiveModelingTypesService } from './primitive-modeling-types.service';

describe('ModelingTypesService', () => {
    let service: ModelingTypesService;

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
                provideModelingTypeProvider(PrimitiveModelingTypesService)
            ]
        });

        service = TestBed.inject(ModelingTypesService);
    });

    describe('Memoize', () => {
        // Use toBe to compare same object
        it('should return memoized primitive types', () => {
            const firstCall = service.getModelingTypes();
            const secondCall = service.getModelingTypes();

            expect(secondCall).toBe(firstCall);
        });

        it('should return memoized method suggestions', () => {
            let firstCall = service.getMethodsSuggestionsByType('array');
            let secondCall = service.getMethodsSuggestionsByType('array');

            expect(secondCall).toBe(firstCall);

            firstCall = service.getMethodsSuggestionsByType('string');
            secondCall = service.getMethodsSuggestionsByType('date');

            expect(secondCall).not.toEqual(firstCall);
        });

        it('should return memoized properties suggestions', () => {
            let firstCall = service.getPropertiesSuggestionsByType('array');
            let secondCall = service.getPropertiesSuggestionsByType('array');

            expect(secondCall).toBe(firstCall);

            firstCall = service.getPropertiesSuggestionsByType('string');
            secondCall = service.getPropertiesSuggestionsByType('folder');

            expect(secondCall).not.toEqual(firstCall);
        });

        it('should return memoized signature helpers', () => {
            let firstCall = service.getSignatureHelperByType('array');
            let secondCall = service.getSignatureHelperByType('array');

            expect(secondCall).toBe(firstCall);

            firstCall = service.getSignatureHelperByType('string');
            secondCall = service.getSignatureHelperByType('date');

            expect(secondCall).not.toEqual(firstCall);
        });

        it('should return memoized type', () => {
            let firstCall = service.getType('array');
            let secondCall = service.getType('array');

            expect(secondCall).toBe(firstCall);

            firstCall = service.getType('string');
            secondCall = service.getType('date');

            expect(secondCall).not.toEqual(firstCall);
        });
    });

    it('should return the primitive modeling types', () => {
        const actual = service.getModelingTypes();

        expect(actual).toEqual(expectedPrimitiveTypes);
    });

    it('should return the methods suggestions', () => {
        const actual = service.getMethodsSuggestionsByType('array');

        expect(actual).toEqual(expectedArrayMethodSuggestions);
    });

    it('should return the properties suggestions', () => {
        const actual = service.getPropertiesSuggestionsByType('array');

        expect(actual).toEqual(expectedArrayPropertiesSuggestions);
    });

    it('should return the signature helpers', () => {
        const actual = service.getSignatureHelperByType('array');

        expect(actual).toEqual(expectedArraySignatureHelpers as ModelingTypeSignatureHelper[]);
    });

    it('should return the type', () => {
        const actual = service.getType('array');

        expect(actual).toEqual(expectedPrimitiveTypes.array);
    });

    it('should include a type definition for each primitive type of the application', () => {
        const registeredTypes = service.getModelingTypes();

        primitive_types.forEach(type => {
            expect(registeredTypes[type].id).toEqual(type);
        });
    });
});
