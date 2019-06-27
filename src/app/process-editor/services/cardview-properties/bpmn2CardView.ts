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

import { CardViewDateItemModel, CardViewKeyValuePairsItemModel, CardViewSelectItemModel, CardViewTextItemModel } from '@alfresco/adf-core';
import { BpmnProperty, CardViewFormKeyModel, DecisionTaskItemModel, DefaultSequenceFlowItemModel, ImplementationItemModel, sanitizeString } from 'ama-sdk';
import { of } from 'rxjs';
import { selectProcessesKeyLabelArray } from '../../store/process-editor.selectors';
import { ElementHelper } from '../bpmn-js/element.helper';
import { displayFormat } from '../bpmn-js/property-handlers/dueDate.handler';
import { FactoryProps } from './cardview-properties.factory';
import { CardViewProcessVariableItemModel } from './process-variable-item/process-variable-item.model';
import { SignalRefItemModel } from './signal-ref-item/signal-ref-item.model';
import { CardViewProcessNameValidator } from './validators/card-view-process-name.validator';

export const bpmn2cardView = {
    [BpmnProperty.id]: createIdProperty,
    [BpmnProperty.name]: createNameProperty,
    [BpmnProperty.version]: createVersionProperty,
    [BpmnProperty.documentation]: createDocumentationProperty,
    [BpmnProperty.implementation]: createImplementationProperty,
    [BpmnProperty.decisionTask]: createDecisionTaskProperty,
    [BpmnProperty.variables]: createVariablesProperty,
    [BpmnProperty.assignee]: createAssigneeProperty,
    [BpmnProperty.candidateGroups]: createCandidateGroupsProperty,
    [BpmnProperty.candidateUsers]: createCandidateUsersProperty,
    [BpmnProperty.dueDate]: createDueDateProperty,
    [BpmnProperty.priority]: createPriorityProperty,
    [BpmnProperty.calledElement]: createCalledElementProperty,
    [BpmnProperty.properties]: createProcessVariablesProperty,
    [BpmnProperty.conditionExpression]: createExpressionProperty,
    [BpmnProperty.formKey]: createFormKeyProperty,
    [BpmnProperty.processName]: createProcessNameProperty,
    [BpmnProperty.defaultSequenceFlow]: createDefaultSequenceFlowProperty,
    [BpmnProperty.signalRef]: createSignalRefProperty,
    [BpmnProperty.signalScope]: createSignalScopeProperty
};

function createIdProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.ID',
        value: ElementHelper.getProperty(element, BpmnProperty.name),
        key: BpmnProperty.name,
        default: '',
        multiline: false,
        editable: false
    });
}

function createNameProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.NAME',
        value: ElementHelper.getProperty(element, BpmnProperty.name),
        key: BpmnProperty.name,
        default: '',
        multiline: false,
        editable: true,
        data: { id: element.id }
    });
}

function createImplementationProperty({ element }: FactoryProps) {
    return new ImplementationItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.IMPLEMENTATION',
        value: ElementHelper.getProperty(element, BpmnProperty.implementation),
        key: BpmnProperty.implementation,
        default: '',
        editable: true,
        data: { id: element.id }
    });
}

function createDecisionTaskProperty({ element }: FactoryProps) {
    return new DecisionTaskItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.DECISION_TASK',
        value: ElementHelper.getProperty(element, BpmnProperty.implementation),
        key: BpmnProperty.implementation,
        default: '',
        editable: true,
        data: { id: element.id }
    });
}

function createVersionProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.VERSION',
        value: ElementHelper.getProperty(element, BpmnProperty.version),
        key: BpmnProperty.version,
        default: '',
        multiline: false,
        editable: true,
        data: { id: element.id }
    });
}

function createAssigneeProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.ASSIGNEE',
        value: ElementHelper.getProperty(element, BpmnProperty.assignee),
        key: BpmnProperty.assignee,
        default: '',
        multiline: false,
        editable: true,
        data: { id: element.id }
    });
}

function createCalledElementProperty({ element, store }: FactoryProps) {
    return new CardViewSelectItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.ACTIVITY_NAME',
        options$: store.select(selectProcessesKeyLabelArray),
        value: ElementHelper.getProperty(element, BpmnProperty.calledElement),
        key: BpmnProperty.calledElement,
        editable: true,
        data: { id: element.id }
    });
}

function createCandidateGroupsProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.CANDIDATE_GROUPS',
        value: ElementHelper.getProperty(element, BpmnProperty.candidateGroups),
        key: BpmnProperty.candidateGroups,
        default: '',
        multiline: false,
        editable: true,
        data: { id: element.id }
    });
}

function createCandidateUsersProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.CANDIDATE_USERS',
        value: ElementHelper.getProperty(element, BpmnProperty.candidateUsers),
        key: BpmnProperty.candidateUsers,
        default: '',
        multiline: false,
        editable: true,
        data: { id: element.id }
    });
}

function createDefaultSequenceFlowProperty({ element }: FactoryProps) {
    return new DefaultSequenceFlowItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.DEFAULT_SEQUENCE_FLOW',
        value: ElementHelper.getProperty(element, BpmnProperty.defaultSequenceFlow),
        key: BpmnProperty.defaultSequenceFlow,
        default: '',
        editable: true,
        data: { id: element.id }
    });
}

function createDocumentationProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.DOCUMENTATION',
        value: ElementHelper.getProperty(element, BpmnProperty.documentation),
        key: BpmnProperty.documentation,
        default: '',
        multiline: true,
        editable: true,
        data: { id: element.id }
    });
}

function createDueDateProperty({ element }: FactoryProps) {
    return new CardViewDateItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.DUE_DATE',
        value: ElementHelper.getProperty(element, BpmnProperty.dueDate),
        key: BpmnProperty.dueDate,
        editable: true,
        format: displayFormat,
        data: { id: element.id }
    });
}

function createExpressionProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.EXPRESSION',
        value: ElementHelper.getProperty(element, BpmnProperty.conditionExpression),
        key: BpmnProperty.conditionExpression,
        default: '',
        multiline: true,
        editable: true,
        data: { id: element.id }
    });
}

function createFormKeyProperty({ element }: FactoryProps) {
    return new CardViewFormKeyModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.FORM_SELECTOR',
        value: ElementHelper.getProperty(element, BpmnProperty.formKey),
        key: BpmnProperty.formKey,
        default: '',
        editable: true,
        data: { id: element.id }
    });
}

function createPriorityProperty({ element, appConfigService }: FactoryProps) {
    return new CardViewSelectItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.PRIORITY',
        options$: of(appConfigService.get('process-modeler.priorities')),
        value: ElementHelper.getProperty(element, BpmnProperty.priority),
        key: BpmnProperty.priority,
        editable: true,
        data: { id: element.id }
    });
}

function createProcessNameProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.NAME',
        value: sanitizeString(ElementHelper.getProperty(element, BpmnProperty.processName)),
        key: BpmnProperty.processName,
        default: '',
        multiline: false,
        editable: true,
        data: { id: element.id },
        validators: [new CardViewProcessNameValidator()]
    });
}

function createProcessVariablesProperty({ element }: FactoryProps) {
    return new CardViewProcessVariableItemModel({
        label: '',
        value: '',
        key: BpmnProperty.properties,
        default: '',
        editable: false
    });
}

function createSignalRefProperty({ element }: FactoryProps) {
    return new SignalRefItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.SIGNAL',
        value: ElementHelper.getProperty(element, BpmnProperty.signalRef),
        key: BpmnProperty.signalRef,
        editable: true,
        data: { id: element.id, element }
    });
}

function createSignalScopeProperty({ element }: FactoryProps) {
    return new CardViewSelectItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.SCOPE',
        options$: of([
            { key: 'global', label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.SCOPE_VALUES.GLOBAL' },
            { key: 'processInstance', label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.SCOPE_VALUES.PROCESS_INSTANCE' }
        ]),
        value: ElementHelper.getProperty(element, BpmnProperty.signalScope) || 'global',
        key: BpmnProperty.signalScope,
        editable: true,
        data: { id: element.id }
    });
}

function createVariablesProperty({ element }: FactoryProps) {
    return new CardViewKeyValuePairsItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.VARIABLES',
        value: ElementHelper.getProperty(element, BpmnProperty.variables),
        key: BpmnProperty.variables,
        data: { id: element.id },
        editable: true
    });
}
