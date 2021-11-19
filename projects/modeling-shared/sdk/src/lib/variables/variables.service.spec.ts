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
import { EntityProperty } from '../api/types';
import { primitive_types } from '../helpers/primitive-types';
import { VariablesService } from './variables.service';

describe('VariablesService', () => {
    let service: VariablesService;

    beforeAll(() => {
        service = new VariablesService([
            {
                type: 'myCustomType',
                primitiveType: 'boolean',
                implementationClass: null
            }
        ]);
    });

    describe('getPrimitiveType', () => {
        it('should return itself when it is a primitive type', () => {
            primitive_types.forEach(primitive => expect(service.getPrimitiveType(primitive)).toBe(primitive));
        });

        it('should return json as primitive type when there is not registered primitive for the type', () => {
            expect(service.getPrimitiveType('nonExistingType')).toBe('json');
        });

        it('should return the registered primitive type when it exists', () => {
            expect(service.getPrimitiveType('myCustomType')).toBe('boolean');
        });

        it('should call getPrimitiveType with the type of the variable', () => {
            const spy = spyOn(service, 'getPrimitiveType');
            const variable: EntityProperty = {
                id: 'var-id',
                name: 'var',
                type: 'var-type',
                value: null
            };

            service.getVariablePrimitiveType(variable);

            expect(spy).toHaveBeenCalledWith(variable.type);
        });

        it('should return undefined as primitive type when type is undefined', () => {
            expect(service.getPrimitiveType(undefined)).toBe(undefined);
        });

        it('should return null as primitive type when type is null', () => {
            expect(service.getPrimitiveType(null)).toBe(null);
        });
    });
});
