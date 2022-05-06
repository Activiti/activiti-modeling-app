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

import { Validators } from '@angular/forms';
import { EntityProperty } from '../api/types';
import { primitive_types } from '../helpers/primitive-types';
import { multipleOfValidator, VariablesService } from './variables.service';

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

    describe('getValidatorsFromModel', () => {

        it('should return empty array when no model provided', () => {
            let validators = service.getValidatorsFromModel(null);
            expect(validators).toEqual([]);

            validators = service.getValidatorsFromModel(undefined);
            expect(validators).toEqual([]);

            validators = service.getValidatorsFromModel({});
            expect(validators).toEqual([]);
        });

        it('should return required validator when required provided', () => {
            const validators = service.getValidatorsFromModel(null, true);
            expect(validators).toEqual([Validators.required]);
        });

        it('should return validators for string', () => {
            const model = {
                type: 'string',
                pattern: '[a-z0-9]+',
                minLength: 8,
                maxLength: 13
            };

            const expectedValidators = [Validators.pattern(model.pattern), Validators.minLength(model.minLength), Validators.maxLength(model.maxLength)];

            const validators = service.getValidatorsFromModel(model);
            expect(JSON.stringify(validators)).toContain(JSON.stringify(expectedValidators));
        });

        it('should return validators for integer', () => {
            const model = {
                minimum: 8,
                maximum: 13,
                multipleOf: 2,
                type: 'integer'
            };

            const expectedValidators = [Validators.min(model.minimum), Validators.max(model.maximum), multipleOfValidator(model.multipleOf)];

            const validators = service.getValidatorsFromModel(model);
            expect(JSON.stringify(validators)).toContain(JSON.stringify(expectedValidators));
        });
    });
});
