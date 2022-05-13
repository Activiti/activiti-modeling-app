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

import { BpmnProperty, EntityDialogContentComponent, ProcessModelerServiceToken } from '@alfresco-dbp/modeling-shared/sdk';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessCategorySelectorComponent } from '../../../components/process-category-selector/process-category-selector.component';
import { selectProcessCategories } from '../../../store/process-editor.selectors';
import { CardViewProcessNameItemModel } from '../process-name-item/process-name-item.model';
import { CardProcessCategoryItemComponent } from './process-category-item.component';

describe('CardProcessCategoryItemComponent', () => {
    const processModelerServiceMock = {
        updateElementProperty: jest.fn(),
    };

    let fixture: ComponentFixture<CardProcessCategoryItemComponent>;
    let categoryItemComponent: CardProcessCategoryItemComponent;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatAutocompleteModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
            ],
            declarations: [
                CardProcessCategoryItemComponent,
                EntityDialogContentComponent,
                ProcessCategorySelectorComponent
            ],
            providers: [
                provideMockStore({
                    selectors: [
                        { selector: selectProcessCategories, value: ['Category 1', 'Category 2'] },
                    ],
                }),
                { provide: ProcessModelerServiceToken, useValue: processModelerServiceMock },
                { provide: TranslationService, useClass: TranslationMock },
            ]
        });

        const componentInput = {
            data: {
                element: {
                    id: 'id'
                }
            },
            value: 'category'
        } as CardViewProcessNameItemModel;

        fixture = TestBed.createComponent(CardProcessCategoryItemComponent);
        categoryItemComponent = fixture.componentInstance;
        categoryItemComponent.property = componentInput;

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should listen for category change', () => {
        const categorySelector = fixture.debugElement.query(By.css('ama-process-category-selector'));
        categorySelector.triggerEventHandler('categoryChange', 'new category');

        expect(processModelerServiceMock.updateElementProperty).toBeCalledWith(
            'id',
            BpmnProperty.category,
            'new category'
        );
    });
});
