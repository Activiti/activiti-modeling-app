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

import { setupTestBed } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { mockAvailablePets, mockNoIconPet } from '../../mock/dual-list.mock';
import { DualListItemsComponent } from './dual-list-items.component';

describe('DualListItemsComponent', () => {
    let component: DualListItemsComponent;
    let fixture: ComponentFixture<DualListItemsComponent>;

    const endRowIconName = 'add_circle_outline';

    setupTestBed({
        imports: [
            MatListModule,
            MatButtonModule,
            MatListModule,
            MatIconTestingModule,
            TranslateModule.forRoot(),
            NoopAnimationsModule
        ],
        declarations: [
            DualListItemsComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
  });

    beforeEach(() => {
        fixture = TestBed.createComponent(DualListItemsComponent);
        component = fixture.componentInstance;
        component.endRowIcon = endRowIconName;
        component.listItems = [...mockAvailablePets];
        fixture.detectChanges();
    });

    it('should display correct number of items', () => {
        const itemsNameElements = fixture.debugElement.queryAll(By.css('.ama-dual-list-item-name'));

        expect(itemsNameElements.length).toBe(mockAvailablePets.length);
        expect(itemsNameElements[0].nativeElement.textContent.trim()).toBe('Simba');
        expect(itemsNameElements[1].nativeElement.textContent.trim()).toBe('Mickey');
    });

    it('should display end row icon', () => {
        const endRowIcon = fixture.debugElement.query(By.css(`[data-automation-id="ama-dual-list-end-row-icon-${endRowIconName}"]`));

        expect(endRowIcon).toBeTruthy();
        expect(endRowIcon.nativeElement.textContent.trim()).toBe(endRowIconName);
    });

    it('should display item with custom icon', () => {
        const expectedIcon = 'pets';
        const itemIcon = fixture.debugElement.query(By.css(`[data-automation-id="ama-dual-list-item-icon-${expectedIcon}"]`));

        expect(itemIcon).toBeTruthy();
        expect(itemIcon.nativeElement.textContent.trim()).toBe(expectedIcon);
    });

    it('should display item without icon', () => {
        component.listItems = [mockNoIconPet];
        fixture.detectChanges();

        const itemIcon = fixture.debugElement.query(By.css('[data-automation-id="ama-dual-list-item-icon"]'));

        expect(itemIcon).toBeNull();
    });

    it('should emit item selected on click', () => {
        const selectedItemsChangeSpy = spyOn(component.selectItem, 'emit');
        const itemElement = fixture.debugElement.queryAll(By.css('.ama-dual-list-item-name'))[0];

        itemElement.nativeElement.click();

        expect(selectedItemsChangeSpy).toHaveBeenCalledWith(mockAvailablePets[0]);
    });
});
