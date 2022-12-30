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
import { mockAvailablePets, mockPreselectedPets } from '../../mock/dual-list.mock';
import { DualListComponent } from './dual-list.component';

describe('DualListComponent', () => {
    let component: DualListComponent;
    let fixture: ComponentFixture<DualListComponent>;

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
            DualListComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
  });

    beforeEach(() => {
        fixture = TestBed.createComponent(DualListComponent);
        component = fixture.componentInstance;
    });

    it('should display heading labels', () => {
        fixture.detectChanges();
        const labels = fixture.debugElement.queryAll(By.css('.ama-dual-list-heading'));
        expect(labels.length).toBe(2);
        expect(labels[0].nativeElement.textContent.trim()).toEqual('SDK.DUAL_LIST.DEFAULT_NOT_SELECTED_LABEL');
        expect(labels[1].nativeElement.textContent.trim()).toEqual('SDK.DUAL_LIST.DEFAULT_SELECTED_LABEL');
    });

    it('should display heading buttons labels', () => {
        fixture.detectChanges();
        const buttons = fixture.debugElement.queryAll(By.css('.ama-dual-list-heading-button'));
        expect(buttons.length).toBe(2);
        expect(buttons[0].nativeElement.textContent.trim()).toEqual('SDK.DUAL_LIST.SELECT_ALL');
        expect(buttons[1].nativeElement.textContent.trim()).toEqual('SDK.DUAL_LIST.REMOVE_ALL');
    });

    it('should emit selected items change when SELECT ALL button is clicked', () => {
        component.unselectedItems = mockAvailablePets;
        fixture.detectChanges();

        const selectedItemsChangeSpy = spyOn(component.selectedItemsChange, 'emit');
        const selectAllButtons: HTMLButtonElement = fixture.debugElement.queryAll(By.css('.ama-dual-list-heading-button'))[0].nativeElement;
        selectAllButtons.click();

        expect(selectedItemsChangeSpy).toHaveBeenCalledWith(mockAvailablePets);
    });

    it('should emit selected items change when REMOVE ALL button is clicked', () => {
        component.selectedItems = mockPreselectedPets;
        fixture.detectChanges();

        const selectedItemsChangeSpy = spyOn(component.selectedItemsChange, 'emit');
        const removeAllButtons: HTMLButtonElement = fixture.debugElement.queryAll(By.css('.ama-dual-list-heading-button'))[1].nativeElement;
        removeAllButtons.click();

        expect(selectedItemsChangeSpy).toHaveBeenCalledWith([]);
    });

    it('should NOT emit when unselectedItems array is empty on SELECT ALL button click', () => {
        component.unselectedItems = [];
        component.selectedItems = [...mockPreselectedPets];
        fixture.detectChanges();

        const selectedItemsChangeSpy = spyOn(component.selectedItemsChange, 'emit');

        const selectAllButtons: HTMLButtonElement = fixture.debugElement.queryAll(By.css('.ama-dual-list-heading-button'))[0].nativeElement;
        selectAllButtons.click();

        expect(component.selectedItems.length).toBe(2);
        expect(component.unselectedItems.length).toBe(0);
        expect(selectedItemsChangeSpy).toHaveBeenCalledTimes(0);
    });

    it('should NOT emit when selectedItems array is empty on REMOVE ALL button click', () => {
        component.unselectedItems = [...mockAvailablePets];
        component.selectedItems = [];
        fixture.detectChanges();

        const selectedItemsChangeSpy = spyOn(component.selectedItemsChange, 'emit');

        const removeAllButtons: HTMLButtonElement = fixture.debugElement.queryAll(By.css('.ama-dual-list-heading-button'))[1].nativeElement;
        removeAllButtons.click();

        expect(component.selectedItems.length).toBe(0);
        expect(component.unselectedItems.length).toBe(2);
        expect(selectedItemsChangeSpy).toHaveBeenCalledTimes(0);
    });

    it('should move item from unselected to selected on select item', () => {
        component.unselectedItems = [...mockAvailablePets];
        component.selectedItems = [...mockPreselectedPets];
        fixture.detectChanges();

        const selectedItemsChangeSpy = spyOn(component.selectedItemsChange, 'emit');

        const unselectedItems = fixture.debugElement.queryAll(By.css('modelingsdk-dual-list-items'))[0];
        unselectedItems.triggerEventHandler('selectItem', mockAvailablePets[0]);
        fixture.detectChanges();

        expect(component.selectedItems[2]).toBe(mockAvailablePets[0]);
        expect(component.selectedItems.length).toBe(3);
        expect(component.unselectedItems.length).toBe(1);
        expect(selectedItemsChangeSpy).toHaveBeenCalledWith(component.selectedItems);
    });

    it('should move all items from unselected to selected on SELECT ALL button click', () => {
        component.unselectedItems = [...mockAvailablePets];
        component.selectedItems = [...mockPreselectedPets];
        fixture.detectChanges();

        const selectedItemsChangeSpy = spyOn(component.selectedItemsChange, 'emit');

        const selectAllButtons: HTMLButtonElement = fixture.debugElement.queryAll(By.css('.ama-dual-list-heading-button'))[0].nativeElement;
        selectAllButtons.click();

        expect(component.selectedItems[2]).toBe(mockAvailablePets[0]);
        expect(component.selectedItems[3]).toBe(mockAvailablePets[1]);
        expect(component.selectedItems.length).toBe(4);
        expect(component.unselectedItems.length).toBe(0);
        expect(selectedItemsChangeSpy).toHaveBeenCalledWith(component.selectedItems);
    });

    it('should move item from selected to unselected on unselect item', () => {
        component.unselectedItems = [...mockAvailablePets];
        component.selectedItems = [...mockPreselectedPets];
        fixture.detectChanges();

        const selectedItemsChangeSpy = spyOn(component.selectedItemsChange, 'emit');

        const selectedItems = fixture.debugElement.queryAll(By.css('modelingsdk-dual-list-items'))[1];
        selectedItems.triggerEventHandler('selectItem', mockPreselectedPets[0]);
        fixture.detectChanges();

        expect(component.unselectedItems[2]).toBe(mockPreselectedPets[0]);
        expect(component.selectedItems.length).toBe(1);
        expect(component.unselectedItems.length).toBe(3);
        expect(selectedItemsChangeSpy).toHaveBeenCalledWith(component.selectedItems);
    });

    it('should move all items from selected to unselected on REMOVE ALL button click', () => {
        component.unselectedItems = [...mockAvailablePets];
        component.selectedItems = [...mockPreselectedPets];
        fixture.detectChanges();

        const selectedItemsChangeSpy = spyOn(component.selectedItemsChange, 'emit');

        const removeAllButtons: HTMLButtonElement = fixture.debugElement.queryAll(By.css('.ama-dual-list-heading-button'))[1].nativeElement;
        removeAllButtons.click();

        expect(component.unselectedItems[2]).toBe(mockPreselectedPets[0]);
        expect(component.unselectedItems[3]).toBe(mockPreselectedPets[1]);
        expect(component.selectedItems.length).toBe(0);
        expect(component.unselectedItems.length).toBe(4);
        expect(selectedItemsChangeSpy).toHaveBeenCalledWith([]);
    });
});
