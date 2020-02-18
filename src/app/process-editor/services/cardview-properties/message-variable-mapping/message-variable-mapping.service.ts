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

import { Injectable } from '@angular/core';
import { AmaState, ServiceParameterMappings, UpdateServiceParametersAction, selectSelectedProcess, MessagePayload, BpmnElement } from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import moment from 'moment-es6';

@Injectable({
    providedIn: 'root'
})
export class MessageVariableMappingService {

    constructor(private store: Store<AmaState>) { }

    updateMessagePayloadMapping(processId: string, elementId: string, mapping: ServiceParameterMappings) {
        const parameterMapping = mapping;
        this.store.select(selectSelectedProcess).pipe(
            filter((model) => !!model),
            take(1)
        ).subscribe((model) => this.store.dispatch(new UpdateServiceParametersAction(model.id, processId, elementId, parameterMapping)));
    }

    getPropertyType(property: any): string {
        let type: string;

        if (typeof property.value === 'number') {
            type = 'integer';
        } else if (typeof property.value === 'object') {
            type = 'json';
        } else if (typeof property.value === 'boolean') {
            type = 'boolean';
        } else if (moment(property.value, 'YYYY-MM-DD', true).isValid()) {
            type = 'date';
        } else {
            type = 'string';
        }

        return type;
    }

    parseMessagePayload(payloadMessageEvent: Bpmn.BusinessObject, messageMappings: ServiceParameterMappings): MessagePayload[] {
        const messagePayload = [];
        if (!!payloadMessageEvent) {
            const messagePayloadMappings = messageMappings[payloadMessageEvent.id] && messageMappings[payloadMessageEvent.id].inputs
                ? messageMappings[payloadMessageEvent.id].inputs : {};

            Object.keys(messagePayloadMappings).forEach((property) => {
                messagePayload.push({
                    ...messagePayloadMappings[property],
                    name: property,
                    type: this.getPropertyType(messagePayloadMappings[property])
                });
            });
        }

        return messagePayload;
    }

    getPayloadMessageEventByMessageId(modelEvents: Bpmn.BusinessObject[], messageId: string, messageEventId: string): Bpmn.BusinessObject {
        return modelEvents.find((processEvent) => {
            return processEvent
                && processEvent.id !== messageEventId
                && processEvent.eventDefinitions
                && processEvent.eventDefinitions[0].$type === BpmnElement.MessageEventDefinition
                && processEvent.eventDefinitions[0].messageRef
                && processEvent.eventDefinitions[0].messageRef.id === messageId;
        });
    }

}
