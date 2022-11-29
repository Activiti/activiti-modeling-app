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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Action, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SaveAsDialogComponent, SaveAsDialogPayload } from './save-as-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AmaState } from '../../store/app.state';

describe('SaveAsDialogComponent', () => {
    let component: SaveAsDialogComponent;
    let fixture: ComponentFixture<SaveAsDialogComponent>;
    let store: Store<AmaState>;

    const mockDialog = {
        close: jest.fn()
    };

    class SaveAsMockAttemptAction implements Action {
        readonly type = 'mock';
    }

    const mockDialogData: SaveAsDialogPayload = {
        id: 'process-id',
        name: 'process-name',
        description: 'process-documentation',
        sourceModelContent: '',
        sourceModelMetadata: '',
        action: SaveAsMockAttemptAction
    };

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), NoopAnimationsModule, MatDialogModule],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: Store, useValue: { dispatch: jest.fn() } },
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ],
            declarations: [
                SaveAsDialogComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(SaveAsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.inject(Store);
    }));

    it('should render input placeholders', () => {
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="ama-model-input-name"]'));
        const descField = fixture.debugElement.query(By.css('[data-automation-id="ama-model-input-description"]'));

        expect(nameField.nativeElement.placeholder).toBe('SDK.SAVE_AS_DIALOG.FIELD_PROPERTIES.NAME');
        expect(descField.nativeElement.placeholder).toBe('SDK.SAVE_AS_DIALOG.FIELD_PROPERTIES.DESCRIPTION');
    });

    it('should render form buttons', () => {
        const cancelButton = fixture.debugElement.query(By.css('.cancel-btn'));
        const submitButton = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        expect(cancelButton.nativeElement.textContent.trim()).toBe('APP.DIALOGS.CANCEL');
        expect(submitButton.nativeElement.textContent.trim()).toBe('APP.DIALOGS.SAVE');
    });

    it('should test submit button on save as entity', () => {
        spyOn(store, 'dispatch');
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        component.name = 'name';
        component.description = 'test-desc';

        fixture.detectChanges();
        submitBtn.triggerEventHandler('click', null);
        expect(store.dispatch).toHaveBeenCalledWith(new mockDialogData.action(SaveAsMockAttemptAction));
    });

    it('should test submit action on enter keydown of name field', () => {
        spyOn(store, 'dispatch');
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="ama-model-input-name"]'));
        component.name = 'name';
        component.description = 'test-desc';

        nameField.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter', bubbles: true }));

        expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should test submit action on enter keydown of submit button', () => {
        spyOn(store, 'dispatch');
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="ama-model-input-name"]'));
        component.name = 'name';
        component.description = 'test-desc';

        nameField.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter', bubbles: true }));
        expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should not submit action on enter keydown if the form is not valid', () => {
        spyOn(store, 'dispatch');
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="ama-model-input-name"]'));
        component.name = 'not_valid-name';
        component.description = 'test-desc';

        nameField.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter', bubbles: true }));
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should render input values', () => {
        const mockValues = { id: 'process-id', name: 'process-name', description: 'process-documentation' };
        fixture.detectChanges();
        expect(component.name).toBe(mockValues.name);
        expect(component.description).toBe(mockValues.description);
    });

    it('should validate name field value', () => {
        component.name = '@$#&* {}[],=-().+;\'/';
        fixture.detectChanges();
        const errorMessage = fixture.debugElement.query(By.css('[data-automation-id="error-validation"]'));
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        expect(submitBtn.nativeElement.disabled).toBeTruthy();

        /* cspell: disable-next-line */
        component.name = 'Testautomation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        expect(submitBtn.nativeElement.disabled).toBeTruthy();

        component.name = 'testAutomation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        expect(submitBtn.nativeElement.disabled).toBeTruthy();

        component.name = 'test-automation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement).not.toBeNull();
        expect(submitBtn.nativeElement.disabled).toBeFalsy();

        component.name = 'test1automation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement).not.toBeNull();
        expect(submitBtn.nativeElement.disabled).toBeFalsy();

        component.name = 'test_automation';
        fixture.detectChanges();
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        expect(submitBtn.nativeElement.disabled).toBeTruthy();

        /* cSpell:disable */
        component.name = 'testautomationlengthmorethan26';
        fixture.detectChanges();
        expect(errorMessage.nativeElement.textContent).toEqual(component.allowedCharacters.error);
        expect(submitBtn.nativeElement.disabled).toBeTruthy();
    });

});
