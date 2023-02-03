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
import { EditProjectDialogComponent } from './edit-project-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EntityDialogPayload, ProjectEntityDialogForm } from '../../helpers/common';
import { EntityDialogContentComponent } from '../../helpers/components/entity-dialog/dialog-content/entity-dialog-content.component';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { mockModelCreatorDialogFields, mockValuesProperty } from '../../helpers/components/entity-dialog/mock/entity-dialog.mock';

describe('EditProjectDialogComponent', () => {
    let fixture: ComponentFixture<EditProjectDialogComponent>;

    const createProjectAttemptActionImplementationMock = jest.fn();
    const callback = jest.fn();
    const createProjectAttemptActionMock = jest.fn().mockImplementation(() => createProjectAttemptActionImplementationMock);

    const mockDialogDataWithValues: EntityDialogPayload = {
        title: 'fake-title',
        fields: mockModelCreatorDialogFields,
        action: createProjectAttemptActionMock,
        values: mockValuesProperty,
        callback
    };

    const mockDialogData: ProjectEntityDialogForm = {
        ...mockDialogDataWithValues,
        enableCandidateStarters: true
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
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        createProjectAttemptActionMock.mockClear();

        fixture = TestBed.createComponent(EditProjectDialogComponent);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create dialog', () => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

});
