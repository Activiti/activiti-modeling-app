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

import { FormRendererFieldHasErrorPipe } from './form-renderer-field-has-error.pipe';
import { FormControl, Validators } from '@angular/forms';

describe('FormRendererFieldHasErrorPipe', () => {
    let formRendererFieldHasErrorPipe: FormRendererFieldHasErrorPipe;

    beforeEach(() => {
        formRendererFieldHasErrorPipe = new FormRendererFieldHasErrorPipe();
    });

    it('should return true when form field has error', () => {
       const requiredFormControl = new FormControl('', Validators.required);
       const result = formRendererFieldHasErrorPipe.transform(requiredFormControl, 'required');

       expect(result).toBeTruthy();
    });

    it('should return false when form field does not have error', () => {
        const requiredFormControl = new FormControl('mockValue', Validators.required);
        const result = formRendererFieldHasErrorPipe.transform(requiredFormControl, 'required');

        expect(result).toBeFalsy();
    });

    it('should return false when form field does not have validators', () => {
        const requiredFormControl = new FormControl('mockValue');
        const result = formRendererFieldHasErrorPipe.transform(requiredFormControl, 'required');

        expect(result).toBeFalsy();
    });
});
