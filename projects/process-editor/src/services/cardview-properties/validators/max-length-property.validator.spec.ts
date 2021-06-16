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

import { MaxLengthPropertyValidator } from './max-length-property.validator';

describe('Max length property validator', () => {
    it('should validate a value', () => {
        const validator = new MaxLengthPropertyValidator(5, 'error');
        expect(validator.isValid('12345')).toBe(true);
        expect(validator.isValid('1235')).toBe(true);
        expect(validator.isValid('123556')).toBe(false);
    });
});
