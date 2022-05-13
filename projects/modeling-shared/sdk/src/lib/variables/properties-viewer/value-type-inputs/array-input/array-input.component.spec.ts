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
import { TranslateModule } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ArrayInputExtendedProperties, PropertiesViewerArrayInputComponent } from './array-input.component';
import { ValueTypeInputComponent } from '../../value-type-input.component';
import { MatDialog } from '@angular/material/dialog';
import { PropertiesViewerModeledObjectInputComponent } from '../modeled-object/modeled-object-input.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ArrayInputDialogComponent } from './array-input-dialog/array-input-dialog.component';
import { VariableValuePipe } from '../../variable-value.pipe';
import { PropertiesViewerStringInputComponent } from '../string-input/string-input.component';
import { provideInputTypeItemHandler } from '../value-type-inputs';
import { JSONSchemaToEntityPropertyService } from '../../../../services/json-schema-to-entity-property.service';
import { ModelingJSONSchemaService } from '../../../../services/modeling-json-schema.service';
import { CodeEditorService } from '../../../../code-editor/services/code-editor-service.service';
import { provideModelingJsonSchemaProvider } from '../../../../services/modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../../services/registered-inputs-modeling-json-schema-provider.service';

describe('PropertiesViewerArrayInputComponent', () => {
    let component: PropertiesViewerArrayInputComponent;
    let fixture: ComponentFixture<PropertiesViewerArrayInputComponent>;
    let element: HTMLElement;
    let dialogService: MatDialog;

    const mockDialog = {
        open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of({ name: 'four' }) }),
        close: jasmine.createSpy('close')
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                MatChipsModule,
                MatAutocompleteModule,
            ],
            declarations: [
                PropertiesViewerArrayInputComponent,
                ValueTypeInputComponent,
                VariableValuePipe,
                PropertiesViewerStringInputComponent,
                PropertiesViewerModeledObjectInputComponent
            ],
            providers: [
                JSONSchemaToEntityPropertyService,
                ModelingJSONSchemaService,
                CodeEditorService,
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MatDialog, useValue: mockDialog },
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideInputTypeItemHandler('array', PropertiesViewerArrayInputComponent),
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider)
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerArrayInputComponent);
        dialogService = TestBed.inject(MatDialog);
        element = fixture.debugElement.nativeElement;
        component = fixture.componentInstance;
    });

    describe('string', () => {
        const value = ['one', 'two', 'three'];

        beforeEach(() => {
            component.value = value;
            component.ngOnChanges();
            fixture.detectChanges();
        });

        it('should display the cancel button if is not disabled', () => {
            const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
            chips.forEach((chip) => expect(chip.textContent.trim().endsWith('cancel')).toEqual(true));
        });

        it('should show the value in chips when it has value', () => {
            component.disabled = true;
            fixture.detectChanges();
            const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
            chips.forEach((chip, index) => expect(chip.textContent.trim()).toEqual(value[index]));
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
            component.stringInput.nativeElement.value = 'four';
            component.add({ input: component.stringInput.nativeElement, value: 'four' });
            expect(component.change.emit).toHaveBeenCalledWith(['one', 'two', 'three', 'four']);
        });
    });

    describe('primitive', () => {
        const value = [{ one: 'one' }, { two: 'two' }, { three: 'three' }];
        const extendedProperties: ArrayInputExtendedProperties = {
            getDefaultAutocompleteValues: () => [],
            getFilteredAutocompleteValues: () => [],
            values: 'json'
        };

        beforeEach(() => {
            component.value = value;
            component.extendedProperties = extendedProperties;
            component.ngOnChanges();
            fixture.detectChanges();
        });

        it('should display the cancel button if is not disabled', () => {
            const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
            chips.forEach((chip) => expect(chip.textContent.trim().endsWith('cancel')).toEqual(true));
        });

        it('should show the input value when it has value', () => {
            component.disabled = true;
            fixture.detectChanges();
            const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
            chips.forEach((chip, index) => expect(JSON.parse(chip.textContent.trim())).toEqual(value[index]));
        });

        it('should remove element when cancel button is clicked', () => {
            const chipRemoveIcons: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-icon.mat-chip-remove');
            chipRemoveIcons.item(0).click();
            fixture.detectChanges();
            expect(component.data).toEqual([{ two: 'two' }, { three: 'three' }]);
        });

        it('should emit value when element is removed', () => {
            spyOn(component.change, 'emit');
            const chipRemoveIcons: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-icon.mat-chip-remove');
            chipRemoveIcons.item(0).click();
            fixture.detectChanges();
            expect(component.change.emit).toHaveBeenCalledWith([{ two: 'two' }, { three: 'three' }]);
        });

        it('should emit value when element is added', async () => {
            spyOn(component.change, 'emit');
            component.primitiveValue = { four: 'four' };
            fixture.detectChanges();
            await fixture.whenStable();
            const addButton = fixture.debugElement.query(By.css('.ama-variable-array-input-primitive-input-button')).nativeElement;
            await addButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.change.emit).toHaveBeenCalledWith([{ one: 'one' }, { two: 'two' }, { three: 'three' }, { four: 'four' }]);
        });
    });

    describe('object', () => {
        const value = [{ name: 'one' }, { name: 'two' }, { name: 'three' }];
        const extendedProperties: ArrayInputExtendedProperties = {
            getDefaultAutocompleteValues: () => [],
            getFilteredAutocompleteValues: () => []
        };
        const model = {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                }
            }
        };

        beforeEach(() => {
            component.value = value;
            component.extendedProperties = extendedProperties;
            component.model = model;
            component.ngOnChanges();
            fixture.detectChanges();
        });

        it('should display the cancel button if is not disabled', () => {
            const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
            chips.forEach((chip) => expect(chip.textContent.trim().endsWith('cancel')).toEqual(true));
        });

        it('should show the input value when it has value', () => {
            component.disabled = true;
            fixture.detectChanges();
            const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
            chips.forEach((chip, index) => expect(JSON.parse(chip.textContent.trim())).toEqual(value[index]));
        });

        it('should remove element when cancel button is clicked', () => {
            const chipRemoveIcons: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-icon.mat-chip-remove');
            chipRemoveIcons.item(0).click();
            fixture.detectChanges();
            expect(component.data).toEqual([{ name: 'two' }, { name: 'three' }]);
        });

        it('should emit value when element is removed', () => {
            spyOn(component.change, 'emit');
            const chipRemoveIcons: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-icon.mat-chip-remove');
            chipRemoveIcons.item(0).click();
            fixture.detectChanges();
            expect(component.change.emit).toHaveBeenCalledWith([{ name: 'two' }, { name: 'three' }]);
        });

        it('should open the object dialog when add button clicked', () => {
            const addButton = fixture.debugElement.query(By.css('.ama-variable-array-input-object-button')).nativeElement;
            addButton.click();
            fixture.detectChanges();

            const expectedData = {
                width: '600px',
                data: {
                    title: 'SDK.VARIABLE_TYPE_INPUT.ARRAY_INPUT.VALUE_TO_ADD_TO_ARRAY',
                    model: model.items,
                    disabled: undefined,
                    autocompletionContext: []
                }
            };

            expect(dialogService.open).toHaveBeenCalledWith(ArrayInputDialogComponent, expectedData);
        });

        it('should add the object when dialog closed with value', async () => {
            spyOn(component.change, 'emit');
            const addButton = fixture.debugElement.query(By.css('.ama-variable-array-input-object-button')).nativeElement;
            await addButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.change.emit).toHaveBeenCalledWith([{ name: 'one' }, { name: 'two' }, { name: 'three' }, { name: 'four' }]);
        });

        it('should open the object dialog with value when editing a chip', () => {
            component.editObject(value[0], 0);

            const expectedData = {
                width: '600px',
                data: {
                    title: 'SDK.VARIABLE_TYPE_INPUT.ARRAY_INPUT.EDIT_VALUE',
                    model: model.items,
                    disabled: undefined,
                    value: value[0],
                    autocompletionContext: []
                }
            };

            expect(dialogService.open).toHaveBeenCalledWith(ArrayInputDialogComponent, expectedData);
        });

        it('should edit the object when dialog closed with value', async () => {
            spyOn(component.change, 'emit');
            component.editObject(value[0], 0);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.change.emit).toHaveBeenCalledWith([{ name: 'four' }, { name: 'two' }, { name: 'three' }]);
        });
    });

    describe('model references primitive type', () => {
        const value = [1, 2, 3];
        const extendedProperties: ArrayInputExtendedProperties = {
            getDefaultAutocompleteValues: () => [],
            getFilteredAutocompleteValues: () => []
        };
        const model = {
            type: 'integer'
        };

        beforeEach(() => {
            component.value = value;
            component.extendedProperties = extendedProperties;
            component.model = model;
            component.ngOnChanges();
            fixture.detectChanges();
        });

        it('should display the cancel button if is not disabled', () => {
            const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
            chips.forEach((chip) => expect(chip.textContent.trim().endsWith('cancel')).toEqual(true));
        });

        it('should show the input value when it has value', () => {
            component.disabled = true;
            fixture.detectChanges();
            const chips: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-chip');
            chips.forEach((chip, index) => expect(JSON.parse(chip.textContent.trim())).toEqual(value[index]));
        });

        it('should remove element when cancel button is clicked', () => {
            const chipRemoveIcons: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-icon.mat-chip-remove');
            chipRemoveIcons.item(0).click();
            fixture.detectChanges();
            expect(component.data).toEqual([2, 3]);
        });

        it('should emit value when element is removed', () => {
            spyOn(component.change, 'emit');
            const chipRemoveIcons: NodeListOf<HTMLInputElement> = element.querySelectorAll('mat-icon.mat-chip-remove');
            chipRemoveIcons.item(0).click();
            fixture.detectChanges();
            expect(component.change.emit).toHaveBeenCalledWith([2, 3]);
        });

        it('should emit value when element is added', async () => {
            spyOn(component.change, 'emit');
            component.primitiveValue = 4;
            fixture.detectChanges();
            await fixture.whenStable();
            const addButton = fixture.debugElement.query(By.css('.ama-variable-array-input-primitive-input-button')).nativeElement;
            await addButton.click();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.change.emit).toHaveBeenCalledWith([1, 2, 3, 4]);
        });
    });
});
