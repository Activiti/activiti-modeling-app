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

import { TranslateModule } from '@ngx-translate/core';
import { MatChipsModule, MatAutocompleteModule } from '@angular/material';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PropertiesViewerArrayInputComponent } from './array-input.component';

describe('PropertiesViewerArrayInputComponent', () => {
    let component: PropertiesViewerArrayInputComponent;
    let fixture: ComponentFixture<PropertiesViewerArrayInputComponent>;
    let element: HTMLElement;

    const currentValue = ['one', 'two', 'three'];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                MatChipsModule,
                MatAutocompleteModule
            ],
            declarations: [PropertiesViewerArrayInputComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerArrayInputComponent);
        element = fixture.debugElement.nativeElement;
        component = fixture.componentInstance;
        component.value = [].concat(currentValue);
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the cancel button if is disabled', () => {
        const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
        chips.forEach((chip) => expect(chip.textContent.trim().endsWith('cancel')).toEqual(true));
    });

    it('should show the input value when it has value', () => {
        component.disabled = true;
        fixture.detectChanges();
        const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
        chips.forEach((chip, index) => expect(chip.textContent.trim()).toEqual(currentValue[index]));
    });

    it('should remove element when cancel button is clicked', () => {
        const chipRemoveIcons: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-icon.mat-chip-remove');
        chipRemoveIcons.item(0).click();
        fixture.detectChanges();
        expect(component.data).toEqual(['two', 'three']);
    });

    it('should emit value when element is removed', () => {
        spyOn(component.change, 'emit');
        const chipRemoveIcons: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-icon.mat-chip-remove');
        chipRemoveIcons.item(0).click();
        fixture.detectChanges();
        expect(component.change.emit).toHaveBeenCalledWith(['two', 'three']);
    });

    it('should emit value when element is added', () => {
        spyOn(component.change, 'emit');
        component.arrayInput.nativeElement.value = 'four';
        component.add({ input: component.arrayInput.nativeElement, value: 'four' });
        expect(component.change.emit).toHaveBeenCalledWith(['one', 'two', 'three', 'four']);
    });
});
