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

import { Injectable, Inject } from '@angular/core';
import {
    ProcessModelerServiceToken,
    ProcessModelerService,
    BpmnElement,
    BpmnCompositeProperty
} from '@alfresco-dbp/modeling-shared/sdk';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    constructor(
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService) {
    }

    private get rootElements(): Bpmn.BusinessObject[] {
        return this.rootProcessElement.businessObject.$parent.rootElements;
    }

    private set rootElements(messages: Bpmn.BusinessObject[]) {
        this.rootProcessElement.businessObject.$parent.rootElements = messages;
    }

    private get bpmnFactory(): any {
        return this.processModelerService.getFromModeler('bpmnFactory');
    }

    private get rootProcessElement(): Bpmn.DiagramElement {
        return this.processModelerService.getRootProcessElement();
    }

    createMessage(): Bpmn.BusinessObject {
        const newMessage = this.bpmnFactory.create(BpmnElement.Message);
        newMessage.name = newMessage.id;
        return newMessage;
    }

    getUpdatedMessages(): Bpmn.BusinessObject[] {
        return this.rootElements.filter((element) => element.$type === BpmnElement.Message);
    }

    saveMessages(messages: Bpmn.BusinessObject[]) {
        this.rootElements = this.rootElements.filter((element) => element.$type !== BpmnElement.Message);
        messages.forEach((message) => this.rootElements.push(message));
        this.processModelerService.updateElementProperty(this.rootProcessElement.id, BpmnCompositeProperty.messages, messages);
    }
}
