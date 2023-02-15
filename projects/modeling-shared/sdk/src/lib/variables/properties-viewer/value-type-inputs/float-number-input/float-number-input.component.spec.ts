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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { MatInputModule } from '@angular/material/input';
import { InputErrorDirective } from '../../input-error.directive';
import { provideInputTypeItemHandler } from '../value-type-inputs';
import { PropertiesViewerFloatNumberInputComponent } from './float-number-input.component';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { AllowedCharactersDirective } from '../../../../helpers/directives/allowed-characters.directive';
import { ValueTypeInputComponent } from '../../value-type-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PropertiesViewerEnumInputComponent } from '../enum-input/enum-input.component';
import { MatSelectModule } from '@angular/material/select';
import { VariableValuePipe } from '../../variable-value.pipe';

describe('PropertiesViewerFloatNumberInputComponent', () => {
    let component: PropertiesViewerFloatNumberInputComponent;
    let fixture: ComponentFixture<PropertiesViewerFloatNumberInputComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
                MatFormFieldModule,
                MatSelectModule
            ],
            declarations: [
                PropertiesViewerFloatNumberInputComponent,
                InputErrorDirective,
                AllowedCharactersDirective,
                ValueTypeInputComponent,
                PropertiesViewerEnumInputComponent,
                VariableValuePipe
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                provideInputTypeItemHandler('enum', PropertiesViewerEnumInputComponent),
                provideMockStore({
                    initialState: {},
                })
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerFloatNumberInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function changeFloatInputValue(value: string) {
        const stringInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-automation-id="properties-float-number-input"]')).nativeElement;
        stringInput.value = value;
        stringInput.dispatchEvent(new Event('keypress'));
        stringInput.dispatchEvent(new Event('input'));
    }

    it('should emit a valid float value', () => {
        spyOn(component.change, 'emit');
        changeFloatInputValue('11.2');

        expect(component.change.emit).toHaveBeenCalledWith(11.2);
    });

    it('should emit the input value converted to a float', () => {
        spyOn(component.change, 'emit');
        changeFloatInputValue('11');

        expect(component.change.emit).toHaveBeenCalledWith(11);
    });

    it('should emit 0.2 when the input value is .2', () => {
        spyOn(component.change, 'emit');
        changeFloatInputValue('.2');

        expect(component.change.emit).toHaveBeenCalledWith(0.2);
    });

    it('should ignore letters', () => {
        spyOn(component.change, 'emit');
        changeFloatInputValue('1.8a');

        expect(component.change.emit).toHaveBeenCalledWith(1.8);
    });

    it('should regex allow only float numbers', () => {
        expect(component.regexInput.test('1.2')).toBeTruthy();
        expect(component.regexInput.test('.2')).toBeTruthy();
        expect(component.regexInput.test('1.2a')).toBeFalsy();
        expect(component.regexInput.test('1.2.3')).toBeFalsy();
        expect(component.regexInput.test('test')).toBeFalsy();
    });

    it('should emit null when value is invalid', () => {
        spyOn(component.change, 'emit');
        changeFloatInputValue('invalid');

        expect(component.change.emit).toHaveBeenCalledWith(null);
    });

    describe('enum input', () => {
        beforeEach(() => {
            component.model = {
                enum: [1.2,1.3,1.4]
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
