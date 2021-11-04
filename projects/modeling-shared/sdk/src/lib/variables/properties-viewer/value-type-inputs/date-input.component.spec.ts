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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock, CoreModule } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PropertiesViewerDateInputComponent } from './date-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('PropertiesViewerDateInputComponent', () => {
    let component: PropertiesViewerDateInputComponent;
    let fixture: ComponentFixture<PropertiesViewerDateInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatDatepickerModule,
                MatCheckboxModule,
                CoreModule,
                CommonModule,
                MatInputModule
            ],
            declarations: [PropertiesViewerDateInputComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerDateInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should change the value to current date function', async () => {
        spyOn(component.change, 'emit');
        const checkboxDate = fixture.nativeElement.querySelector('[data-automation-id="current-date-checkbox"] .mat-checkbox-input');
        checkboxDate.click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.change.emit).toHaveBeenCalledWith('${now()}');
    });

    it('should set the value to an empty string', async () => {
        spyOn(component.change, 'emit');
        const checkboxDate = fixture.nativeElement.querySelector('[data-automation-id="current-date-checkbox"] .mat-checkbox-input');
        checkboxDate.click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.change.emit).toHaveBeenCalledWith('${now()}');

        checkboxDate.click();
        expect(component.change.emit).toHaveBeenCalledWith('');
    });

    describe('Expressions not allowed', () => {

        beforeEach(() => {
            component.extendedProperties = { allowExpressions: false };
            fixture.detectChanges();
        });

        it('should not display the checkbox when field is empty', () => {
            const checkboxDateTime = fixture.nativeElement.querySelector('[data-automation-id="current-date-checkbox"] .mat-checkbox-input');
            const inputDateTime = fixture.nativeElement.querySelector('[data-automation-id="variable-value"]');

            expect(checkboxDateTime).toBeNull();
            expect(inputDateTime).not.toBeNull();
        });

        it('should not display the checkbox when field has value', () => {
            component.value = '2021-11-03';
            fixture.detectChanges();

            const checkboxDateTime = fixture.nativeElement.querySelector('[data-automation-id="current-date-checkbox"] .mat-checkbox-input');
            const inputDateTime = fixture.nativeElement.querySelector('[data-automation-id="variable-value"]');

            expect(checkboxDateTime).toBeNull();
            expect(inputDateTime).not.toBeNull();
        });

        it('should display the date input even if value is the expression', () => {
            component.value = '${now()}';
            fixture.detectChanges();

            const checkboxDateTime = fixture.nativeElement.querySelector('[data-automation-id="current-date-checkbox"] .mat-checkbox-input');
            const inputDateTime = fixture.nativeElement.querySelector('[data-automation-id="variable-value"]');

            expect(checkboxDateTime).toBeNull();
            expect(inputDateTime).not.toBeNull();
        });
    });
});
