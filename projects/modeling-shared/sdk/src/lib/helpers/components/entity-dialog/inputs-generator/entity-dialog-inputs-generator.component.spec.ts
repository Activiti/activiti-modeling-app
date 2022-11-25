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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EntityDialogInputsGeneratorComponent } from './entity-dialog-inputs-generator.component';
import { mockFormGroup, mockModelCreatorDialogFields, mockModelCreatorDialogFieldWithoutLabel } from '../mock/entity-dialog.mock';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('EntityDialogInputsGeneratorComponent', () => {
    let component: EntityDialogInputsGeneratorComponent;
    let fixture: ComponentFixture<EntityDialogInputsGeneratorComponent>;

    let nameField: DebugElement;
    let descriptionField: DebugElement;
    let nameControl: AbstractControl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatFormFieldModule,
                ReactiveFormsModule,
                MatInputModule
            ],
            declarations: [EntityDialogInputsGeneratorComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityDialogInputsGeneratorComponent);
        component = fixture.componentInstance;
        component.formGroup = mockFormGroup;
        component.fieldProperty = mockModelCreatorDialogFields;
        fixture.detectChanges();

        nameField = fixture.debugElement.query(By.css('[data-automation-id="ama-model-input-name"]'));
        descriptionField = fixture.debugElement.query(By.css('[data-automation-id="ama-model-input-description"]'));
        nameControl = component.formGroup.get('name');
    });

    it('should render input placeholders', () => {
        expect(nameField.nativeElement.placeholder).toBe('fake-name');
        expect(descriptionField.nativeElement.placeholder).toBe('fake-description');
    });

    it('should render proper input type', () => {
        expect(nameField.nativeElement.type).toBe('text');
        expect(descriptionField.nativeElement.type).toBe('textarea');
    });

    it('should validate pattern', () => {
        nameControl.setValue('valid-name');
        expect(nameControl.valid).toBe(true);

        nameControl.setValue('valid');
        expect(nameControl.valid).toBe(true);

        nameControl.setValue('invalid-name-');
        expect(nameControl.valid).toBe(false);

        nameControl.setValue('invalidName');
        expect(nameControl.valid).toBe(false);

        nameControl.setValue('test-name-length-more-than-twenty-six-characters');
        expect(nameControl.valid).toBe(false);
    });

    it('should validate required', () => {
        expect(nameControl.valid).toBe(false);

        nameControl.setValue('valid');
        expect(nameControl.valid).toBe(true);

        nameControl.setValue('');
        expect(nameControl.valid).toBe(false);
    });

    it('should display required error', () => {
        nameControl.setValue('');
        expect(nameControl.valid).toBe(false);

        nameField.nativeElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        const requiredError = fixture.debugElement.query(By.css('[data-automation-id="ama-error-required-name"]'));
        expect(requiredError).toBeTruthy();
        expect(requiredError.nativeElement.textContent.trim()).toBe('SDK.CREATE_DIALOG.ERROR.REQUIRED');
    });

    it('should display default required error if label is not provided', () => {
        component.fieldProperty = mockModelCreatorDialogFieldWithoutLabel;
        fixture.detectChanges();

        nameControl.setValue('');
        expect(nameControl.valid).toBe(false);

        nameField.nativeElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        const requiredError = fixture.debugElement.query(By.css('[data-automation-id="ama-error-required-name"]'));
        expect(requiredError).toBeTruthy();
        expect(requiredError.nativeElement.textContent.trim()).toBe('SDK.CREATE_DIALOG.ERROR.DEFAULT_REQUIRED');
    });

    it('should display pattern error', () => {
        nameControl.setValue('invalid-');
        expect(nameControl.valid).toBe(false);

        nameField.nativeElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        const patternError = fixture.debugElement.query(By.css('[data-automation-id="ama-error-pattern-name"]'));
        expect(patternError).toBeTruthy();
        expect(patternError.nativeElement.textContent.trim()).toBe('fake-pattern-error-message');
    });
});
