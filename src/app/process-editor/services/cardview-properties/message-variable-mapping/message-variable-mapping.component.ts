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

import { Component, OnInit, Input } from '@angular/core';
import { CardItemTypeService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import {
    AmaState, EntityProperty, MessagePayload, selectSelectedProcess, ConnectorParameter,
    ParametersSelectOptions, MappingType, Process, ServiceParameterMapping, ProcessExtensionsModel,
    BpmnElement, ServiceParameterMappings
} from '@alfresco-dbp/modeling-shared/sdk';
import { MatTableDataSource } from '@angular/material';
import { filter, take } from 'rxjs/operators';
import { MessageVariableMappingService } from './message-variable-mapping.service';
import { MessageItemModel } from '../message-item/message-item.model';

@Component({
    selector: 'ama-message-variable-mapping',
    templateUrl: './message-variable-mapping.component.html',
    providers: [CardItemTypeService]
})
export class CardViewMessageVariableMappingComponent implements OnInit {

    @Input() message: Bpmn.DiagramElement;

    @Input() property: MessageItemModel;

    displayedColumns: string[] = ['name', 'process-variable'];
    dataSource: MatTableDataSource<any>;

    processVariables: EntityProperty[];
    payloadProperties: MessagePayload[] = [];
    mapping: ServiceParameterMapping = {};
    optionsForParams: ParametersSelectOptions = {};
    paramName2VariableName: { [paramName: string]: string } = {};

    private get modelEvents(): Bpmn.BusinessObject[] {
        if (this.property.data.element.parent.type === BpmnElement.Process) {
            return this.property.data.element.parent.businessObject.flowElements;
        } else {
            const process = this.property.data.element.parent.businessObject.$parent.$parent.rootElements.filter((element) => element.$type === BpmnElement.Process);
            return process.reduce((allElements, currentElement) => {
                const flows  = currentElement.flowElements.filter(childElement => childElement.flowElements).map(element => element.flowElements);
                return  [ ...allElements, ...currentElement.flowElements, ...flows  ];
            } , []);
        }
    }

    private get elementId(): string {
        return this.property.data.id;
    }

    constructor(private store: Store<AmaState>,
                private messageVariableMappingService: MessageVariableMappingService) { }

    ngOnInit() {
        this.store.select(selectSelectedProcess)
            .pipe(
                filter((process: Process) => !!process),
                take(1))
            .subscribe((process: Process) => {
                const processExtensionsModel = new ProcessExtensionsModel(process.extensions);
                this.mapping = this.getMappingFromProcess(processExtensionsModel.getMappings(this.property.data.processId));
                this.processVariables = Object.values(processExtensionsModel.getProperties(this.property.data.processId));
                this.payloadProperties = this.parseMessagePayload(processExtensionsModel.getAllMappings());
                this.dataSource = new MatTableDataSource(this.payloadProperties);
                this.initMapping();
            });
    }

    initMapping() {
        this.payloadProperties.forEach((payloadProperty) => {
            if (this.mapping) {
                Object.keys(this.mapping).map((outputProperty) => {
                    if (this.mapping[outputProperty].value === payloadProperty.name) {
                        this.paramName2VariableName[payloadProperty.name] = outputProperty;
                    }
                });
            }

            this.optionsForParams[payloadProperty.name] = this.processVariables.filter((prop) => prop.type === payloadProperty.type);
        });
    }

    parseMessagePayload(messageMappings: ServiceParameterMappings): MessagePayload[] {
        const payloadMessageEvent = this.messageVariableMappingService.getPayloadMessageEventByMessageId(this.modelEvents, this.message.id, this.elementId);
        return this.messageVariableMappingService.parseMessagePayload(payloadMessageEvent, messageMappings);
    }

    getMappingFromProcess(mappings: ServiceParameterMappings): ServiceParameterMapping {
        return mappings[this.elementId] && mappings[this.elementId].outputs
            ? { ...mappings[this.elementId].outputs } : {};
    }

    selectVariable(selection: string, param: ConnectorParameter) {
        this.mapping = { ...this.mapping };

        if (!selection) {
            Object.keys(this.mapping).forEach((property) => {
                if (this.mapping[property].value === param.name) {
                    delete this.mapping[property];
                }
            });
        } else {
            this.mapping[selection] = {
                type: MappingType.variable,
                value: param.name
            };
        }

        this.messageVariableMappingService.updateMessagePayloadMapping(this.property.data.processId, this.elementId, { outputs: this.mapping });
    }

    hasPayload(): boolean {
        return this.payloadProperties.length > 0;
    }
}
