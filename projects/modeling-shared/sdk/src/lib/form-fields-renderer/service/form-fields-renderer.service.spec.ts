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
import { FormFieldsRendererService } from '../service/form-fields-renderer.service';
import {
    mockFormRendererFieldDropdownType,
    mockFormRendererFieldDropdownTypeWithDefaultValue,
    mockFormRendererFieldEmptyNumberType,
    mockFormRendererFieldNumberType,
    mockFormRendererFields,
    mockFormRendererFieldsWithDefaultValues,
    mockFormRendererFieldsWithNullDefaultValues
} from '../mock/form-fields-renderer.mock';

describe('FormFieldsRendererService', () => {
    let service: FormFieldsRendererService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FormFieldsRendererService,
                FormBuilder
            ]
        });

        service = TestBed.inject(FormFieldsRendererService);
    });

    it('should create formGroup based on model schema', () => {
        const formGroup = service.createForm(mockFormRendererFields);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls.length).toEqual(mockFormRendererFields.length);
    });

    it('should create a formControl with validator', () => {
        const formGroup = service.createForm(mockFormRendererFields);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].hasValidator(Validators.required)).toBe(true);
    });

    it('should create a formControl with string value if default value is provided', () => {
        const formGroup = service.createForm(mockFormRendererFieldsWithDefaultValues);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe('fake-default-name');
        expect(formGroupControls[1].value).toBe('fake-default-description');
    });

    it('should create a formControl with empty string if default value is NOT provided', () => {
        const formGroup = service.createForm(mockFormRendererFields);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe('');
        expect(formGroupControls[1].value).toBe('');
    });

    it('should create a formControl with number value if default value is provided', () => {
        const formGroup = service.createForm(mockFormRendererFieldNumberType);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe(99);
    });

    it('should create a formControl with default number (0) if default value is NOT provided', () => {
        const formGroup = service.createForm(mockFormRendererFieldEmptyNumberType);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe(0);
    });

    it('should create a formControl with dropdown default value if default value is provided', () => {
        const formGroup = service.createForm(mockFormRendererFieldDropdownTypeWithDefaultValue);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe(2);
    });

    it('should create a formControl with default value (null) if default value is NOT provided', () => {
        const formGroup = service.createForm(mockFormRendererFieldDropdownType);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroup).toBeDefined();
        expect(formGroupControls[0].value).toBe(null);
    });

    it('should apply default values only in case of undefined (null and empty are valid values and should not be rolled back to default)', () => {
        const formGroup = service.createForm(mockFormRendererFieldsWithNullDefaultValues);
        const formGroupControls = Object.values(formGroup.controls);

        expect(formGroupControls[0].value).toBe(null);
        expect(formGroupControls[1].value).toBe(null);
        expect(formGroupControls[2].value).toBe(null);
    });
});
