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

export const mockFormGroupWithNumberField: FormGroup = new FormGroup({
    index: new FormControl(99, [Validators.min(90), Validators.max(100)])
});

export const mockFormGroupWithDropdownField: FormGroup = new FormGroup({
    drink: new FormControl(2)
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

export const mockMinValidator: FormRendererFieldValidator = {
    type: 'min',
    value: 90,
    error: 'fake-min-error-message'
};

export const mockMaxValidator: FormRendererFieldValidator = {
    type: 'max',
    value: 100,
    error: 'fake-max-error-message'
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

export const mockFormRendererTextFieldWithIncorrectPattern: FormRendererField[] = [
    {
        key: 'name',
        label: '',
        type: 'text',
        validators: [
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

export const mockFormRendererFieldDropdownType: FormRendererField[] = [
    {
        key: 'drink',
        label: 'Choose mock drink item',
        type: 'dropdown',
        options: [
            { label: 'No drink', value: undefined },
            { label: 'Coca cola', value: 1 },
            { label: 'Orange juice', value: 2 },
            { label: 'Lemonade', value: 3 }
        ]
    }
];

export const mockFormRendererFieldDropdownGroupType: FormRendererField[] = [
    {
        key: 'drink',
        label: 'Choose mock drink item',
        type: 'dropdown',
        options: [
            { label: 'No drink', value: undefined }
        ],
        groupOptions: [
            {
                label: 'Soft drinks',
                options: [
                    { label: 'Coca cola', value: 1 },
                    { label: 'Sprite', value: 2 }
                ]
            },
            {
                label: 'Still drinks',
                options: [
                    { label: 'Orange juice', value: 3 },
                    { label: 'Lemonade', value: 4 }
                ]
            }
        ]
    }
];

export const mockFormRendererFieldDropdownTypeWithDefaultValue: FormRendererField[] = [
    {
        key: 'drink',
        label: 'Choose mock drink item',
        type: 'dropdown',
        defaultValue: 2,
        options: [
            { label: 'No drink', value: undefined },
            { label: 'Coca cola', value: 1 },
            { label: 'Orange juice', value: 2 },
            { label: 'Lemonade', value: 3 }
        ]
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

export const mockFormRendererFieldNumberTypeWithMinMaxValidators: FormRendererField[] = [
    {
        key: 'index',
        label: 'fake-index',
        type: 'number',
        defaultValue: 99,
        validators: [
            mockMinValidator,
            mockMaxValidator
        ]
    }
];

export const mockFormRendererFieldsWithNullDefaultValues: FormRendererField[] = [
    {
        key: 'name',
        label: 'Mock name',
        type: 'text',
        defaultValue: null
    },
    {
        key: 'height',
        label: 'Mock height',
        type: 'number',
        defaultValue: null
    },
    {
        key: 'isStudent',
        label: 'Mock is student',
        type: 'dropdown',
        defaultValue: null,
        options: [
            {
                label: 'Yes',
                value: true
            },
            {
                label: 'No',
                value: false
            }
        ]
    },
];
