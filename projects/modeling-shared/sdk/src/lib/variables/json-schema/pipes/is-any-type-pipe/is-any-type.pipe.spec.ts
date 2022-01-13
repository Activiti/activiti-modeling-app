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

import { IsAnyTypePipe } from './is-any-type.pipe';

describe('IsAnyTypePipe', () => {

    let pipe: IsAnyTypePipe;

    let types: string[];

    beforeEach(() => {
        pipe = new IsAnyTypePipe();
    });

    describe('single type', () => {

        beforeEach(() => {
            types = ['string'];
        });

        it('every matching type', () => {
            expect(pipe.transform(types, 'string')).toBeTruthy();
        });

        it('none matching types', () => {
            expect(pipe.transform(types, 'number')).toBeFalsy();
            expect(pipe.transform(types, 'object')).toBeFalsy();
            expect(pipe.transform(types, 'enum')).toBeFalsy();
            expect(pipe.transform(types, 'ref')).toBeFalsy();
            expect(pipe.transform(types, 'anyOf')).toBeFalsy();
            expect(pipe.transform(types, 'allOf')).toBeFalsy();
            expect(pipe.transform(types, 'oneOf')).toBeFalsy();
            expect(pipe.transform(types, 'array')).toBeFalsy();
        });

        it('any matching types', () => {
            expect(pipe.transform(types, 'string', 'number')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'object')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'enum')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'ref')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'anyOf')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'allOf')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'oneOf')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'array')).toBeTruthy();
        });
    });

    describe('multiple type', () => {

        beforeEach(() => {
            types = ['string', 'number', 'object'];
        });

        it('every matching type', () => {
            expect(pipe.transform(types, 'string', 'number', 'object')).toBeTruthy();
        });

        it('none matching types', () => {
            expect(pipe.transform(types, 'enum')).toBeFalsy();
            expect(pipe.transform(types, 'ref')).toBeFalsy();
            expect(pipe.transform(types, 'anyOf')).toBeFalsy();
            expect(pipe.transform(types, 'allOf')).toBeFalsy();
            expect(pipe.transform(types, 'oneOf')).toBeFalsy();
            expect(pipe.transform(types, 'array')).toBeFalsy();
        });

        it('any matching types', () => {
            expect(pipe.transform(types, 'string', 'number')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'object')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'enum')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'ref')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'anyOf')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'allOf')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'oneOf')).toBeTruthy();
            expect(pipe.transform(types, 'string', 'array')).toBeTruthy();
        });
    });
});
