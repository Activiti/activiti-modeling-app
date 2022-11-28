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
import { FormBuilder, Validators } from '@angular/forms';
import {
    mockModelCreatorDialogFieldEmptyNumberType,
    mockModelCreatorDialogFieldNumberType,
    mockModelCreatorDialogFields,
    mockModelCreatorDialogFieldsWithDefaultValues
} from '../mock/entity-dialog.mock';
import { EntityDialogContentFormService } from './entity-dialog-content-form.service';

describe('EntityDialogContentFormService', () => {
    let service: EntityDialogContentFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EntityDialogContentFormService, FormBuilder]
        });

        service = TestBed.inject(EntityDialogContentFormService);
    });

    it('should create formGroup based on model schema', () => {
        const formGroup = service.createForm(mockModelCreatorDialogFields);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls.length).toEqual(mockModelCreatorDialogFields.length);
    });

    it('should create a formControl with validator', () => {
        const formGroup = service.createForm(mockModelCreatorDialogFields);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].hasValidator(Validators.required)).toBe(true);
    });

    it('should create a formControl with string value if default value is provided', () => {
        const formGroup = service.createForm(mockModelCreatorDialogFieldsWithDefaultValues);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe('fake-default-name');
        expect(formGroupControls[1].value).toBe('fake-default-description');
    });

    it('should create a formControl with empty string if default value is NOT provided', () => {
        const formGroup = service.createForm(mockModelCreatorDialogFields);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe('');
        expect(formGroupControls[1].value).toBe('');
    });

    it('should create a formControl with number value if default value is provided', () => {
        const formGroup = service.createForm(mockModelCreatorDialogFieldNumberType);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe(99);
    });

    it('should create a formControl with default number (0) if default value is NOT provided', () => {
        const formGroup = service.createForm(mockModelCreatorDialogFieldEmptyNumberType);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe(0);
    });
});
