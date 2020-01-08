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

import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { MessagesService } from '../../../services/messages.service';
import { Subject } from 'rxjs';

export interface MessageDialogData extends MatDialogConfig {
    columns: string[];
    propertiesUpdate$: Subject<Bpmn.BusinessObject[]>;
}

@Component({
    templateUrl: './messages-dialog.component.html',
    selector: 'ama-messages-dialog'
})

export class MessagesDialogComponent implements OnInit {

    displayedColumns: string[];
    selectedMessage: Bpmn.BusinessObject;
    dataSource: MatTableDataSource<Bpmn.BusinessObject>;
    messages: Bpmn.BusinessObject[] = [];

    position: number;
    showForm: boolean;
    messagesChanged = false;

    constructor(
        public dialog: MatDialogRef<MessagesDialogComponent>,
        private messagesService: MessagesService,
        @Inject(MAT_DIALOG_DATA) public data: MessageDialogData) {
        this.displayedColumns = data.columns;
    }

    ngOnInit() {
        const messagesFromXML = this.messagesService.getUpdatedMessages();
        this.messages = [...messagesFromXML];
        this.updateMessages();
    }

    updateMessages() {
        this.dataSource = new MatTableDataSource(this.messages);
    }

    createMessage() {
        this.messagesChanged = true;
        const newMessage = this.messagesService.createMessage();
        this.messages.push(newMessage);
        this.updateMessages();
    }

    deleteMessage(element: Bpmn.DiagramElement) {
        this.messagesChanged = true;
        const deletedMessageIndex = this.messages.map((message) => message.id).indexOf(element.id);
        this.messages.splice(deletedMessageIndex, 1);
        this.updateMessages();
    }

    editMessage(element: Bpmn.BusinessObject, index: number) {
        this.selectedMessage = element;
        this.showForm = true;
        this.position = index;
    }

    onMessageChanged() {
        this.messagesChanged = true;
    }

    onSave() {
        this.messagesChanged = false;
        this.messagesService.saveMessages(this.messages);
        this.data.propertiesUpdate$.next();
        this.data.propertiesUpdate$.complete();
        this.dialog.close();
    }

    onClose() {
        this.messagesChanged = false;
        this.messages = [];
        this.data.propertiesUpdate$.complete();
        this.dialog.close();
    }
}
