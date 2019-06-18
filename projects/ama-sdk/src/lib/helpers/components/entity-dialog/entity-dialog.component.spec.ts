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
import { EntityDialogComponent } from './entity-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { AmaState } from '../../../store/app.state';
import { EntityDialogPayload } from '../../common';
import { CreateProjectAttemptAction } from '../../../store/project.actions';
import { By } from '@angular/platform-browser';


describe('EntityDialogComponent', () => {
    let component: EntityDialogComponent;
    let fixture: ComponentFixture<EntityDialogComponent>;
    let store: Store<AmaState>;

    const mockDialog = {
        close: jest.fn()
    };

    const mockDialogData: EntityDialogPayload = {
        title: 'mock-title',
        nameField: 'name',
        descriptionField: 'desc',
        action: CreateProjectAttemptAction
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), NoopAnimationsModule, MatDialogModule],
            declarations: [EntityDialogComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: Store, useValue: { dispatch: jest.fn() } },
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.get(Store);
    });

    it('should render input placeholders', () => {
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="name-field"]'));
        const descField = fixture.debugElement.query(By.css('[data-automation-id="desc-field"]'));

        expect(nameField.nativeElement.placeholder).toBe(mockDialogData.nameField);
        expect(descField.nativeElement.placeholder).toBe(mockDialogData.descriptionField);
    });

    it('should test submit button on create entity', () => {
        spyOn(store, 'dispatch');

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        component.form.name = 'name';
        component.form.description = 'test-desc';
        fixture.detectChanges();

        submitBtn.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new mockDialogData.action(component.form));
    });

    it('should test submit action on enter keydown of submit button', () => {
        spyOn(store, 'dispatch');
        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        component.form.name = 'name';
        component.form.description = 'test-desc';

        submitBtn.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should test submit action on enter keydown of name field', () => {
        spyOn(store, 'dispatch');
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="name-field"]'));
        component.form.name = 'name';
        component.form.description = 'test-desc';

        nameField.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should not submit action on enter keydown if the form is not valid', () => {
        spyOn(store, 'dispatch');
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="name-field"]'));
        component.form.name = 'not_valid-name';
        component.form.description = 'test-desc';

        nameField.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', bubbles: true}));

        expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should render input values', () => {
        const mockValues = { id: 'id', name: 'name', description: 'desc' };
        component.data = { ...mockDialogData, values: mockValues };
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.form.name).toBe(mockValues.name);
        expect(component.form.description).toBe(mockValues.description);
    });

    it('should test submit button on edit', () => {
        const mockValues = { id: 'id', name: 'name', description: 'desc' };
        component.data = { ...mockDialogData, values: mockValues };
        spyOn(store, 'dispatch');

        const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        submitBtn.triggerEventHandler('click', null);

        expect(store.dispatch).toHaveBeenCalledWith(new mockDialogData.action({ id: mockValues.id, form: component.form }));
    });

});
