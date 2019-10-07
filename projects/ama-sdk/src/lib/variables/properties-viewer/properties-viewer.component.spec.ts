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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialogRef,  MatTableModule, MatTableDataSource } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { PropertiesViewerComponent } from './properties-viewer.component';
import { of } from 'rxjs';
import { VariablesService } from '../variables.service';
import { UuidService } from './../../services/uuid.service';

describe('PropertiesViewerComponent', () => {
    let fixture: ComponentFixture<PropertiesViewerComponent>;
    let component: PropertiesViewerComponent;
    let service: VariablesService;

    const mockDialog = {
        close: jest.fn()
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                VariablesService,
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: Store, useValue: { dispatch: jest.fn(), select: jest.fn().mockReturnValue(of()) }},
                { provide: UuidService, useValue: { generate() { return 'generated-uuid'; } } }
            ],
            declarations: [PropertiesViewerComponent],
            imports: [ MatTableModule, TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerComponent);
        service = TestBed.get(VariablesService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('clicking on delete should call sendData of VariableDialogService', () => {
        component.requiredCheckbox = true;
        const data = {
            '123' : {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': ''},
            '234' : {'id': '234', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
            '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
        };
        component.dataSource = new MatTableDataSource(Object.values(data));
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

    it('table should have the same number of rows as properties', () => {
        component.requiredCheckbox = true;
        const data = {
          '123':  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': ''},
          '243':  {'id': '243', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
          '345': {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
        };

        component.dataSource = new MatTableDataSource(Object.values(data));
        component.data = data;
        fixture.detectChanges();

        const rows = fixture.nativeElement.querySelectorAll('mat-row');
        expect(rows.length).toEqual(3);
    });

    it('if row was not clicked', () => {
        component.requiredCheckbox = true;
        const data = {
          '123' :  {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': ''},
          '243' :  {'id': '243', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
          '345' :  {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
        };
        component.dataSource = new MatTableDataSource(Object.values(data));
        component.data = data;
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.properties-form');
        const message = fixture.nativeElement.querySelector('.no-properties');

        expect(template === null).toBeTruthy();
        expect(message === null).toBeFalsy();
        expect(message.innerHTML).toEqual('SDK.VARIABLES_EDITOR.TABLE.NO_PROPERTIES');
    });

    it('if row was clicked, the edit form should be shown', () => {
        component.requiredCheckbox = true;
        const data = {
            '123' : {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': ''},
            '234' : {'id': '234', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
            '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
        };
        component.dataSource = new MatTableDataSource(Object.values(data));
        component.data = data;
        fixture.detectChanges();

        const editRow = fixture.nativeElement.querySelector('.mat-row');

        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.properties-form');
        const message = fixture.nativeElement.querySelector('.no-properties');

        expect(template === null).toBeFalsy();
        expect(message === null).toBeTruthy();
    });

    it('if a property was edited and saved sendData of VariablesDialogService was called and property was changed', () => {
        component.requiredCheckbox = true;
        const data = {
           '123' : {'id': '123', 'name': 'var1', 'type': 'string', 'value': '', 'required': false },
           '245' : {'id': '245', 'name': 'var2', 'type': 'string', 'value': '', 'required': false },
           '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'value': '', 'required': false }
        };

        spyOn(service, 'sendData');

        component.dataSource = new MatTableDataSource(Object.values(data));
        component.data = data;
        fixture.detectChanges();
        const editRow = fixture.nativeElement.querySelector('.mat-row');

        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.properties-form');
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

    it('clicking on add button should call sendData of VariablesDialog ', () => {
        component.requiredCheckbox = true;
        const data = {
            'generated-uuid': {
                'id': 'generated-uuid',
                'name': '',
                'type': 'string',
                'value': '',
                'required': false
            }
        };
        spyOn(service, 'sendData');

        const button = fixture.nativeElement.querySelector('.add-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(service.sendData).toHaveBeenCalledWith(JSON.stringify(data, null, 2), 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME');
        expect(component.data).toEqual(data);
    });
});
