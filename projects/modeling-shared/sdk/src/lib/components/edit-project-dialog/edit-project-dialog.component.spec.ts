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
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { EditProjectDialogComponent } from './edit-project-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AmaState } from '../../store/app.state';
import { ProjectEntityDialogForm } from '../../helpers/common';
import { EntityDialogContentComponent } from '../../helpers/components/entity-dialog/dialog-content/entity-dialog-content.component';
import { Store } from '@ngrx/store';

describe('EditProjectDialogComponent', () => {
    let fixture: ComponentFixture<EditProjectDialogComponent>;
    let editProjectDialogComponent: EditProjectDialogComponent;
    let store: Store<AmaState>;

    const callback = jest.fn();
    const createProjectAttemptActionImplementationMock = jest.fn();
    const createProjectAttemptActionMock = jest.fn().mockImplementation(() => createProjectAttemptActionImplementationMock);

    const mockDialogData: ProjectEntityDialogForm = {
        title: 'mock-title',
        nameField: 'name',
        descriptionField: 'desc',
        action: createProjectAttemptActionMock,
        values: {
            id: 'id',
            name: 'name',
            description: 'description',
        },
        enableCandidateStarters: true,
        callback
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatDialogModule,
                MatAutocompleteModule,
            ],
            declarations: [
                EditProjectDialogComponent,
                EntityDialogContentComponent
            ],
            providers: [
                { provide: Store, useValue: { dispatch: jest.fn() } },
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MatDialogRef, useValue: { close: jest.fn() } },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        createProjectAttemptActionMock.mockClear();

        fixture = TestBed.createComponent(EditProjectDialogComponent);
        editProjectDialogComponent = fixture.componentInstance;

        store = TestBed.inject(Store);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create dialog', () => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should dispatch action on submit', async () => {
        spyOn(store, 'dispatch');

        expect(editProjectDialogComponent.candidateStartersEnabled).toBe(true);
        const submitButton = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        submitButton.triggerEventHandler('click', null);

        const payload = {
            form: {
                name: 'name',
                description: 'description'
            },
            id: 'id',
            enableCandidateStarters: true
        };

        expect(editProjectDialogComponent.data.action).toHaveBeenCalledWith(payload, true, callback);
        expect(store.dispatch).toHaveBeenCalledWith(createProjectAttemptActionImplementationMock);
    });
});
