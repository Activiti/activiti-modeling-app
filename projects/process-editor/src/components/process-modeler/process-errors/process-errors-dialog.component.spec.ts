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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessErrorsService } from '../../../services/process-errors.service';
import { Subject } from 'rxjs';
import { ProcessModelerServiceToken, BpmnFactoryToken } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessModelerServiceImplementation } from '../../../services/process-modeler.service';
import { BpmnFactoryMock } from '../../../services/bpmn-js/bpmn-js.mock';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ProcessErrorsDialogComponent } from './process-errors-dialog.component';

describe('ProcessErrorsDialogComponent', () => {
    let fixture: ComponentFixture<ProcessErrorsDialogComponent>;
    let component: ProcessErrorsDialogComponent;
    let service: ProcessErrorsService;

    const mockDialog = {
        close: jest.fn()
    };

    const mockData = {
        columns: ['id', 'name', 'delete'],
        propertiesUpdate$: new Subject()
    };

    const processErrors = [
        { 'id': '123', 'name': 'error1', 'errorCode': 'error1',  'type': 'bpmn:error' },
        { 'id': '234', 'name': 'error2', 'errorCode': 'error2', 'type': 'bpmn:error' },
        { 'id': '345', 'name': 'error3', 'errorCode': 'error3', 'type': 'bpmn:error' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: mockData },
                { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock }
            ],
            declarations: [ProcessErrorsDialogComponent],
            imports: [MatTableModule, TranslateModule.forRoot(), MatDialogModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessErrorsDialogComponent);
        service = TestBed.inject(ProcessErrorsService);
        component = fixture.componentInstance;

        spyOn(service, 'getUpdatedProcessErrors').and.returnValue(processErrors);
        fixture.detectChanges();
    });

    it('should have the same number of rows as properties', () => {
        fixture.detectChanges();
        const rows = fixture.nativeElement.querySelectorAll('mat-row');
        expect(rows.length).toEqual(3);
        expect(component.processErrors.length).toEqual(3);
    });

    it('should delete process error when clicking delete button', () => {
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.delete-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(component.processErrors.length).toBe(2);
    });

    it('should hide form if no process error is clicked', () => {
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-process-error-form');
        const processError = fixture.nativeElement.querySelector('.ama-no-process-errors');

        expect(template === null).toBeTruthy();
        expect(processError === null).toBeFalsy();
        expect(processError.innerHTML).toEqual('SDK.ERRORS_EDITOR.TABLE.NO_PROCESS_ERRORS');
    });

    it('should show form when a row is clicked', () => {
        fixture.detectChanges();

        const editRow = fixture.nativeElement.querySelector('.mat-row');

        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-process-error-form');
        const processError = fixture.nativeElement.querySelector('.ama-no-process-errors');

        expect(template === null).toBeFalsy();
        expect(processError === null).toBeTruthy();
    });

    it('should update process error when the name is changed in the form', () => {
        fixture.detectChanges();
        let saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        const editRow = fixture.nativeElement.querySelector('.mat-row');
        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-process-error-form');
        const input = template.querySelector('input');
        component.selectedProcessError.name = 'changedProcessError';
        input.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.changedProcessError).toBeFalsy();
        expect(component.processErrors[0].name).toEqual('changedProcessError');
    });

    it('should update process error when the error code is changed in the form', () => {
        fixture.detectChanges();
        let saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        const editRow = fixture.nativeElement.querySelector('.mat-row');
        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-process-error-form');
        const input = template.querySelector('input');
        component.selectedProcessError.errorCode = 'changedProcessErrorCode';
        input.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.changedProcessError).toBeFalsy();
        expect(component.processErrors[0].errorCode).toEqual('changedProcessErrorCode');
    });

    it('should disable save button if name is empty', async() => {
        fixture.detectChanges();
        let saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        const editRow = fixture.nativeElement.querySelector('.mat-row');
        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-process-error-form');
        const input = template.querySelector('input[data-automation-id="process-error-name"]');
        component.selectedProcessError.name = '';
        input.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        component.selectedProcessError.name = 'changedName';
        input.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeFalsy();
    });

    it('should disable save button if code is empty', async() => {
        fixture.detectChanges();
        let saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        const editRow = fixture.nativeElement.querySelector('.mat-row');
        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-process-error-form');
        const input = template.querySelector('input[data-automation-id="process-error-code"]');
        component.selectedProcessError.errorCode = '';
        input.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        component.selectedProcessError.errorCode = 'changedCode';
        input.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeFalsy();
    });

    it('should create new error when add process error button is clicked', () => {
        fixture.detectChanges();
        let saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        spyOn(service, 'createProcessError').and.returnValue({ 'id': '678', 'name': 'error4', 'type': 'bpmn:error' });
        const addButton = fixture.nativeElement.querySelector('.ama-add-btn');
        expect(addButton).toBeDefined();
        addButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeFalsy();
        expect(service.createProcessError).toHaveBeenCalled();
        expect(component.processErrors.length).toBe(4);
    });
});
