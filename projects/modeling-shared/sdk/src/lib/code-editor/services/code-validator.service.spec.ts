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
import { CodeValidatorService } from './code-validator.service';

describe('CodeValidatorService', () => {
    let service: CodeValidatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CodeValidatorService]
        });

        service = TestBed.inject(CodeValidatorService);
    });

    it('should return proper erratic validation response when SYNTACTICALLY WRONG json is present', () => {
        const jsonString = '{ "mistyped": json ';

        const validationResponse = service.validateJson(jsonString);

        expect(validationResponse.json).toBe(null);
        expect(validationResponse.valid).toBe(false);
        expect(validationResponse.error).toBe('APP.GENERAL.ERRORS.NOT_VALID_JSON');
    });
});
