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
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import {
    AmaState,
    EntityDialogContentComponent,
    EntityDialogPayload,
    FormRendererField,
    MODELER_NAME_REGEX
} from '@alfresco-dbp/modeling-shared/sdk';
import { CreateProcessDialogComponent } from './create-process-dialog.component';
import { ProcessCategorySelectorComponent } from '../process-category-selector/process-category-selector.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectProcessCategories } from '../../store/process-editor.selectors';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder } from '@angular/forms';

describe('CreateProcessDialogComponent', () => {
    let fixture: ComponentFixture<CreateProcessDialogComponent>;
    let createProcessComponent: CreateProcessDialogComponent;
    let categorySelectorDebugElement: DebugElement;
    let store: MockStore<AmaState>;

    const createProjectAttemptActionImplementationMock = jest.fn();
    const callback = jest.fn();
    const createProjectAttemptActionMock = jest.fn().mockImplementation(() => createProjectAttemptActionImplementationMock);

    const mockValuesProperty = { id: 'fake-values-id', name: 'fake-values-name', description: 'fake-values-description' };

    const mockModelCreatorDialogFields: FormRendererField[] = [
        {
            key: 'name',
            label: 'fake-name',
            type: 'text',
            validators: [
                {
                    type: 'required',
                    value: true,
                    error: 'SDK.CREATE_DIALOG.ERROR.REQUIRED'
                },
                {
                    type: 'pattern',
                    value: MODELER_NAME_REGEX,
                    error: 'fake-pattern-error-message'
                }
            ]
        },
        {
            key: 'description',
            label: 'fake-description',
            type: 'textarea'
        }
    ];


    const mockDialogDataWithValues: EntityDialogPayload = {
        title: 'fake-title',
        fields: mockModelCreatorDialogFields,
        action: createProjectAttemptActionMock,
        values: mockValuesProperty,
        callback
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatDialogModule,
                MatAutocompleteModule,
            ],
            declarations: [
                CreateProcessDialogComponent,
                EntityDialogContentComponent,
                ProcessCategorySelectorComponent
            ],
            providers: [
                provideMockStore({
                    selectors: [
                        { selector: selectProcessCategories, value: ['Category 1', 'Category 2'] },
                    ],
                }),
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MatDialogRef, useValue: { close: jest.fn() } },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogDataWithValues },
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        createProjectAttemptActionMock.mockClear();

        fixture = TestBed.createComponent(CreateProcessDialogComponent);
        createProcessComponent = fixture.componentInstance;

        store = TestBed.inject(MockStore);
    });

    it('should create dialog', () => {
        fixture.detectChanges();

        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should dispatch action on submit', () => {
        fixture.detectChanges();

        spyOn(store, 'dispatch');

        const payload = {
            form: {
                name: 'fake-values-name',
                description: 'fake-values-description'
            },
            id: 'fake-values-id',
            category: ''
        };

        createProcessComponent.submit({ payload, navigateTo: true, callback });

        expect(createProcessComponent.data.action).toHaveBeenCalledWith(payload, true, callback);
        expect(store.dispatch).toHaveBeenCalledWith(createProjectAttemptActionImplementationMock);
    });

    it('should dispatch new category', () => {
        fixture.detectChanges();

        spyOn(store, 'dispatch');
        categorySelectorDebugElement = fixture.debugElement.query(By.css('ama-process-category-selector'));

        const newCategory = 'CategoryMock';
        categorySelectorDebugElement.triggerEventHandler('categoryChange', newCategory);

        fixture.detectChanges();

        const payload = {
            form: {
                name: 'fake-values-name',
                description: 'fake-values-description'
            },
            id: 'fake-values-id',
            category: newCategory
        };

        createProcessComponent.submit({ payload, navigateTo: true, callback });

        expect(createProcessComponent.data.action).toHaveBeenCalledWith(payload, true, callback);
        expect(store.dispatch).toHaveBeenCalledWith(createProjectAttemptActionImplementationMock);
    });

    it('should listen for category change', () => {
        fixture.detectChanges();

        spyOn(createProcessComponent, 'onCategoryChange');
        categorySelectorDebugElement = fixture.debugElement.query(By.css('ama-process-category-selector'));

        const newCategory = 'CategoryMock';
        categorySelectorDebugElement.triggerEventHandler('categoryChange', newCategory);

        expect(createProcessComponent.onCategoryChange).toHaveBeenCalledWith(newCategory);
    });
});
