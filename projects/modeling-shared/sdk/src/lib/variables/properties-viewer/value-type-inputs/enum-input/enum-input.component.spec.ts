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
import { PropertiesViewerEnumInputComponent } from './enum-input.component';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VariableValuePipe } from '../../variable-value.pipe';

describe('PropertiesViewerEnumInputComponent', () => {
    let component: PropertiesViewerEnumInputComponent;
    let fixture: ComponentFixture<PropertiesViewerEnumInputComponent>;
    let dropdownElement: DebugElement;
    let allOptions: DebugElement[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                MatSelectModule,
                FormsModule
            ],
            declarations: [PropertiesViewerEnumInputComponent, VariableValuePipe],
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerEnumInputComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
        dropdownElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]'));
    });

    describe('no model', () => {

        it('should display none value if allowed', () => {
            dropdownElement.nativeElement.click();
            fixture.detectChanges();

            allOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));

            expect(allOptions.length).toBe(1);
            expect(allOptions[0].nativeElement.textContent.trim()).toEqual('SDK.VARIABLE_MAPPING.NONE');
        });

        it('should emit null value when selecting none', () => {
            component.value = '';
            const spy = spyOn(component.change, 'emit');
            dropdownElement.nativeElement.click();
            fixture.detectChanges();

            allOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));

            allOptions[0].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should not display none value if not allowed', () => {
            component.extendedProperties = { nullSelectionAllowed: false, values: null };
            component.ngOnInit();
            fixture.detectChanges();
            dropdownElement.nativeElement.click();
            fixture.detectChanges();

            allOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));

            expect(allOptions.length).toBe(0);
        });
    });

    describe('provided array values', () => {

        beforeEach(() => {
            component.extendedProperties = { nullSelectionAllowed: false, values: ['string', 1, false, ['1', 2, true]] };
            component.ngOnInit();
            fixture.detectChanges();

            dropdownElement.nativeElement.click();
            fixture.detectChanges();

            allOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        });

        it('should display each of the items as an option in the select', () => {
            expect(allOptions.length).toBe(4);
            expect(allOptions[0].nativeElement.textContent.trim()).toEqual('string');
            expect(allOptions[1].nativeElement.textContent.trim()).toEqual('1');
            expect(allOptions[2].nativeElement.textContent.trim()).toEqual('false');
            expect(allOptions[3].nativeElement.textContent.trim()).toEqual('["1",2,true]');
        });

        it('should emit value on select', () => {
            const spy = spyOn(component.change, 'emit');

            allOptions[0].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith('string');

            allOptions[1].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith(1);

            allOptions[2].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith(false);

            allOptions[3].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith(['1', 2, true]);
        });
    });

    describe('provided coma separated string values', () => {

        beforeEach(() => {
            component.extendedProperties = { nullSelectionAllowed: false, values: '1, a, other, true' };
            component.ngOnInit();
            fixture.detectChanges();

            dropdownElement.nativeElement.click();
            fixture.detectChanges();

            allOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        });

        it('should display each of the items as an option in the select', () => {
            expect(allOptions.length).toBe(4);
            expect(allOptions[0].nativeElement.textContent.trim()).toEqual('1');
            expect(allOptions[1].nativeElement.textContent.trim()).toEqual('a');
            expect(allOptions[2].nativeElement.textContent.trim()).toEqual('other');
            expect(allOptions[3].nativeElement.textContent.trim()).toEqual('true');
        });

        it('should emit value on select', () => {
            const spy = spyOn(component.change, 'emit');

            allOptions[0].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith('1');

            allOptions[1].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith('a');

            allOptions[2].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith('other');

            allOptions[3].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith('true');
        });
    });

    describe('invalid JSON Schema model', () => {

        beforeEach(() => {
            component.extendedProperties = { nullSelectionAllowed: false, values: null };
            component.model = { $id: 'mySchema', $comment: 'this shouldn\'t be an input but it doesn\'t fail' };
            component.ngOnInit();
            fixture.detectChanges();

            dropdownElement.nativeElement.click();
            fixture.detectChanges();

            allOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        });

        it('should display no items', () => {
            expect(allOptions.length).toBe(0);
        });
    });

    describe('valid JSON schema model', () => {

        beforeEach(() => {
            component.extendedProperties = { nullSelectionAllowed: false, values: null };
            component.model = { enum: ['string', 1, false, ['1', 2, true]] };
            component.ngOnInit();
            fixture.detectChanges();

            dropdownElement.nativeElement.click();
            fixture.detectChanges();

            allOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        });

        it('should display each of the items as an option in the select', () => {
            expect(allOptions.length).toBe(4);
            expect(allOptions[0].nativeElement.textContent.trim()).toEqual('string');
            expect(allOptions[1].nativeElement.textContent.trim()).toEqual('1');
            expect(allOptions[2].nativeElement.textContent.trim()).toEqual('false');
            expect(allOptions[3].nativeElement.textContent.trim()).toEqual('["1",2,true]');
        });

        it('should emit value on select', () => {
            const spy = spyOn(component.change, 'emit');

            allOptions[0].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith('string');

            allOptions[1].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith(1);

            allOptions[2].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith(false);

            allOptions[3].nativeElement.click();
            fixture.detectChanges();
            expect(spy).toHaveBeenCalledWith(['1', 2, true]);
        });
    });
});
