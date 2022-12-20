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

import { FormRendererFieldErrorMessagePipe } from './form-renderer-field-error-message.pipe';
import { TestBed } from '@angular/core/testing';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { mockPatternValidator, mockRequiredValidator } from '../mock/form-fields-renderer.mock';

describe('FormRendererFieldErrorMessagePipe', () => {
    let formRendererFieldErrorMessagePipe: FormRendererFieldErrorMessagePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [FormRendererFieldErrorMessagePipe],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                FormRendererFieldErrorMessagePipe
            ]
        });
        formRendererFieldErrorMessagePipe = TestBed.inject(FormRendererFieldErrorMessagePipe);
    });

    it('should return default required error message for required validator when no label is defined', () => {
       const result = formRendererFieldErrorMessagePipe.transform('', mockRequiredValidator);

        expect(result).toEqual('SDK.FORM_FIELDS_RENDERER.ERROR.DEFAULT_REQUIRED');
    });

    it('should return required validation message for required validator when label is defined', () => {
        const result = formRendererFieldErrorMessagePipe.transform('mockLabel', mockRequiredValidator);

        expect(result).toEqual('SDK.FORM_FIELDS_RENDERER.ERROR.REQUIRED');
    });

    it('should return validation error message when validator has error', () => {
        const result = formRendererFieldErrorMessagePipe.transform('mockLabel', mockPatternValidator);

        expect(result).toEqual('fake-pattern-error-message');
    });

    it('should return empty string when there is no validator', () => {
        const result = formRendererFieldErrorMessagePipe.transform('mockLabel', null);

        expect(result).toEqual('');
    });
});
