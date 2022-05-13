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
import { AmaState, EntityDialogPayload, EntityDialogContentComponent } from '@alfresco-dbp/modeling-shared/sdk';
import { CreateProcessDialogComponent } from './create-process-dialog.component';
import { ProcessCategorySelectorComponent } from '../process-category-selector/process-category-selector.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectProcessCategories } from '../../store/process-editor.selectors';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('CreateProcessDialogComponent', () => {
    let fixture: ComponentFixture<CreateProcessDialogComponent>;
    let createProcessComponent: CreateProcessDialogComponent;
    let categorySelectorDebugElement: DebugElement;
    let store: MockStore<AmaState>;

    const callback = jest.fn();
    const createProjectAttemptActionImplementationMock = jest.fn();
    const createProjectAttemptActionMock = jest.fn().mockImplementation(() => createProjectAttemptActionImplementationMock);

    const mockDialogData: EntityDialogPayload = {
        title: 'mock-title',
        nameField: 'name',
        descriptionField: 'desc',
        action: createProjectAttemptActionMock,
        values: {
            id: 'id',
            name: 'name',
            description: 'description',
        },
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
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        createProjectAttemptActionMock.mockClear();

        fixture = TestBed.createComponent(CreateProcessDialogComponent);
        createProcessComponent = fixture.componentInstance;
        categorySelectorDebugElement = fixture.debugElement.query(By.css('ama-process-category-selector'));

        store = TestBed.inject(MockStore);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create dialog', () => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should dispatch action on submit', async () => {
        spyOn(store, 'dispatch');

        const submitButton = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

        submitButton.triggerEventHandler('click', null);

        const payload = {
            form: {
                name: 'name',
                description: 'description'
            },
            id: 'id',
            category: ''
        };

        expect(createProcessComponent.data.action).toHaveBeenCalledWith(payload, true, callback);
        expect(store.dispatch).toHaveBeenCalledWith(createProjectAttemptActionImplementationMock);
    });

    it('should dispatch new category', async () => {
        spyOn(store, 'dispatch');

        const newCategory = 'CategoryMock';
        categorySelectorDebugElement.triggerEventHandler('categoryChange', newCategory);

        fixture.detectChanges();

        const submitButton = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
        submitButton.triggerEventHandler('click', null);

        const payload = {
            form: {
                name: 'name',
                description: 'description'
            },
            id: 'id',
            category: newCategory
        };

        expect(createProcessComponent.data.action).toHaveBeenCalledWith(payload, true, callback);
        expect(store.dispatch).toHaveBeenCalledWith(createProjectAttemptActionImplementationMock);
    });

    it('should listen for category change', async () => {
        spyOn(createProcessComponent, 'onCategoryChange');

        const newCategory = 'CategoryMock';
        categorySelectorDebugElement.triggerEventHandler('categoryChange', newCategory);

        expect(createProcessComponent.onCategoryChange).toHaveBeenCalledWith(newCategory);
    });
});
