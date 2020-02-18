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

import { Component, Input, OnInit, Inject } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService } from '@alfresco/adf-core';
import { ProcessModelerServiceToken, ProcessModelerService, AmaState, BpmnElement } from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { SelectModelerElementAction } from '../../../store/process-editor.actions';
import { MessageItemModel } from './message-item.model';

@Component({
    selector: 'ama-message-item',
    templateUrl: './message-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewMessageItemComponent implements OnInit {

    @Input() property: MessageItemModel;

    messages: Bpmn.DiagramElement[] = [];
    selectedMessage: Bpmn.DiagramElement;

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private store: Store<AmaState>,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService
    ) {}

    private get rootElements() {
        return this.processModelerService.getRootProcessElement().businessObject.$parent.rootElements;
    }

    private get bpmnFactory() {
        return this.processModelerService.getFromModeler('bpmnFactory');
    }

    get eventDefinition(): any {
        return this.property.data.element.businessObject.eventDefinitions[0];
    }

    get eventType(): string {
        return this.property.data.element.type;
    }

    ngOnInit() {
        this.selectedMessage = this.eventDefinition.messageRef;
        this.messages = this.rootElements.filter(element => {
            return element.$type === 'bpmn:Message';
        });
    }

    createNewMessage() {
        const messageElement = this.bpmnFactory.create('bpmn:Message');
        messageElement.name = messageElement.id;
        this.rootElements.push(messageElement);

        this.messages.push(messageElement);
        this.selectedMessage = messageElement;
        this.onMessageChange();
    }

    onMessageChange() {
        if (this.selectedMessage) {
            this.cardViewUpdateService.update(this.property, this.selectedMessage);
            const { id, type, name } = this.property.data.element;
            this.store.dispatch(new SelectModelerElementAction({ id, type, name }));
        }
    }

    isCatchEvent(): boolean {
        return this.eventType === BpmnElement.IntermediateCatchEvent ||
            this.eventType === BpmnElement.BoundaryEvent ||
            this.eventType === BpmnElement.StartEvent;
    }
}
