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
import { MessagesDialogComponent } from './messages-dialog.component';
import { Subject } from 'rxjs';
import { MessagesService } from '../../../services/messages.service';
import { ProcessModelerServiceToken, BpmnFactoryToken } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessModelerServiceImplementation } from '../../../services/process-modeler.service';
import { BpmnFactoryMock } from '../../../services/bpmn-js/bpmn-js.mock';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

describe('MessageDialogComponent', () => {
    let fixture: ComponentFixture<MessagesDialogComponent>;
    let component: MessagesDialogComponent;
    let service: MessagesService;

    const mockDialog = {
        close: jest.fn()
    };

    const mockData = {
        columns: ['id', 'name', 'delete'],
        propertiesUpdate$: new Subject()
    };

    const messages = [
        { 'id': '123', 'name': 'message1', 'type': 'bpmn:message' },
        { 'id': '234', 'name': 'message2', 'type': 'bpmn:message' },
        { 'id': '345', 'name': 'message3', 'type': 'bpmn:message' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: mockData },
                { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock }
            ],
            declarations: [MessagesDialogComponent],
            imports: [MatTableModule, TranslateModule.forRoot(), MatDialogModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MessagesDialogComponent);
        service = TestBed.inject(MessagesService);
        component = fixture.componentInstance;

        spyOn(service, 'getUpdatedMessages').and.returnValue(messages);
        fixture.detectChanges();
    });

    it('should have the same number of rows as properties', () => {
        fixture.detectChanges();
        const rows = fixture.nativeElement.querySelectorAll('mat-row');
        expect(rows.length).toEqual(3);
        expect(component.messages.length).toEqual(3);
    });

    it('should delete message when clicking delete button', () => {
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.delete-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(component.messages.length).toBe(2);
    });

    it('should hide form if no message is clicked', () => {
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-message-form');
        const message = fixture.nativeElement.querySelector('.ama-no-messages');

        expect(template === null).toBeTruthy();
        expect(message === null).toBeFalsy();
        expect(message.innerHTML).toEqual('SDK.MESSAGES_EDITOR.TABLE.NO_MESSAGES');
    });

    it('should show form when a row is clicked', () => {
        fixture.detectChanges();

        const editRow = fixture.nativeElement.querySelector('.mat-row');

        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-message-form');
        const message = fixture.nativeElement.querySelector('.ama-no-messages');

        expect(template === null).toBeFalsy();
        expect(message === null).toBeTruthy();
    });

    it('should update message when the name is changed in the form', () => {
        fixture.detectChanges();
        let saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        const editRow = fixture.nativeElement.querySelector('.mat-row');
        editRow.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        const template = fixture.nativeElement.querySelector('.ama-message-form');
        const input = template.querySelector('input');
        component.selectedMessage.name = 'changedMessage';
        input.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.changedMessage).toBeFalsy();
        expect(component.messages[0].name).toEqual('changedMessage');
    });

    it('should create new message when add message button is clicked', () => {
        fixture.detectChanges();
        let saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeTruthy();

        spyOn(service, 'createMessage').and.returnValue({ 'id': '678', 'name': 'message4', 'type': 'bpmn:message' });
        const addButton = fixture.nativeElement.querySelector('.ama-add-btn');
        expect(addButton).toBeDefined();
        addButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        saveButton = fixture.nativeElement.querySelector('button[data-automation-id="update-button"]');
        expect(saveButton.disabled).toBeFalsy();
        expect(service.createMessage).toHaveBeenCalled();
        expect(component.messages.length).toBe(4);
    });
});
