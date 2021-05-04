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
import { primitive_types } from '../../helpers/primitive-types';
import { expectedArrayMethodSuggestions, expectedArrayPropertiesSuggestions, expectedArraySignatureHelpers, expectedPrimitiveTypes } from '../mocks/primitive-types.mock';
import { ModelingTypeSignatureHelper, PrimitiveModelingTypesService } from './primitive-modeling-types.service';

describe('PrimitiveModelingTypesService', () => {
    let service: PrimitiveModelingTypesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PrimitiveModelingTypesService]
        });

        service = TestBed.inject(PrimitiveModelingTypesService);
    });

    describe('Memoize', () => {
        // Use toBe to compare same object
        it('should return memoized primitive types', () => {
            const firstCall = service.getPrimitiveModelingTypes();
            const secondCall = service.getPrimitiveModelingTypes();

            expect(secondCall).toBe(firstCall);
        });

        it('should return memoized method suggestions', () => {
            const firstCall = service.getMethodsSuggestionsByType('array');
            const secondCall = service.getMethodsSuggestionsByType('array');

            expect(secondCall).toBe(firstCall);
        });

        it('should return memoized properties suggestions', () => {
            const firstCall = service.getPropertiesSuggestionsByType('array');
            const secondCall = service.getPropertiesSuggestionsByType('array');

            expect(secondCall).toBe(firstCall);
        });

        it('should return memoized signature helpers', () => {
            const firstCall = service.getSignatureHelperByType('array');
            const secondCall = service.getSignatureHelperByType('array');

            expect(secondCall).toBe(firstCall);
        });

        it('should return memoized type', () => {
            const firstCall = service.getType('array');
            const secondCall = service.getType('array');

            expect(secondCall).toBe(firstCall);
        });
    });

    it('should return the primitive modeling types', () => {
        const actual = service.getPrimitiveModelingTypes();

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
        const registeredTypes = service.getPrimitiveModelingTypes();

        primitive_types.forEach(type => {
            expect(registeredTypes[type].id).toEqual(type);
        });
    });
});
