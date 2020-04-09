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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MappingType } from '../../api/types';
import { OutputMappingTableComponent } from './output-mapping-table.component';
import { DialogService } from '../../confirmation-dialog/services/dialog.service';
import { OutputMappingTableModule } from './output-mapping-table.module';
import { MatDialog } from '@angular/material';
import { CoreModule } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { selectSelectedTheme } from '../../store/app.selectors';
import { mockDropDownFields, mockDropDownProcessVariable, mockValueMapping } from './output-mapping-table.component.mock';

describe('OutputMappingTableComponent', () => {
    let fixture: ComponentFixture<OutputMappingTableComponent>;
    let component: OutputMappingTableComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                OutputMappingTableModule,
                NoopAnimationsModule,
                FormsModule
            ],
            providers: [
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(selector => {
                            if (selector === selectSelectedTheme) {
                                return of('vs-light');
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                DialogService,
                MatDialog
            ], schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OutputMappingTableComponent);
        component = fixture.componentInstance;
        component.parameters = [{
            id: 'id1',
            name: 'name',
            description: 'desc',
            type: 'string'
        }, {
            id: 'idToFilter',
            name: 'variables.filterMe',
            description: 'this is the parameter that needs to be filtered',
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
            },
            {
                id: 'stringVarId',
                name: 'stringVar',
                type: 'string',
                required: false,
                value: ''
            }
        ];
        component.mapping = {};

        component.ngOnChanges();
        fixture.detectChanges();
    });

    it('should render component', () => {
        expect(component).not.toBeNull();
    });

    it('should emit the correct data when a property value is set', () => {
        spyOn(component.update, 'emit');
        const select = fixture.debugElement.query(By.css('.mat-select-trigger'));
        select.nativeElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        options[0].nativeElement.click();
        fixture.detectChanges();

        const data = {
            [component.processProperties[0].name]: {
                type: MappingType.variable,
                value: component.parameters[0].name
            }
        };
        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should emit the correct data when a property value is reset', () => {
        component.mapping = {
            [component.processProperties[0].name]: {
                type: MappingType.variable,
                value: component.parameters[0].name
            }
        };
        component.ngOnChanges();
        fixture.detectChanges();

        spyOn(component.update, 'emit');

        const select = fixture.debugElement.query(By.css('.mat-select-trigger'));
        select.nativeElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        options[1].nativeElement.click();
        fixture.detectChanges();

        const data = {
            [component.processProperties[2].name]: {
                type: MappingType.variable,
                value: component.parameters[0].name
            }
        };

        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should filter the processProperties', () => {
        const select = fixture.debugElement.query(By.css('.mat-select-trigger'));
        select.nativeElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        expect(options.length).toBe(2, 'Two options are expected from type: string');
    });

    it('should filter the form variables labeled as variables. in the name', () => {
        const select = fixture.debugElement.queryAll(By.css('mat-table .mat-row'));
        const spanLabel = fixture.debugElement.query(By.css('mat-table .mat-row .mat-column-name > span'));
        expect(select).not.toBeNull();
        expect(select.length).toBe(1);
        expect(spanLabel.nativeElement.textContent).toBe('name');
    });

    it('should display a message if no process property', () => {
        component.parameters[0].type = 'boolean';
        component.ngOnChanges();
        fixture.detectChanges();

        const select = fixture.debugElement.query(By.css('.mat-select'));
        const noPropMsg = fixture.debugElement.query(By.css('.no-process-properties-msg'));

        expect(select).toBeNull();
        expect(noPropMsg).not.toBeNull();
    });

    it('if a parameter is marked non-required then None value will appear first in the properties list to choose from', () => {
        component.parameters.push({ id: 'id2', name: 'name2', type: 'string', required: false });
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.optionsForParams[1][0]).toEqual({ id: null, name: 'None' });
    });

    it('if a parameter is marked required or not marked at all then None value will appear first in the properties list to choose from', () => {
        component.parameters.push({ id: 'id3', name: 'name3', type: 'string', required: true });
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.optionsForParams[0]).toEqual([
            component.processProperties[0],
            component.processProperties[2]
        ]);
        expect(component.optionsForParams[1]).toEqual([
            component.processProperties[0],
            component.processProperties[2]
        ]);
    });

    it('should update the value if mapping type is expression', () => {
        component.parameters.concat(mockDropDownFields);
        component.processProperties = mockDropDownProcessVariable;
        component.mapping = <any> mockValueMapping;

        component.ngOnChanges();
        fixture.detectChanges();
        expect(component.data).toEqual(mockValueMapping);

        component.changeSelection({ value: 'dId' }, 0, mockDropDownFields[0]);
        let updatedMapping = {
            ...mockValueMapping,
            'dId': {
                type: 'value',
                value: '${Dropdown009gay.id}'
            }
        };

        component.changeSelection({ value: 'text' }, 0, mockDropDownFields[4]);
        updatedMapping = <any> {
            ...updatedMapping,
            'text': {
                type: 'variable',
                value: 'Text0yru6p'
            }
        };
        expect(component.data).toEqual(updatedMapping);
    });
});
