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
import { ModelFieldProperty } from '../../../../interfaces/model-creator.interface';
import { MODELER_NAME_REGEX } from '../../../utils/create-entries-names';

export const mockModelCreatorDialogFields: ModelFieldProperty[] = [
    {
        key: 'name',
        label: 'fake-name',
        type: 'text',
        validators: [
            {
                type: 'required',
                value: true,
                error: 'SDK.CREATE_DIALOG.ERROR.REQUIRED'
            },
            {
                type: 'pattern',
                value: MODELER_NAME_REGEX,
                error: 'fake-pattern-error-message'
            }
        ]
    },
    {
        key: 'description',
        label: 'fake-description',
        type: 'textarea'
    }
];

export const mockModelCreatorDialogFieldWithoutLabel: ModelFieldProperty[] = [
    {
        key: 'name',
        label: '',
        type: 'text',
        validators: [
            {
                type: 'required',
                value: true,
                error: 'SDK.CREATE_DIALOG.ERROR.REQUIRED'
            },
            {
                type: 'pattern',
                value: MODELER_NAME_REGEX,
                error: 'fake-pattern-error-message'
            }
        ]
    }
];

export const mockFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(MODELER_NAME_REGEX)]),
    description: new FormControl('')
});

export const mockValuesProperty = { id: 'fake-values-id', name: 'fake-values-name', description: 'fake-values-description' };
