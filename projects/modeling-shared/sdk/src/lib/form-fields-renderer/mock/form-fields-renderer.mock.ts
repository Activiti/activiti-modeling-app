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

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormRendererField, FormRendererFieldValidator } from '../models/form-renderer-field.interface';

const mockRegex = /^[a-z]([-a-z0-9]{0,24}[a-z0-9])?$/;

export const mockFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(mockRegex)]),
    description: new FormControl('')
});

export const mockRequiredValidator: FormRendererFieldValidator = {
    type: 'required',
    value: true,
    error: 'SDK.FORM_FIELDS_RENDERER.ERROR.REQUIRED'
};

export const mockPatternValidator: FormRendererFieldValidator = {
    type: 'pattern',
    value: mockRegex,
    error: 'fake-pattern-error-message'
};

export const mockFormRendererFields: FormRendererField[] = [
    {
        key: 'name',
        label: 'fake-name',
        type: 'text',
        validators: [
            mockRequiredValidator,
            mockPatternValidator
        ]
    },
    {
        key: 'description',
        label: 'fake-description',
        type: 'textarea'
    }
];

export const mockFormRendererFieldWithoutLabel: FormRendererField[] = [
    {
        key: 'name',
        label: '',
        type: 'text',
        validators: [
            mockRequiredValidator,
            mockPatternValidator
        ]
    }
];

export const mockFormRendererFieldEmptyNumberType: FormRendererField[] = [
    {
        key: 'index',
        label: 'fake-index',
        type: 'number'
    }
];

export const mockFormRendererFieldNumberType: FormRendererField[] = [
    {
        key: 'index',
        label: 'fake-index',
        type: 'number',
        defaultValue: 99
    }
];

export const mockFormRendererFieldsWithDefaultValues: FormRendererField[] = [
    {
        key: 'name',
        label: 'fake-name',
        type: 'text',
        defaultValue: 'fake-default-name',
        validators: [
            mockRequiredValidator,
            mockPatternValidator
        ]
    },
    {
        key: 'description',
        label: 'fake-description',
        type: 'textarea',
        defaultValue: 'fake-default-description'
    }
];
