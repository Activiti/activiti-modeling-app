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
import { TranslationService, TranslationMock, CoreModule } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PropertiesViewerIntegerInputComponent } from './integer-input.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { INPUT_TYPE_ITEM_HANDLER } from '../value-type-inputs';
import { InputErrorDirective } from '../../input-error.directive';

describe('PropertiesViewerIntegerInputComponent', () => {
    let component: PropertiesViewerIntegerInputComponent;
    let fixture: ComponentFixture<PropertiesViewerIntegerInputComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                CoreModule,
                CommonModule,
                MatInputModule
            ],
            declarations: [PropertiesViewerIntegerInputComponent, InputErrorDirective],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: INPUT_TYPE_ITEM_HANDLER, useValue: [] }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerIntegerInputComponent);
        component = fixture.componentInstance;
    });

    describe('no model provided', () => {
        beforeEach(() => {
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should emit the changed value', () => {
            spyOn(component.change, 'emit');

            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;
            stringInput.value = '11';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));

            expect(component.change.emit).toHaveBeenCalledWith(11);
        });
    });

    describe('model provided', () => {
        beforeEach(() => {
            component.model = {
                minimum: 8,
                maximum: 13,
                multipleOf: 2,
                type: 'integer'
            };
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should emit the changed value when value is valid', () => {
            spyOn(component.change, 'emit');

            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;
            stringInput.value = '12';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));

            expect(component.change.emit).toHaveBeenCalledWith(12);
        });

        it('should not emit the changed value when value is invalid', () => {
            spyOn(component.change, 'emit');

            const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]')).nativeElement;
            stringInput.value = '16';
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
            fixture.detectChanges();
            let error: HTMLElement = fixture.debugElement.query(By.css('mat-error div')).nativeElement;
            expect(error.innerHTML.trim()).toEqual('SDK.VARIABLE_TYPE_INPUT.VALIDATION.REQUIRED');

            stringInput.value = '4';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            error = fixture.debugElement.query(By.css('mat-error div')).nativeElement;
            expect(error.innerHTML.trim()).toEqual('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MIN_VALUE');

            stringInput.value = '26';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            error = fixture.debugElement.query(By.css('mat-error div')).nativeElement;
            expect(error.innerHTML.trim()).toEqual('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MAX_VALUE');

            stringInput.value = '11';
            stringInput.dispatchEvent(new Event('input'));
            stringInput.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            error = fixture.debugElement.query(By.css('mat-error div')).nativeElement;
            expect(error.innerHTML.trim()).toEqual('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MULTIPLE_OF_VALUE');
        });
    });
});
