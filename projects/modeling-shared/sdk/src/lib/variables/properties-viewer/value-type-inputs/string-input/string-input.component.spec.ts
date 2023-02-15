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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PropertiesViewerStringInputComponent } from './string-input.component';
import { provideInputTypeItemHandler } from '../value-type-inputs';
import { InputErrorDirective } from '../../input-error.directive';
import { ValueTypeInputComponent } from '../../value-type-input.component';
import { PropertiesViewerEnumInputComponent } from '../enum-input/enum-input.component';
import { VariableValuePipe } from '../../variable-value.pipe';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

describe('PropertiesViewerStringInputComponent', () => {
    let component: PropertiesViewerStringInputComponent;
    let fixture: ComponentFixture<PropertiesViewerStringInputComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                ReactiveFormsModule,
                FormsModule,
                CommonModule,
                MatFormFieldModule,
                MatInputModule,
                MatSelectModule
            ],
            declarations: [
                PropertiesViewerStringInputComponent,
                InputErrorDirective,
                ValueTypeInputComponent,
                PropertiesViewerEnumInputComponent,
                VariableValuePipe
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                provideInputTypeItemHandler('enum', PropertiesViewerEnumInputComponent)
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerStringInputComponent);
        component = fixture.componentInstance;
    });

    describe('no model provided', () => {
        beforeEach(() => {
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should render the input text', () => {
            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;

            expect(component.useEnum).toEqual(false);
            expect(component.useTextArea).toEqual(false);
            expect(stringInput.tagName).toEqual('INPUT');
        });

        it('should emit the changed value', () => {
            spyOn(component.change, 'emit');

            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;
            stringInput.value = 'newValue';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));

            expect(component.change.emit).toHaveBeenCalledWith('newValue');
        });
    });

    describe('model provided', () => {
        beforeEach(() => {
            component.model = {
                type: 'string',
                pattern: '[a-z0-9]+',
                minLength: 8,
                maxLength: 13
            };
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should render the input text if pattern does not allow new lines', () => {
            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;

            expect(component.useEnum).toEqual(false);
            expect(component.useTextArea).toEqual(false);
            expect(stringInput.tagName).toEqual('INPUT');
        });

        it('should render the textarea if pattern allows new lines', () => {
            component.model.pattern = '(\\s|\\S)*';
            component.ngOnInit();
            fixture.detectChanges();

            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;

            expect(component.useEnum).toEqual(false);
            expect(component.useTextArea).toEqual(true);
            expect(stringInput.tagName).toEqual('TEXTAREA');
        });

        it('should emit the changed value when value is valid', () => {
            spyOn(component.change, 'emit');

            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;
            stringInput.value = 'new1value';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));

            expect(component.change.emit).toHaveBeenCalledWith('new1value');
        });

        it('should not emit the changed value when value is invalid', () => {
            spyOn(component.change, 'emit');

            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;
            stringInput.value = '1nv4lid!';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));

            expect(component.change.emit).not.toHaveBeenCalled();
        });

        it('should display errors when validators are not met', () => {
            component.required = true;
            component.ngOnInit();
            fixture.detectChanges();

            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;
            stringInput.value = '';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            let error: HTMLElement = fixture.debugElement.query(By.css('mat-hint div')).nativeElement;
            expect(error.innerHTML.trim()).toEqual('SDK.VARIABLE_TYPE_INPUT.VALIDATION.REQUIRED');

            stringInput.value = 'NoPattern!';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            error = fixture.debugElement.query(By.css('mat-hint div')).nativeElement;
            expect(error.innerHTML.trim()).toEqual('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_FORMAT');

            stringInput.value = 'short';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            error = fixture.debugElement.query(By.css('mat-hint div')).nativeElement;
            expect(error.innerHTML.trim()).toEqual('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MIN_LENGTH');

            stringInput.value = 'this1input2is3too4long';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            error = fixture.debugElement.query(By.css('mat-hint div')).nativeElement;
            expect(error.innerHTML.trim()).toEqual('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MAX_LENGTH');
        });
    });

    describe('enum input', () => {
        beforeEach(() => {
            component.model = {
                enum: ['a','b','c']
            };
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should render the enum value', () => {
            const enumInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;
            const stringInput = fixture.debugElement.query(By.css('input'));

            expect(component.useEnum).toEqual(true);
            expect(stringInput).toBeNull();
            expect(enumInput.tagName.toLowerCase()).toEqual('mat-select');
        });
    });
});
