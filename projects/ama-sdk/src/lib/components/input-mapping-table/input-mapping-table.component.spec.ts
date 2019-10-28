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


import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MappingType } from '../../api/types';
import { InputMappingTableComponent, NoneValue } from './input-mapping-table.component';
import { InputMappingTableModule } from './input-mapping-table.module';
import { CoreModule } from '@alfresco/adf-core';

describe('InputMappingTableComponent', () => {
    let fixture: ComponentFixture<InputMappingTableComponent>;
    let component: InputMappingTableComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                InputMappingTableModule,
                NoopAnimationsModule,
                FormsModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InputMappingTableComponent);
        component = fixture.componentInstance;
        component.parameters = [{
            id: 'id1',
            name: 'name',
            description: 'desc',
            required: false,
            type: 'string'
        }];
        component.processProperties = [
            {
                id: '1',
                name: 'var1',
                type: 'string',
                required: false,
                value: ''
            },
            {
                id: '2',
                name: 'var2',
                type: 'date',
                required: false,
                value: ''
            }
        ];
        component.mapping = {};

        component.ngOnChanges();
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should render component', () => {
        expect(component).not.toBeNull();
    });

    it('should emit the correct data when a property value is set to a variable', () => {
        spyOn(component.update, 'emit');
        const select = fixture.debugElement.query(By.css('.mat-select-trigger'));
        select.nativeElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        options[1].nativeElement.click();
        fixture.detectChanges();

        const data = { ...component.data, [component.parameters[0].name]: {
            type: MappingType.variable,
            value: component.processProperties[0].name
        }};
        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should emit the correct data when a required property variable is reset to None', () => {
        spyOn(component.update, 'emit');
        component.parameters[0].required = true;
        component.mapping = {
            'name' : {
                type: MappingType.variable,
                value: 'var1'
            }
        };
        component.ngOnChanges();
        fixture.detectChanges();

        const select = fixture.debugElement.query(By.css('.mat-select-trigger'));
        select.nativeElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();

        const data = {
            'name' : {
                type: MappingType.variable,
                value: null
            }
        };
        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should emit the correct data when a NON-required property variable is reset to None', () => {
        spyOn(component.update, 'emit');
        component.parameters[0].required = false;
        component.mapping = {
            'name' : {
                type: MappingType.variable,
                value: 'var1'
            }
        };
        component.ngOnChanges();
        fixture.detectChanges();

        const select = fixture.debugElement.query(By.css('.mat-select-trigger'));
        select.nativeElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();

        const data = {};
        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should filter the processProperties', () => {
        const select = fixture.debugElement.query(By.css('.mat-select-trigger'));
        select.nativeElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        expect(options.length).toBe(2);
    });

    it('should display a message if no process property in case of required parameter if there is no matching type', () => {
        component.parameters[0].type = 'boolean';
        component.parameters[0].required = true;
        component.ngOnChanges();
        fixture.detectChanges();

        const select = fixture.debugElement.query(By.css('.mat-select'));
        const noPropMsg = fixture.debugElement.query(By.css('.no-process-properties-msg'));

        expect(select).toBeNull();
        expect(noPropMsg).not.toBeNull();
    });

    it('should display a selectbox with "None" as first option in case of non-required parameter if there is a matching type', () => {
        component.parameters[0].type = 'string';
        component.parameters[0].required = true;
        component.ngOnChanges();
        fixture.detectChanges();

        const select = fixture.debugElement.query(By.css('.mat-select'));
        const noPropMsg = fixture.debugElement.query(By.css('.no-process-properties-msg'));

        expect(select).not.toBeNull();
        expect(noPropMsg).toBeNull();
        expect(component.optionsForParams['name'][0]).toEqual({id: NoneValue, name: 'None'});
    });

    it('should display a selectbox with "None" as first option in case of non-required parameter', () => {
        component.parameters[0].type = 'string';
        component.parameters[0].required = false;
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.optionsForParams['name'][0]).toEqual({id: NoneValue, name: 'None'});
    });

    it('clicking on the icon should toggle it', () => {
        component.mappingTypes['name'] = MappingType.variable;
        fixture.detectChanges();
        const icon = fixture.debugElement.query(By.css('.amasdk-input-mapping-table__mapping-icon'));
        icon.nativeElement.click();
        fixture.detectChanges();

        expect(component.mappingTypes['name']).toBe(MappingType.value);
    });

    it('when layers icon is visible process variables select box is visible', () => {
        component.mappingTypes['name'] = MappingType.variable;
        fixture.detectChanges();
        const selectBox = fixture.debugElement.query(By.css('.mat-select'));

        expect(selectBox).not.toBeNull();
    });

    it('when layers_clear icon is visible process value input box is visible', () => {
        component.mappingTypes['name'] = MappingType.value;
        fixture.detectChanges();
        const inputBox = fixture.debugElement.query(By.css('.amasdk-input-mapping-table__mapped-value'));

        expect(inputBox).not.toBeNull();
    });

});
