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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { EntityProperty } from '../../../api/types';
import { exampleJSONSchema } from '../../../mocks/json-schema.mock';
import { expectedHierarchy, expectedItems } from '../../../mocks/modeling-json-schema.service.mock';
import { provideModelingJsonSchemaProvider } from '../../../services/modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../services/registered-inputs-modeling-json-schema-provider.service';
import { PropertiesViewerStringInputComponent, PropertiesViewerIntegerInputComponent, PropertiesViewerJsonInputComponent } from '../../public-api';
import { AutomationIdPipe } from '../property-type-item/automation-id.pipe';
import { PropertyTypeItemUiComponent } from '../property-type-item/property-type-item.ui-component';
import { PropertiesViewerBooleanInputComponent } from '../value-type-inputs/boolean-input.component';
import { provideInputTypeItemHandler } from '../value-type-inputs/value-type-inputs';

import { PropertyTypeSelectorSmartComponent } from './property-type-selector.smart-component';

describe('PropertyTypeSelectorSmartComponent', () => {
    let component: PropertyTypeSelectorSmartComponent;
    let fixture: ComponentFixture<PropertyTypeSelectorSmartComponent>;
    let element: HTMLElement;
    const property: EntityProperty = {
        id: 'test',
        name: 'testProperty',
        type: 'string',
        description: 'this is a test property'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MatFormFieldModule,
                MatMenuModule,
                MatInputModule,
                MatIconModule,
                MatTooltipModule,
                MatDialogModule,
                TranslateModule.forRoot(),
                MatProgressBarModule
            ],
            declarations: [PropertyTypeSelectorSmartComponent, PropertyTypeItemUiComponent, AutomationIdPipe],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideInputTypeItemHandler('integer', PropertiesViewerIntegerInputComponent),
                provideInputTypeItemHandler('boolean', PropertiesViewerBooleanInputComponent),
                provideInputTypeItemHandler('json', PropertiesViewerJsonInputComponent),
                provideInputTypeItemHandler('employee', PropertiesViewerJsonInputComponent, 'json', exampleJSONSchema),
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider)
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyTypeSelectorSmartComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;

        component.property = { ...property };
        component.ngOnChanges({ property: { currentValue: property, previousValue: null, firstChange: false, isFirstChange: () => false } });
        fixture.detectChanges();
    });

    it('should initialize values on init', () => {
        expect(component.displayedValue).toEqual('string');
        expect(component.displayedIcon).toEqual('assignment_turned_in');
        expect(component.displayedCustomIcon).toEqual(false);
    });

    it('should filter only primitive types', () => {
        component.onlyPrimitiveTypes = true;
        component.ngOnChanges({ onlyPrimitiveTypes: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
        fixture.detectChanges();

        expect(component.hierarchy).toEqual(expectedHierarchy);
    });

    it('should update values when selection changes', () => {
        component.onSelectionChanges(expectedItems[0].children[1]);
        expect(component.displayedValue).toEqual('employee');
        expect(component.displayedIcon).toEqual('assignment_turned_in');
        expect(component.displayedCustomIcon).toEqual(false);
    });

    it('should emit the value when selection changes', () => {
        spyOn(component.change, 'emit');
        component.onSelectionChanges(expectedItems[0].children[0]);

        const expectedProperty = {
            ...component.property,
            type: 'boolean',
            model: {
                $ref: '#/$defs/primitive/boolean',
            }
        };

        expect(component.change.emit).toHaveBeenCalledWith(expectedProperty);
    });

    it('should clear the value when Delete key is pushed', () => {
        element.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Delete', bubbles: true }));
        fixture.detectChanges();
        expect(component.displayedValue).toEqual(null);
        expect(component.displayedIcon).toEqual(null);
        expect(component.displayedCustomIcon).toEqual(false);
    });

    it('should emit the property with cleared type when Delete key is pushed', () => {
        spyOn(component.change, 'emit');
        element.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Delete', bubbles: true }));
        fixture.detectChanges();
        expect(component.change.emit).toHaveBeenCalledWith({ ...property, type: undefined, model: undefined });
    });

    it('should clear the value when Backspace key is pushed', () => {
        element.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Backspace', bubbles: true }));
        fixture.detectChanges();
        expect(component.displayedValue).toEqual(null);
        expect(component.displayedIcon).toEqual(null);
        expect(component.displayedCustomIcon).toEqual(false);
    });

    it('should emit the property with cleared type when Backspace key is pushed', () => {
        spyOn(component.change, 'emit');
        element.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Backspace', bubbles: true }));
        fixture.detectChanges();
        expect(component.change.emit).toHaveBeenCalledWith({ ...property, type: undefined, model: undefined });
    });

    it('should open menu when a non remove key is pushed', () => {
        spyOn(component.trigger, 'openMenu');
        element.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter', bubbles: true }));
        fixture.detectChanges();
        expect(component.trigger.openMenu).toHaveBeenCalled();
    });

    it('should display selectedDisplayedValue if present on init', () => {
        component.property.type = 'boolean';
        component.ngOnChanges({ property: { currentValue: { ...property, type: 'boolean' }, previousValue: property, firstChange: false, isFirstChange: () => false } });
        fixture.detectChanges();
        expect(component.displayedValue).toEqual('boolean');

        component.property.type = 'integer';
        component.ngOnChanges({
            property: {
                currentValue: { ...property, type: 'integer' },
                previousValue: { ...property, type: 'boolean' },
                firstChange: false,
                isFirstChange: () => false
            }
        });
        fixture.detectChanges();
        expect(component.displayedValue).toEqual('integer');
    });

    it('should display selectedDisplayedValue if present when changes', () => {
        component.onSelectionChanges(expectedItems[0].children[0]);
        fixture.detectChanges();
        expect(component.displayedValue).toEqual('boolean');

        component.onSelectionChanges(expectedItems[0].children[2]);
        fixture.detectChanges();
        expect(component.displayedValue).toEqual('integer');
    });

    it('should use static hierarchy when provided', () => {
        const staticHierarchy = [
            {
                displayName: 'custom 1',
                iconName: 'assignment_returned',
                isCustomIcon: false,
                provider: 'custom-provider',
                typeId: ['custom', '1'],
                value: {
                    $ref: '#/$defs/custom/1'
                }
            },
            {
                displayName: 'custom 2',
                iconName: 'assignment_returned',
                isCustomIcon: false,
                provider: 'custom-provider',
                typeId: ['custom', '2'],
                value: {
                    $ref: '#/$defs/custom/2'
                }
            }
        ];

        expect(component.hierarchy).not.toEqual(staticHierarchy);

        component.staticHierarchy = staticHierarchy;
        component.ngOnChanges({
            staticHierarchy: {
                currentValue: staticHierarchy,
                firstChange: true,
                isFirstChange: () => true,
                previousValue: []
            }
        });

        expect(component.hierarchy).toEqual(staticHierarchy);
    });

    it('should include custom edit item if is custom model', () => {
        const hierarchWithAddCustomModel = [...expectedHierarchy];
        expectedHierarchy[1] = {
            displayName: 'SDK.PROPERTY_TYPE_SELECTOR.EDIT_MODEL',
            description: 'SDK.PROPERTY_TYPE_SELECTOR.EDIT_MODEL_DESCRIPTION',
            isCustomIcon: false,
            iconName: 'note_alt',
            value: { type: 'object' },
            provider: 'PropertyTypeSelectorSmartComponent'
        };
        component.onlyPrimitiveTypes = true;

        component.ngOnChanges({
            onlyPrimitiveTypes: {
                currentValue: true,
                previousValue: false,
                firstChange: false,
                isFirstChange: () => false
            },
            property: {
                currentValue: {
                    model: { type: 'object' }
                },
                firstChange: true,
                isFirstChange: () => true,
                previousValue: []
            }
        });

        expect(component.hierarchy).toEqual(hierarchWithAddCustomModel);
    });

    it('should set the correct selected type when property is primitive but does not have model', () => {
        const myProperty = { ...property, type: 'json', model: undefined };
        component.property = myProperty;

        component.ngOnChanges({ property: { currentValue: myProperty, previousValue: property, firstChange: false, isFirstChange: () => false } });
        fixture.detectChanges();

        expect(component.displayedValue).toEqual('json');
        expect(component.displayedIcon).toEqual('assignment_turned_in');
        expect(component.displayedCustomIcon).toEqual(false);
    });
});
