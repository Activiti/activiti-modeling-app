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
import { CreateProjectAttemptAction } from '../../../../store/project.actions';
import { By } from '@angular/platform-browser';
import { EntityDialogContentComponent } from './entity-dialog-content.component';
import { EntityDialogPayload } from '../../../common';

describe('EntityDialogContentComponent', () => {
    let component: EntityDialogContentComponent;
    let fixture: ComponentFixture<EntityDialogContentComponent>;

    const mockDialogData: EntityDialogPayload = {
        title: 'mock-title',
        nameField: 'name',
        descriptionField: 'desc',
        action: CreateProjectAttemptAction
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), NoopAnimationsModule, MatDialogModule],
            declarations: [EntityDialogContentComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityDialogContentComponent);
        component = fixture.componentInstance;
        component.data = mockDialogData;
        fixture.detectChanges();
    });

    it('should render input placeholders', () => {
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="name-field"]'));
        const descField = fixture.debugElement.query(By.css('[data-automation-id="desc-field"]'));

        expect(nameField.nativeElement.placeholder).toBe(mockDialogData.nameField);
        expect(descField.nativeElement.placeholder).toBe(mockDialogData.descriptionField);
    });

    it('should emit on create entity', () => {
        spyOn(component.submit, 'emit');

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        component.form.name = 'name';
        component.form.description = 'test-desc';
        fixture.detectChanges();

        submitBtn.triggerEventHandler('click', null);

        expect(component.submit.emit).toHaveBeenCalledWith({
            payload: {
                description: 'test-desc',
                name: 'name',
            },
            navigateTo: true,
            callback: component.data.callback
        });
    });

    it('should emit on enter keydown of submit button', () => {
        spyOn(component.submit, 'emit');
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        component.form.name = 'name';
        component.form.description = 'test-desc';

        submitBtn.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(component.submit.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit on enter keydown of name field', () => {
        spyOn(component.submit, 'emit');
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="name-field"]'));
        component.form.name = 'name';
        component.form.description = 'test-desc';

        nameField.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(component.submit.emit).toHaveBeenCalledTimes(1);
    });

    it('should not emit on enter keydown if the form is not valid', () => {
        spyOn(component.submit, 'emit');
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="name-field"]'));
        component.form.name = 'not_valid-name';
        component.form.description = 'test-desc';

        nameField.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(component.submit.emit).not.toHaveBeenCalled();
    });

    it('should render input values', () => {
        const mockValues = { id: 'id', name: 'name', description: 'desc' };
        component.data = { ...mockDialogData, values: mockValues };
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.form.name).toBe(mockValues.name);
        expect(component.form.description).toBe(mockValues.description);
    });

    it('should emit on submit button', async () => {
        const mockValues = { id: 'id', name: 'name', description: 'desc' };
        component.data = { ...mockDialogData, values: mockValues };
        spyOn(component.submit, 'emit');

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        submitBtn.triggerEventHandler('click', null);

        expect(component.submit.emit).toHaveBeenCalledWith({
            payload: {
                id: 'id',
                form: component.form
            },
            navigateTo: true,
            callback: component.data.navigateTo,
        });
    });

    it('should validate name field value', () => {
        component.form.name = '@$#&* {}[],=-().+;\'/';
        fixture.detectChanges();
        const errorMessage = fixture.debugElement.query(By.css('[data-automation-id="error-validation"]'));
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        expect(submitBtn.nativeElement.disabled).toBeTruthy();

        /* cspell: disable-next-line */
        component.form.name = 'Testautomation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        expect(submitBtn.nativeElement.disabled).toBeTruthy();

        component.form.name = 'testAutomation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        expect(submitBtn.nativeElement.disabled).toBeTruthy();

        component.form.name = 'test-automation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement).not.toBeNull();
        expect(submitBtn.nativeElement.disabled).toBeFalsy();

        component.form.name = 'test1automation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement).not.toBeNull();
        expect(submitBtn.nativeElement.disabled).toBeFalsy();

        component.form.name = 'test_automation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        expect(submitBtn.nativeElement.disabled).toBeTruthy();

        /* cSpell:disable */
        component.form.name = 'testautomationlengthmorethan26';
        fixture.detectChanges();
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        expect(submitBtn.nativeElement.disabled).toBeTruthy();
    });
});
