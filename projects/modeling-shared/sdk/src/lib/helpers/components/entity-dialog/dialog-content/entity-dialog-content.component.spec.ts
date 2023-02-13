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
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { EntityDialogContentComponent } from './entity-dialog-content.component';
import { FormBuilder } from '@angular/forms';
import { mockModelCreatorDialogFields, mockValuesProperty } from '../mock/entity-dialog.mock';
import { EntityDialogPayload } from '../../../common';
import { FormFieldsRendererModule } from '../../../../form-fields-renderer/form-fields-renderer.module';

describe('EntityDialogContentComponent', () => {
    let component: EntityDialogContentComponent;
    let fixture: ComponentFixture<EntityDialogContentComponent>;

    const createProjectAttemptActionImplementationMock = jest.fn();
    const createProjectAttemptActionMock = jest.fn().mockImplementation(() => createProjectAttemptActionImplementationMock);

    const mockDialogData: EntityDialogPayload = {
        title: 'fake-title',
        fields: mockModelCreatorDialogFields,
        action: createProjectAttemptActionMock,
        submitText: 'fake-submit'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatDialogModule,
                FormFieldsRendererModule
            ],
            declarations: [EntityDialogContentComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                FormBuilder
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityDialogContentComponent);
        component = fixture.componentInstance;
        component.data = mockDialogData;
    });

    it('should display form fields', () => {
        fixture.detectChanges();
        const formFields = fixture.debugElement.query(By.css('modelingsdk-form-fields-renderer'));

        expect(formFields).toBeTruthy();
    });

    it('should emit on create entity', () => {
        fixture.detectChanges();
        spyOn(component.submit, 'emit');

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        component.onValueChanges({
            name: 'fake-name',
            description: 'fake-description'
        });

        submitBtn.triggerEventHandler('click', null);

        expect(component.submit.emit).toHaveBeenCalledWith({
            payload: {
                description: 'fake-description',
                name: 'fake-name'
            },
            navigateTo: true,
            callback: component.data.callback
        });
    });

    it('should emit on enter keydown of submit button', () => {
        fixture.detectChanges();
        spyOn(component.submit, 'emit');
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        component.onValueChanges({
            name: 'fake-name',
            description: 'fake-description'
        });
        component.onValidationChanges(true);

        submitBtn.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(component.submit.emit).toHaveBeenCalledTimes(1);
    });

    it('should not emit on enter keydown if the form is not valid', () => {
        fixture.detectChanges();
        spyOn(component.submit, 'emit');
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        component.onValueChanges({
            name: 'invalid_name',
            description: 'fake-description'
        });
        component.onValidationChanges(false);

        submitBtn.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(component.submit.emit).not.toHaveBeenCalled();
    });

    it('should not emit on enter keydown if the form is loading', () => {
        fixture.detectChanges();
        spyOn(component.submit, 'emit');
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        component.onValueChanges({
            name: 'fake-name',
            description: 'fake-description'
        });
        component.onValidationChanges(true);
        component.onLoadingStateChanges(true);

        submitBtn.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(component.submit.emit).not.toHaveBeenCalled();
    });

    it('should create proper payload with form entry if data has the values property', () => {
        component.data = { ...mockDialogData, values: mockValuesProperty };
        fixture.detectChanges();
        spyOn(component.submit, 'emit');

        component.onValueChanges({
            name: 'fake-value-name',
            description: 'fake-value-description'
        });

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        submitBtn.triggerEventHandler('click', null);

        expect(component.submit.emit).toHaveBeenCalledWith({
            payload: {
                id: 'fake-values-id',
                form: {
                    name: 'fake-value-name',
                    description: 'fake-value-description'
                }
            },
            navigateTo: true,
            callback: component.data.navigateTo,
        });
    });

    it('should create proper payload with form entry if data does NOT have the values property', () => {
        component.data = mockDialogData;
        fixture.detectChanges();
        spyOn(component.submit, 'emit');

        component.onValueChanges({
            name: 'fake-name',
            description: 'fake-description'
        });

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        submitBtn.triggerEventHandler('click', null);

        expect(component.submit.emit).toHaveBeenCalledWith({
            payload: {
                name: 'fake-name',
                description: 'fake-description'
            },
            navigateTo: true,
            callback: component.data.navigateTo,
        });
    });

    it('should display custom submit text when values property is NOT provided', () => {
        fixture.detectChanges();
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        expect(submitBtn.nativeElement.textContent.trim()).toBe('fake-submit');
    });

    it('should display default submit text when values property is provided', () => {
        component.data = { ...mockDialogData, values: mockValuesProperty };
        fixture.detectChanges();
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        expect(submitBtn.nativeElement.textContent.trim()).toBe('APP.DIALOGS.SAVE');
    });
});
