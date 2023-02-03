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
import { EntityDialogComponent } from './entity-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { AmaState } from '../../../store/app.state';
import { EntityDialogContentComponent } from './dialog-content/entity-dialog-content.component';
import { FormBuilder } from '@angular/forms';
import { EntityDialogPayload } from '../../common';
import { mockModelCreatorDialogFields, mockValuesProperty } from './mock/entity-dialog.mock';

describe('EntityDialogComponent', () => {
    let component: EntityDialogComponent;
    let fixture: ComponentFixture<EntityDialogComponent>;
    let store: Store<AmaState>;

    const mockDialog = {
        close: jest.fn()
    };

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

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), NoopAnimationsModule, MatDialogModule],
            declarations: [EntityDialogComponent, EntityDialogContentComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: Store, useValue: { dispatch: jest.fn() } },
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogDataWithValues },
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        createProjectAttemptActionMock.mockClear();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.inject(Store);
    });

    it('should dispatch action on submit', async () => {
        spyOn(store, 'dispatch');

        const payload = {
            form: {
                name: 'fake-values-name',
                description: 'fake-values-description'
            },
            id: 'fake-values-id'
        };

        component.submit({ payload, navigateTo: true, callback });

        expect(component.data.action).toHaveBeenCalledWith(payload, true, callback);
        expect(store.dispatch).toHaveBeenCalledWith(createProjectAttemptActionImplementationMock);
    });
});
