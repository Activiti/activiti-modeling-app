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
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { PropertiesViewerComponent } from './properties-viewer.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { VariablesService } from '../variables.service';
import { UuidService } from './../../services/uuid.service';
import { VariableValuePipe } from './variable-value.pipe';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { INPUT_TYPE_ITEM_HANDLER } from './value-type-inputs/value-type-inputs';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CodeEditorModule, ExpressionsEditorService } from './../../../public-api';
import { CoreModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { ValueTypeInputComponent } from './value-type-input.component';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { CommonModule } from '@angular/common';

describe('PropertiesViewerComponent', () => {
    let fixture: ComponentFixture<PropertiesViewerComponent>;
    let component: PropertiesViewerComponent;
    let service: VariablesService;

    const mockDialog = {
        close: jest.fn()
    };
    const data = {
        '123' : {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': ''},
        '234' : {'id': '234', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
        '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                VariablesService,
                DialogService,
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: Store, useValue: { dispatch: jest.fn(), select: jest.fn().mockReturnValue(of()) }},
                { provide: UuidService, useValue: { generate() { return 'generated-uuid'; } } },
                { provide: INPUT_TYPE_ITEM_HANDLER, useValue: [] },
                {
                    provide: ExpressionsEditorService, useValue: {
                        initExpressionEditor: jest.fn()
                    }
                },
                { provide: TranslationService, useClass: TranslationMock },
            ],
            declarations: [PropertiesViewerComponent, VariableValuePipe, ValueTypeInputComponent],
            imports: [
                CoreModule,
                MatTableModule,
                TranslateModule.forRoot(),
                FormsModule,
                NoopAnimationsModule,
                CodeEditorModule,
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerComponent);
        service = TestBed.inject(VariablesService);
        component = fixture.componentInstance;
        component.dataSource = new MatTableDataSource(Object.values(data));
        fixture.detectChanges();
    });

    it('should call sendData of VariableDialogService when clicking on delete ', () => {
        component.requiredCheckbox = true;
        component.data = data;
        fixture.detectChanges();
        spyOn(service, 'sendData');

        const button = fixture.nativeElement.querySelector('.delete-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const data2 = {
            '234' : {'id': '234', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
            '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
        };

        expect(service.sendData).toHaveBeenCalledWith(JSON.stringify(data2, null, 2), null);
        expect(component.data).toEqual(data2);
    });

    it('should have the same number of rows as properties in table', () => {
        component.requiredCheckbox = true;
        const data1 = {
          '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': ''},
          '243':  {'id': '243', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
          '345': {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
        };

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();

        const rows = fixture.nativeElement.querySelectorAll('mat-row');
        expect(rows.length).toEqual(3);
    });

    it('should show no properties if row was not clicked', () => {
        component.requiredCheckbox = true;
        component.data = data;
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-properties-form');
        const message = fixture.nativeElement.querySelector('.ama-no-properties');

        expect(template === null).toBeTruthy();
        expect(message === null).toBeFalsy();
        expect(message.innerHTML).toEqual('SDK.VARIABLES_EDITOR.TABLE.NO_PROPERTIES');
    });

    it('should show edit form if row was clicked', () => {
        component.requiredCheckbox = true;
        component.data = data;
        fixture.detectChanges();

        const editRow = fixture.nativeElement.querySelector('.mat-row');

        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-properties-form');
        const message = fixture.nativeElement.querySelector('.ama-no-properties');

        expect(template === null).toBeFalsy();
        expect(message === null).toBeTruthy();
    });

    it('should call sendData of VariablesDialogService and change property if a property was edited and saved', () => {
        component.requiredCheckbox = true;
        const data1 = {
           '123' : {'id': '123', 'name': 'var1', 'type': 'string', 'value': '', 'required': false },
           '245' : {'id': '245', 'name': 'var2', 'type': 'string', 'value': '', 'required': false },
           '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'value': '', 'required': false }
        };

        spyOn(service, 'sendData');

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();
        const editRow = fixture.nativeElement.querySelector('.mat-row');

        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-properties-form');
        const input = template.querySelector('input');
        component.name = 'changed';

        input.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();

        const data2 = {
            '123' : {'id': '123', 'name': 'changed', 'type': 'string', 'value': '', 'required': false},
            '245' : {'id': '245', 'name': 'var2', 'type': 'string', 'value': '', 'required': false},
            '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'value': '', 'required': false}
        };

       expect(component.name).toEqual('changed');
       expect(service.sendData).toHaveBeenCalledWith(JSON.stringify(data2, null, 2), null);

    });

    it('should show error if name is invalid', () => {
        const data1 = {
           '123' : {'id': '123', 'name': 'var1', 'type': 'string', 'value': '', 'required': false }
        };

        spyOn(service, 'sendData');

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();
        const editRow = fixture.nativeElement.querySelector('.mat-row');

        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-properties-form');
        const input = template.querySelector('input');
        component.name = 'a2_#';
        input.dispatchEvent(new Event('keyup'));

        fixture.detectChanges();

        const data2 = {
            '123' : {'id': '123', 'name': 'a2_#', 'type': 'string', 'value': '', 'required': false}
        };

        expect(component.name).toEqual('a2_#');
        expect(service.sendData).toHaveBeenCalledWith(JSON.stringify(data2, null, 2), 'SDK.VARIABLES_EDITOR.ERRORS.INVALID_NAME');
        const infoIconWhenError = fixture.nativeElement.querySelector('.ama-variable-name-info-icon');
        expect (infoIconWhenError === null).toBeFalsy();
    });

    it('should call sendData with valid property name', () => {

        const data1 = {
            '123' : {'id': '123', 'name': 'var1', 'type': 'string', 'value': '', 'required': false }
         };

        spyOn(service, 'sendData');

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();
        const editRow = fixture.nativeElement.querySelector('.mat-row');

        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-properties-form');
        const input = template.querySelector('input');
        component.name = 'a2_';
        input.dispatchEvent(new Event('keyup'));

        fixture.detectChanges();

        const data3 = {
            '123' : {'id': '123', 'name': 'a2_', 'type': 'string', 'value': '', 'required': false}
        };

        expect(component.name).toEqual('a2_');
        expect(service.sendData).toHaveBeenCalledWith(JSON.stringify(data3, null, 2), null);
        const infoIcon = fixture.nativeElement.querySelector('.ama-variable-name-info-icon');
        expect (infoIcon === null).toBeTruthy();
    });

    it('should call sendData of VariablesDialog when clicking on add button', () => {
        component.requiredCheckbox = true;
        const data1 = {
            'generated-uuid': {
                'id': 'generated-uuid',
                'name': '',
                'type': 'string',
                'value': '',
                'required': false
            }
        };
        spyOn(service, 'sendData');

        const button = fixture.nativeElement.querySelector('.ama-add-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(service.sendData).toHaveBeenCalledWith(JSON.stringify(data1, null, 2), 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME');
        expect(component.error).toBe(true);
        expect(component.data).toEqual(data1);
    });

    it('should create process variable with no name', () => {
        fixture.detectChanges();
        const addButton = fixture.nativeElement.querySelector('[data-automation-id="add-variable"]');
        addButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const invalidName: HTMLElement = fixture.nativeElement.querySelector('.mat-error');
        expect(invalidName.textContent).toEqual('SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME');

        const template = fixture.nativeElement.querySelector('.ama-properties-form');
        const input = template.querySelector('input');
        component.name = 'a2_';
        input.dispatchEvent(new Event('keyup'));

        fixture.detectChanges();
        expect(component.error).toBe(false);
    });

    it('should delete process variable without a name', () => {
        fixture.detectChanges();
        const addButton: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="add-variable"]');
        addButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(addButton.getAttribute('disabled')).toBe('true');

        const deleteButton: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="delete-variable"]');
        deleteButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(addButton.getAttribute('disabled')).toBe(null);
    });

    it('should call applyFilter on filterValue change', async () => {
        const changes = { filterValue: new SimpleChange(null, 'var2', false) };
        component.ngOnChanges(changes);
        await fixture.whenStable();

        expect(component.dataSource.filter).toBe('var2');
        expect(component.dataSource.filteredData).toEqual([{'id': '234', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''}]);
    });

    it('should filter only based on name column', async () => {
        const changes = { filterValue: new SimpleChange(null, 'string', false) };
        component.ngOnChanges(changes);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.dataSource.filteredData).toEqual([]);
    });

    it('should clear filter input on click of clearFilterInput button', async () => {
        component.filterValue = 'var1';

        fixture.detectChanges();
        await fixture.whenStable();

        const clearFilterButton: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="variable-clear-filter"]');
        clearFilterButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filterValue).toEqual('');
    });

    it('should set filterValue from input', () => {
        const input = fixture.debugElement.query(By.css('[data-automation-id="variable-filter"]'));
        input.triggerEventHandler('input', { target: { value: 'string'}});
        fixture.detectChanges();

        expect(component.filterValue).toEqual('string');
    });

    it('should show the correct tab in editor', () => {
        component.requiredCheckbox = true;
        const data1 = {
          '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': 'hello'},
          '243':  {'id': '243', 'name': 'var2', 'type': 'string', 'required': false, 'value': '${123}'},
          '345':  {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
        };

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();

        const rows: HTMLElement[] = fixture.nativeElement.querySelectorAll('.mat-row');

        rows[0].dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(component.tabIndex).toBe(0);

        rows[1].dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(component.tabIndex).toBe(1);
    });

    it('should not display tabs when expression is not allowed', () => {
        component.allowExpressions = false;
        const data1 = {
            '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': 'hello'},
        };

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();

        const rows: HTMLElement[] = fixture.nativeElement.querySelectorAll('.mat-row');
        rows[0].dispatchEvent(new Event('click'));

        const tabGroup: HTMLElement = fixture.nativeElement.querySelector('mat-tab-group');
        expect(tabGroup).toBe(null);
    });

    it('should display tabs when expression is allowed', () => {
        component.allowExpressions = true;
        const data1 = {
            '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': 'hello'},
        };

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();

        const rows: HTMLElement[] = fixture.nativeElement.querySelectorAll('.mat-row');
        rows[0].dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const tabGroup: HTMLElement = fixture.nativeElement.querySelector('mat-tab-group');
        expect(tabGroup).not.toBeNull();
        expect(tabGroup).toBeDefined();
    });

    it('should display the expression editor in the expression tab content', () => {
        component.allowExpressions = true;
        const data1 = {
            '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': 'hello'},
        };

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();

        const rows: HTMLElement = fixture.nativeElement.querySelector('.mat-row');
        rows.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        component.tabIndex = 1;
        fixture.detectChanges();

        const codeEditor: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="variable-value"]');
        expect(codeEditor).not.toBeNull();
        expect(codeEditor).toBeDefined();
    });

    it('should not display tabs when expression is not allowed', () => {
        component.allowExpressions = false;
        const data1 = {
            '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': 'hello'},
        };

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();

        const rows: HTMLElement[] = fixture.nativeElement.querySelectorAll('.mat-row');
        rows[0].dispatchEvent(new Event('click'));

        const tabGroup: HTMLElement = fixture.nativeElement.querySelector('mat-tab-group');
        expect(tabGroup).toBe(null);
    });

    it('should display tabs when expression is allowed', () => {
        component.allowExpressions = true;
        const data1 = {
            '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': 'hello'},
        };

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();

        const rows: HTMLElement[] = fixture.nativeElement.querySelectorAll('.mat-row');
        rows[0].dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const tabGroup: HTMLElement = fixture.nativeElement.querySelector('mat-tab-group');
        expect(tabGroup).not.toBeNull();
        expect(tabGroup).toBeDefined();
    });

    it('should display the expression editor in the expression tab content', () => {
        component.allowExpressions = true;
        const data1 = {
            '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': 'hello'},
        };

        component.dataSource = new MatTableDataSource(Object.values(data1));
        component.data = data1;
        fixture.detectChanges();

        const rows: HTMLElement = fixture.nativeElement.querySelector('.mat-row');
        rows.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        component.tabIndex = 1;
        fixture.detectChanges();

        const codeEditor: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="variable-value"]');
        expect(codeEditor).not.toBeNull();
        expect(codeEditor).toBeDefined();
    });
});
