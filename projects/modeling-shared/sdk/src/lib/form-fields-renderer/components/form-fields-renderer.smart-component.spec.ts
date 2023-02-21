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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { DebugElement, SimpleChange } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldsRendererSmartComponent } from './form-fields-renderer.smart-component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldsRendererService } from '../service/form-fields-renderer.service';
import {
    mockFormGroup,
    mockFormGroupWithDropdownField,
    mockFormGroupWithNumberField,
    mockFormRendererFieldDropdownGroupType,
    mockFormRendererFieldDropdownType,
    mockFormRendererFieldNumberTypeWithMinMaxValidators,
    mockFormRendererFields,
    mockFormRendererFieldWithoutLabel,
    mockFormRendererTextFieldWithIncorrectPattern
} from '../mock/form-fields-renderer.mock';
import { FormRendererFieldHasErrorPipe } from '../pipes/form-renderer-field-has-error.pipe';
import { FormRendererFieldErrorMessagePipe } from '../pipes/form-renderer-field-error-message.pipe';
import { MatSelectModule } from '@angular/material/select';

describe('FormFieldsRendererSmartComponent', () => {
    let component: FormFieldsRendererSmartComponent;
    let fixture: ComponentFixture<FormFieldsRendererSmartComponent>;
    let defaultDebounceTime: number;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatFormFieldModule,
                ReactiveFormsModule,
                MatInputModule,
                MatSelectModule,
                FormsModule
            ],
            declarations: [
                FormFieldsRendererSmartComponent,
                FormRendererFieldHasErrorPipe,
                FormRendererFieldErrorMessagePipe
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                FormBuilder,
                FormFieldsRendererService,
                FormRendererFieldHasErrorPipe,
                FormRendererFieldErrorMessagePipe
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormFieldsRendererSmartComponent);
        component = fixture.componentInstance;
        defaultDebounceTime = component.formDebounceTime;
    });

    it('should emit loading state', fakeAsync(() => {
        component.formGroup = mockFormGroup;
        component.formFields = mockFormRendererFields;
        fixture.detectChanges();

        const loadingStateSpy = spyOn(component.loadingState, 'emit');
        component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererFields, false) });

        const nameControl: AbstractControl = component.formGroup.get('name');
        nameControl.setValue('new-value');

        tick(defaultDebounceTime - 50);
        expect(loadingStateSpy).toHaveBeenCalledWith(true);

        tick(50);
        expect(loadingStateSpy).toHaveBeenCalledWith(false);
        expect(loadingStateSpy).toHaveBeenCalledTimes(2);
    }));

    describe('text field', () => {
        let nameField: DebugElement;
        let nameControl: AbstractControl;

        beforeEach(() => {
            component.formGroup = mockFormGroup;
            component.formFields = mockFormRendererFields;
            fixture.detectChanges();

            nameField = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-input-name"]'));
            nameControl = component.formGroup.get('name');
        });

        it('should display text field', () => {
            expect(nameField).toBeTruthy();
            expect(nameField.nativeElement.placeholder).toBe('fake-name');
            expect(nameField.nativeElement.type).toBe('text');
            expect(nameField.nativeElement.value).toBe('');
        });

        it('should validate pattern', () => {
            const validationChangesSpy = spyOn(component.validationChanges, 'emit');

            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererTextFieldWithIncorrectPattern, false) });
            expect(validationChangesSpy).toHaveBeenCalledWith(false);

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
            const validationChangesSpy = spyOn(component.validationChanges, 'emit');

            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererFields, false) });
            expect(validationChangesSpy).toHaveBeenCalledWith(false);

            expect(nameControl.valid).toBe(false);

            nameControl.setValue('valid');
            expect(nameControl.valid).toBe(true);

            nameControl.setValue('');
            expect(nameControl.valid).toBe(false);
        });

        it('should display required error', () => {
            nameControl.setValue('');
            expect(nameControl.valid).toBe(false);

            nameField.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const requiredError = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-error-required-name"]'));
            expect(requiredError).toBeTruthy();
            expect(requiredError.nativeElement.textContent.trim()).toBe('SDK.FORM_FIELDS_RENDERER.ERROR.REQUIRED');
        });

        it('should display default required error if label is not provided', () => {
            component.formFields = mockFormRendererFieldWithoutLabel;
            fixture.detectChanges();

            nameControl.setValue('');
            expect(nameControl.valid).toBe(false);

            nameField.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const requiredError = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-error-required-name"]'));
            expect(requiredError).toBeTruthy();
            expect(requiredError.nativeElement.textContent.trim()).toBe('SDK.FORM_FIELDS_RENDERER.ERROR.DEFAULT_REQUIRED');
        });

        it('should display pattern error', () => {
            nameControl.setValue('invalid-');
            nameField.nativeElement.dispatchEvent(new Event('input'));
            expect(nameControl.valid).toBe(false);

            fixture.detectChanges();

            const patternError = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-error-pattern-name"]'));
            expect(patternError).toBeTruthy();
            expect(patternError.nativeElement.textContent.trim()).toBe('fake-pattern-error-message');
        });

        it('should emit value changes', fakeAsync(() => {
            const valueChangesSpy = spyOn(component.valueChanges, 'emit');
            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererFields, false) });

            nameControl = component.formGroup.get('name');
            nameControl.setValue('new-value');
            tick(defaultDebounceTime - 50);
            expect(valueChangesSpy).not.toHaveBeenCalled();
            tick(50);

            expect(valueChangesSpy).toHaveBeenCalledWith({ description: '', name: 'new-value' });
        }));
    });

    describe('number field', () => {
        let numberField: DebugElement;
        let numberControl: AbstractControl;

        beforeEach(() => {
            component.formGroup = mockFormGroupWithNumberField;
            component.formFields = mockFormRendererFieldNumberTypeWithMinMaxValidators;
            fixture.detectChanges();

            numberField = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-number-index"]'));
            numberControl = component.formGroup.get('index');
        });
        it('should display number field', () => {
            expect(numberField).toBeTruthy();
            expect(numberField.nativeElement.placeholder).toBe('fake-index');
            expect(numberField.nativeElement.type).toBe('number');
            expect(numberField.nativeElement.value).toBe('99');
        });

        it('should validate min', () => {
            const validationChangesSpy = spyOn(component.validationChanges, 'emit');

            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererFieldNumberTypeWithMinMaxValidators[0].defaultValue = 89, false) });
            expect(validationChangesSpy).toHaveBeenCalledWith(false);

            numberControl.setValue('90');
            expect(numberControl.valid).toBe(true);

            numberControl.setValue('89');
            expect(numberControl.valid).toBe(false);
        });

        it('should validate max', () => {
            const validationChangesSpy = spyOn(component.validationChanges, 'emit');

            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererFieldNumberTypeWithMinMaxValidators[0].defaultValue = 101 , false) });
            expect(validationChangesSpy).toHaveBeenCalledWith(false);

            numberControl.setValue('100');
            expect(numberControl.valid).toBe(true);

            numberControl.setValue('101');
            expect(numberControl.valid).toBe(false);
        });

        it('should display min error', () => {
            numberControl.setValue('89');
            expect(numberControl.valid).toBe(false);

            numberField.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const minError = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-error-min-index"]'));
            expect(minError).toBeTruthy();
            expect(minError.nativeElement.textContent.trim()).toBe('fake-min-error-message');
        });

        it('should display max error', () => {
            numberControl.setValue('101');
            expect(numberControl.valid).toBe(false);

            numberField.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const maxError = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-error-max-index"]'));
            expect(maxError).toBeTruthy();
            expect(maxError.nativeElement.textContent.trim()).toBe('fake-max-error-message');
        });

        it('should emit value changes', fakeAsync(() => {
            const valueChangesSpy = spyOn(component.valueChanges, 'emit');
            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormGroupWithNumberField, false) });

            numberControl = component.formGroup.get('index');
            numberControl.setValue('95');
            tick(defaultDebounceTime - 50);
            expect(valueChangesSpy).not.toHaveBeenCalled();
            tick(50);

            expect(valueChangesSpy).toHaveBeenCalledWith({ index: 95 });
        }));

        it('should be able to handle number 0 as an acceptable value of a number field', fakeAsync(() => {
            const valueChangesSpy = spyOn(component.valueChanges, 'emit');
            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormGroupWithNumberField, false) });

            numberControl = component.formGroup.get('index');
            numberControl.setValue('0');
            tick(defaultDebounceTime);

            expect(valueChangesSpy).toHaveBeenCalledWith({ index: 0 });
        }));
    });

    describe('textarea field', () => {
        let descriptionField: DebugElement;

        beforeEach(() => {
            component.formGroup = mockFormGroup;
            component.formFields = mockFormRendererFields;
            fixture.detectChanges();

            descriptionField = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-textarea-description"]'));
        });

        it('should display textarea field', () => {
            expect(descriptionField).toBeTruthy();
            expect(descriptionField.nativeElement.placeholder).toBe('fake-description');
            expect(descriptionField.nativeElement.type).toBe('textarea');
            expect(descriptionField.nativeElement.value).toBe('');
        });

        it('should emit value changes', fakeAsync(() => {
            const valueChangesSpy = spyOn(component.valueChanges, 'emit');
            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererFields, false) });

            const nameControl = component.formGroup.get('name');
            nameControl.setValue('mock-name');
            const descriptionControl = component.formGroup.get('description');
            descriptionControl.setValue('new-description');
            tick(defaultDebounceTime - 50);
            expect(valueChangesSpy).not.toHaveBeenCalled();
            tick(50);

            expect(valueChangesSpy).toHaveBeenCalledWith({ description: 'new-description', name: 'mock-name' });
        }));
    });

    describe('dropdown field', () => {
        let dropdownField: DebugElement;

        beforeEach(() => {
            component.formGroup = mockFormGroupWithDropdownField;
            component.formFields = mockFormRendererFieldDropdownType;
            fixture.detectChanges();

            dropdownField = fixture.debugElement.query(By.css('[data-automation-id="ama-form-fields-renderer-dropdown-drink"]'));
        });

        it('should display dropdown field', () => {
            expect(dropdownField).toBeTruthy();
            expect(dropdownField.nativeElement.textContent).toBe('Choose mock drink item');
            expect(dropdownField.nativeElement.value).toBeUndefined();
        });

        it('should display dropdown options', () => {
            const dropdownTrigger = fixture.debugElement.query(By.css('.mat-select-trigger'));
            dropdownTrigger.nativeElement.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            const options = fixture.debugElement.queryAll(By.css('mat-option'));

            expect(options.length).toBe(4);
            expect(options[0].nativeElement.textContent.trim()).toBe('No drink');
            expect(options[1].nativeElement.textContent.trim()).toBe('Coca cola');
            expect(options[2].nativeElement.textContent.trim()).toBe('Orange juice');
            expect(options[3].nativeElement.textContent.trim()).toBe('Lemonade');
        });

        it('should display dropdown group options', () => {
            component.formFields = mockFormRendererFieldDropdownGroupType;
            fixture.detectChanges();

            const dropdownTrigger = fixture.debugElement.query(By.css('.mat-select-trigger'));
            dropdownTrigger.nativeElement.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            const options = fixture.debugElement.queryAll(By.css('mat-option'));
            const groupOptions = fixture.debugElement.queryAll(By.css('mat-optgroup'));

            expect(options.length).toBe(5);
            expect(groupOptions.length).toBe(2);
            expect(options[0].nativeElement.textContent.trim()).toBe('No drink');

            const softDrinksMockLabel = fixture.debugElement.query(By.css('#mat-optgroup-label-0'));
            expect(softDrinksMockLabel.nativeElement.textContent.trim()).toBe('Soft drinks');
            expect(groupOptions[0].nativeElement.textContent.trim()).toBe('Soft drinks  Coca cola  Sprite');

            const stillDrinksMockLabel = fixture.debugElement.query(By.css('#mat-optgroup-label-1'));
            expect(stillDrinksMockLabel.nativeElement.textContent.trim()).toBe('Still drinks');
            expect(groupOptions[1].nativeElement.textContent.trim()).toBe('Still drinks  Orange juice  Lemonade');
        });

        it('should emit value changes', fakeAsync(() => {
            const valueChangesSpy = spyOn(component.valueChanges, 'emit');
            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererFieldDropdownType, false) });

            const dropdownControl = component.formGroup.get('drink');
            dropdownControl.setValue(1);
            tick(defaultDebounceTime - 50);
            expect(valueChangesSpy).not.toHaveBeenCalled();
            tick(50);

            expect(valueChangesSpy).toHaveBeenCalledWith({ drink: 1 });
        }));
    });

    describe('Emit Payload', () => {

        beforeEach(() => {
            component.formGroup = mockFormGroup;
            component.formFields = mockFormRendererFields;
            fixture.detectChanges();
        });

        it('should emit the form values regardless of validation status', fakeAsync(() => {
            const valueChangesSpy = spyOn(component.valueChanges, 'emit');
            component.ngOnChanges({ formFields: new SimpleChange(null, mockFormRendererFields, false) });

            const nameControl = component.formGroup.get('name');
            nameControl.setValue('mock$name');

            const descriptionControl = component.formGroup.get('description');
            descriptionControl.setValue('mock description');

            tick(defaultDebounceTime - 50);
            expect(valueChangesSpy).not.toHaveBeenCalled();

            tick(50);
            expect(valueChangesSpy).toHaveBeenCalledWith({ description: 'mock description', name: 'mock$name' });

            nameControl.setValue('mock-name');
            tick(defaultDebounceTime);

            expect(valueChangesSpy).toHaveBeenCalledWith({ description: 'mock description', name: 'mock-name' });
        }));
    });
});
