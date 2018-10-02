import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialogRef,  MatTableModule, MatTableDataSource } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { PropertiesViwerComponent } from './properties-viewer.component';
import { of } from 'rxjs';
import { ProcessVariablesService } from '../process-variables.service';
import { UuidService } from '../../process-editor/services/uuid.service';

describe('PropertiesViewerComponent', () => {
    let fixture: ComponentFixture<PropertiesViwerComponent>;
    let component: PropertiesViwerComponent;
    let service: ProcessVariablesService;

    const mockDialog = {
        close: jest.fn()
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                ProcessVariablesService,
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: Store, useValue: { dispatch: jest.fn(), select: jest.fn().mockReturnValue(of()) }},
                { provide: UuidService, useValue: { generate() { return 'generated-uuid'; } } }
            ],
            declarations: [PropertiesViwerComponent],
            imports: [ MatTableModule, TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViwerComponent);
        service = TestBed.get(ProcessVariablesService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('clicking on delete should call sendData of VariableDialogService', () => {
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
        expect(message.innerHTML).toEqual('APP.PROCESS_EDITOR.PROPERTIES.TABLE.NO_PROPERTIES');
    });

    it('if row was clicked, the edit form should be shown', () => {
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
        const data = {
           '123' : {'id': '123', 'name': 'var1', 'type': 'string', 'required': false, 'value': ''},
           '245' : {'id': '245', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
           '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
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
            '123' : {'id': '123', 'name': 'changed', 'type': 'string', 'required': false, 'value': ''},
            '245' : {'id': '245', 'name': 'var2', 'type': 'string', 'required': false, 'value': ''},
            '345' : {'id': '345', 'name': 'var3', 'type': 'string', 'required': false, 'value': ''}
        };

       expect(component.name).toEqual('changed');
       expect(service.sendData).toHaveBeenCalledWith(JSON.stringify(data2, null, 2), null);


    });

    it('clicking on add button should call sendData of VariablesDialogProcess ', () => {
        const data = {
            'generated-uuid': {
                'id': 'generated-uuid',
                'name': 'name',
                'type': 'string',
                'required': false,
                'value': ''
            }
        };
        spyOn(service, 'sendData');

        const button = fixture.nativeElement.querySelector('.add-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(service.sendData).toHaveBeenCalledWith(JSON.stringify(data, null, 2), null);
        expect(component.data).toEqual(data);
    });
});
