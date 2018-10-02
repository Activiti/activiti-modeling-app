import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CardItemTypeService } from '@alfresco/adf-core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ProcessVariablesComponent } from './process-variables.component';
import { ProcessEditorState } from '../process-editor/store/process-editor.state';
import { ProcessVariablesService } from './process-variables.service';
import { JsonValidatorService } from 'ama-sdk';
import { BpmnFactoryToken } from '../process-editor/services/bpmn-factory.token';
import { ProcessModelerService } from '../process-editor/services/process-modeler.service';
import { Subject } from 'rxjs';

describe('ProcessVariablesComponent', () => {
    let fixture: ComponentFixture<ProcessVariablesComponent>;
    let component: ProcessVariablesComponent;
    let store: Store<ProcessEditorState>;

    const mockDialog = {
        close: jest.fn()
    };

    const mockData = {
        properties: '{}',
        propertiesUpdate$: new Subject()
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                CardItemTypeService,
                ProcessVariablesService,
                { provide: JsonValidatorService, useValue: {validator: jest.fn()}},
                { provide: Store, useValue: { dispatch: jest.fn(), select: jest.fn().mockReturnValue(of())}},
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: BpmnFactoryToken, useValue: {} },
                { provide: ProcessModelerService, useValue: {getSelectedProcess: jest.fn().mockReturnValue({id: ''}), getElementProperty: jest.fn() }},
                { provide: MAT_DIALOG_DATA, useValue: mockData },
            ],
            declarations: [ProcessVariablesComponent],
            imports: [FormsModule, NoopAnimationsModule, MatDialogModule, TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessVariablesComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        fixture.detectChanges();
    });

    it('should have save button', () => {
        const button = fixture.nativeElement.querySelector('.save-btn');
        expect (button === null).toBeFalsy();
        expect(button.innerHTML.trim()).toEqual('APP.DIALOGS.UPDATE');
    });

    it('subject should next as expected when saved button is clicked', () => {
        spyOn(component.data.propertiesUpdate$, 'next');

        const data = {
            '123': {
                'id': '123',
                'name': 'test',
                'type': 'string',
                'required': false,
                'value': ''
            }
        };

        const result = {
            '123' : {
                'id': '123',
                'name': 'test',
                'type': 'string',
                'required': false,
                'value': ''
            }
        };

        component.editorContent = JSON.stringify(data, null, 2);
        const button = fixture.nativeElement.querySelector('.save-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(component.data.propertiesUpdate$.next).toHaveBeenCalledWith(result);
    });
});
