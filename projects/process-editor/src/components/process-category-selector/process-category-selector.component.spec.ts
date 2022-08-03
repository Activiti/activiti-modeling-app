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
import { provideMockStore } from '@ngrx/store/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { selectProcessCategories } from '../../store/process-editor.selectors';
import { ProcessCategorySelectorComponent } from './process-category-selector.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ProcessCategorySelectorComponent', () => {
    let component: ProcessCategorySelectorComponent;
    let fixture: ComponentFixture<ProcessCategorySelectorComponent>;
    const OTHER_CATEGORY = 'Other';
    const allCategories = ['Category 1', 'Category 2', OTHER_CATEGORY];
    const processCategoryInputSelectorId = '[data-automation-id="process-category-selector-input"]';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ProcessCategorySelectorComponent ]
        });
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatFormFieldModule,
                MatAutocompleteModule,
                MatInputModule,
                NoopAnimationsModule,
                ReactiveFormsModule,
            ],
            providers: [
                provideMockStore({
                    selectors: [
                        { selector: selectProcessCategories, value: allCategories },
                    ],
                }),
            ],
        });

        fixture = TestBed.createComponent(ProcessCategorySelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should show all categories', async () => {
        const categoryInput = fixture.debugElement.query(By.css(processCategoryInputSelectorId)).nativeElement;
        categoryInput.click();

        await fixture.whenStable();

        const options = fixture.debugElement.queryAll(By.css('mat-option'));

        expect(options.length).toBe(allCategories.length);

        options.forEach(option => {
            expect(allCategories.includes(option.nativeElement.textContent.trim())).toBeTruthy();
        });
    });

    it('should show filtered categories', async () => {
        component.category = OTHER_CATEGORY;

        const categoryInput = fixture.debugElement.query(By.css(processCategoryInputSelectorId)).nativeElement;
        categoryInput.click();

        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        const options = fixture.debugElement.queryAll(By.css('mat-option'));

        expect(options.length).toBe(1);
        expect(options[0].nativeElement.textContent.trim()).toBe(OTHER_CATEGORY);
    });

    it('should filter categories on category change', async () => {
        const categoryInput = fixture.debugElement.query(By.css(processCategoryInputSelectorId)).nativeElement;
        categoryInput.click();
        categoryInput.value = 'Cat';
        categoryInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        await fixture.whenStable();

        const options = fixture.debugElement.queryAll(By.css('mat-option'));

        expect(options.length).toBe(2);
        expect(options[0].nativeElement.textContent.trim()).toBe(allCategories[0]);
        expect(options[1].nativeElement.textContent.trim()).toBe(allCategories[1]);
    });

    it('should emit on category change', () => {
        spyOn(component.categoryChange, 'emit');
        const categoryInput = fixture.debugElement.query(By.css(processCategoryInputSelectorId)).nativeElement;
        categoryInput.click();
        categoryInput.value = 'Cat';
        categoryInput.dispatchEvent(new Event('input'));

        expect(component.categoryChange.emit).toHaveBeenCalledWith('Cat');
    });
});
