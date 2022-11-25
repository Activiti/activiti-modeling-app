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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { EntityDialogContentComponent } from './entity-dialog-content.component';
import { EntityDialogContentFormService } from '../service/entity-dialog-content-form.service';
import { FormBuilder } from '@angular/forms';
import { mockFormGroup, mockModelCreatorDialogFields, mockValuesProperty } from '../mock/entity-dialog.mock';
import { EntityDialogPayload } from '../../../common';

describe('EntityDialogContentComponent', () => {
    let component: EntityDialogContentComponent;
    let fixture: ComponentFixture<EntityDialogContentComponent>;
    let entityDialogContentFormService: EntityDialogContentFormService;

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
            imports: [TranslateModule.forRoot(), NoopAnimationsModule, MatDialogModule],
            declarations: [EntityDialogContentComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                EntityDialogContentFormService,
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityDialogContentComponent);
        entityDialogContentFormService = TestBed.inject(EntityDialogContentFormService);
        component = fixture.componentInstance;
        spyOn(entityDialogContentFormService, 'createForm').and.returnValue(mockFormGroup);
        component.data = mockDialogData;
    });

    it('should emit on create entity', () => {
        fixture.detectChanges();
        spyOn(component.submit, 'emit');

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        component.dialogForm.get('name').setValue('fake-name');
        component.dialogForm.get('description').setValue('fake-description');
        fixture.detectChanges();

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
        component.dialogForm.get('name').setValue('fake-name');
        component.dialogForm.get('description').setValue('fake-description');

        submitBtn.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(component.submit.emit).toHaveBeenCalledTimes(1);
    });

    it('should not emit on enter keydown if the form is not valid', () => {
        fixture.detectChanges();
        spyOn(component.submit, 'emit');
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        component.dialogForm.get('name').setValue('invalid_name');
        component.dialogForm.get('description').setValue('fake-description');

        submitBtn.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(component.submit.emit).not.toHaveBeenCalled();
    });

    it('should emit on submit button', () => {
        component.data = { ...mockDialogData, values: mockValuesProperty };
        fixture.detectChanges();
        spyOn(component.submit, 'emit');

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        submitBtn.triggerEventHandler('click', null);

        expect(component.submit.emit).toHaveBeenCalledWith({
            payload: {
                id: 'fake-values-id',
                form: component.prefilledFormValues,
                name: 'fake-values-name',
                description: 'fake-values-description'
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
