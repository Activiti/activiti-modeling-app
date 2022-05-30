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

import { Observable, of } from 'rxjs';
import { ElementVariable, ProcessEditorElementVariable, ProcessEditorElementWithVariables } from '../api/types';
import { BpmnElement } from '../process-editor/bpmn-element';
import { ProcessEditorElementVariablesProvider } from '../services/process-editor-element-variables-provider.service';

/* cspell: disable*/
export const expectedVariables: ProcessEditorElementVariable[] = [
    {
        'source': {
            'name': 'My Process',
            'type': ProcessEditorElementWithVariables.Process,
            'subtype': 'bpmn:Process'
        },
        'variables': [
            {
                'description': undefined,
                'id': 'b1b04bf1-19cb-4930-b750-eecb6f3977ee',
                'name': 'dos',
                'type': 'integer',
                'icon': 'i',
                'tooltip': `
            <div class="ama-variables-selector-tooltip">
                <h3 class="ama-variables-selector-tooltip-first-header">SDK.CONDITION.TOOLTIP.VARIABLE</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>SDK.CONDITION.TOOLTIP.PROCESS_VARIABLE_TOOLTIP.</p>
                    <span></span>
                </div>
                <h3>SDK.CONDITION.TOOLTIP.PROPERTIES</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>
                        <pre class="ama-variables-selector-variables-group-list-item-type">i</pre>
                        <span>integer</span>
                    </p>
                </div>
            </div>
        `
            },
            {
                'description': undefined,
                'id': '695b2110-1060-4819-a513-400b114c93ff',
                'name': 'tres',
                'type': 'boolean',
                'icon': 'b',
                'tooltip': `
            <div class="ama-variables-selector-tooltip">
                <h3 class="ama-variables-selector-tooltip-first-header">SDK.CONDITION.TOOLTIP.VARIABLE</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>SDK.CONDITION.TOOLTIP.PROCESS_VARIABLE_TOOLTIP.</p>
                    <span></span>
                </div>
                <h3>SDK.CONDITION.TOOLTIP.PROPERTIES</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>
                        <pre class="ama-variables-selector-variables-group-list-item-type">b</pre>
                        <span>boolean</span>
                    </p>
                </div>
            </div>
        `
            },
            {
                'description': undefined,
                'id': 'c2f8729e-5056-44d2-8cd7-fb1bada7f4dd',
                'name': 'uno',
                'type': 'string',
                'icon': 's',
                'tooltip': `
            <div class="ama-variables-selector-tooltip">
                <h3 class="ama-variables-selector-tooltip-first-header">SDK.CONDITION.TOOLTIP.VARIABLE</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>SDK.CONDITION.TOOLTIP.PROCESS_VARIABLE_TOOLTIP.</p>
                    <span></span>
                </div>
                <h3>SDK.CONDITION.TOOLTIP.PROPERTIES</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>
                        <pre class="ama-variables-selector-variables-group-list-item-type">s</pre>
                        <span>string</span>
                    </p>
                </div>
            </div>
        `
            }
        ]
    },
    {
        'source': {
            'name': 'Called element',
            'type': ProcessEditorElementWithVariables.CalledElement,
            'subtype': 'bpmn:CallActivity'
        },
        'variables': [
            {
                'description': undefined,
                'id': 'c2f8729e-5056-44d2-8cd7-fb1bada7f4aa',
                'name': 'one',
                'type': 'string',
                'icon': 's',
                'tooltip': `
            <div class="ama-variables-selector-tooltip">
                <h3 class="ama-variables-selector-tooltip-first-header">SDK.CONDITION.TOOLTIP.VARIABLE</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>SDK.CONDITION.TOOLTIP.OUTPUT_VARIABLE_TOOLTIP.</p>
                    <span></span>
                </div>
                <h3>SDK.CONDITION.TOOLTIP.PROPERTIES</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>
                        <pre class="ama-variables-selector-variables-group-list-item-type">s</pre>
                        <span>string</span>
                    </p>
                </div>
            </div>
        `
            },
            {
                'description': undefined,
                'id': '695b2110-1060-4819-a513-400b114c93cc',
                'name': 'three',
                'type': 'boolean',
                'icon': 'b',
                'tooltip': `
            <div class="ama-variables-selector-tooltip">
                <h3 class="ama-variables-selector-tooltip-first-header">SDK.CONDITION.TOOLTIP.VARIABLE</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>SDK.CONDITION.TOOLTIP.OUTPUT_VARIABLE_TOOLTIP.</p>
                    <span></span>
                </div>
                <h3>SDK.CONDITION.TOOLTIP.PROPERTIES</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>
                        <pre class="ama-variables-selector-variables-group-list-item-type">b</pre>
                        <span>boolean</span>
                    </p>
                </div>
            </div>
        `
            },
            {
                'description': undefined,
                'id': 'b1b04bf1-19cb-4930-b750-eecb6f3977bb',
                'name': 'two',
                'type': 'integer',
                'icon': 'i',
                'tooltip': `
            <div class="ama-variables-selector-tooltip">
                <h3 class="ama-variables-selector-tooltip-first-header">SDK.CONDITION.TOOLTIP.VARIABLE</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>SDK.CONDITION.TOOLTIP.OUTPUT_VARIABLE_TOOLTIP.</p>
                    <span></span>
                </div>
                <h3>SDK.CONDITION.TOOLTIP.PROPERTIES</h3>
                <div class="ama-variables-selector-tooltip-text">
                    <p>
                        <pre class="ama-variables-selector-variables-group-list-item-type">i</pre>
                        <span>integer</span>
                    </p>
                </div>
            </div>
        `
            }
        ]
    }
];

export class ProcessElementVariablesProviderService implements ProcessEditorElementVariablesProvider {

    getHandledTypes(): ProcessEditorElementWithVariables[] {
        return [ProcessEditorElementWithVariables.Process];
    }

    getOutputVariables(): Observable<ElementVariable[]> {
        return of(expectedVariables[0].variables);
    }

    getInputVariables(): Observable<ElementVariable[]> {
        return of(expectedVariables[0].variables);
    }
}

export class CalledElementVariablesProviderService implements ProcessEditorElementVariablesProvider {

    getHandledTypes(): ProcessEditorElementWithVariables[] {
        return [ProcessEditorElementWithVariables.CalledElement];
    }

    getOutputVariables(): Observable<ElementVariable[]> {
        return of(expectedVariables[1].variables);
    }

    getInputVariables(): Observable<ElementVariable[]> {
        return of(expectedVariables[1].variables);
    }
}

/* cspell: enable*/
export const processExtensions = {
    extensions: {
        'CalledElementProcessDefinitionId': {
            'constants': {},
            'mappings': {},
            'properties': {
                'c2f8729e-5056-44d2-8cd7-fb1bada7f4aa': {
                    'id': 'c2f8729e-5056-44d2-8cd7-fb1bada7f4aa',
                    'name': 'one',
                    'type': 'string',
                    'value': 'one',
                    'required': false
                },
                'b1b04bf1-19cb-4930-b750-eecb6f3977bb': {
                    'id': 'b1b04bf1-19cb-4930-b750-eecb6f3977bb',
                    'name': 'two',
                    'type': 'integer',
                    'required': false,
                    'value': 2
                },
                '695b2110-1060-4819-a513-400b114c93cc': {
                    'id': '695b2110-1060-4819-a513-400b114c93cc',
                    'name': 'three',
                    'type': 'boolean',
                    'required': false,
                    'value': true
                }
            },
            'assignments': {}
        }
    }
};

export const processElement: Bpmn.DiagramElement = {
    id: 'ProcessDefinitionId',
    type: BpmnElement.Process,
    businessObject: {
        name: 'My Process',
        $type: BpmnElement.Process,
        id: 'ProcessDefinitionId'
    }
};

export const startEventElement: Bpmn.DiagramElement = {
    id: 'StartEvent',
    type: BpmnElement.StartEvent,
    businessObject: {
        name: 'Start event',
        $type: BpmnElement.StartEvent,
        id: 'StartEvent'
    },
    parent: processElement
};

export const sequenceFlowElement1: Bpmn.DiagramElement = {
    id: 'SequenceFlow1',
    type: BpmnElement.SequenceFlow,
    businessObject: {
        $type: BpmnElement.SequenceFlow,
        id: 'SequenceFlow1'
    },
    source: startEventElement,
    parent: processElement
};

export const calledActivitiElement: Bpmn.DiagramElement = {
    id: 'CalledElementId',
    type: BpmnElement.CallActivity,
    businessObject: {
        name: 'Called element',
        $type: BpmnElement.CallActivity,
        id: 'CalledElementId',
        calledElement: 'CalledElementProcessDefinitionId'
    },
    incoming: [sequenceFlowElement1],
    parent: processElement
};

export const sequenceFlowElement2: Bpmn.DiagramElement = {
    id: 'SequenceFlow2',
    type: BpmnElement.SequenceFlow,
    businessObject: {
        $type: BpmnElement.SequenceFlow,
        id: 'SequenceFlow2'
    },
    source: calledActivitiElement,
    parent: processElement
};

export const exclusiveGatewayElement: Bpmn.DiagramElement = {
    id: 'ExclusiveGateway',
    type: BpmnElement.ExclusiveGateway,
    businessObject: {
        $type: BpmnElement.ExclusiveGateway,
        id: 'ExclusiveGateway'
    },
    incoming: [sequenceFlowElement2],
    parent: processElement
};

export const expressionParsedStringMock = '${(uno eq one) && (uno eq "one") && (uno eq "o".concat("ne")) && (dos ge two) && (dos gt 2) && (dos lt (2+1)) && ("one" lt uno)}';

export const sequenceFlowElement3: Bpmn.DiagramElement = {
    id: 'SequenceFlow3',
    type: BpmnElement.SequenceFlow,
    businessObject: {
        $type: BpmnElement.SequenceFlow,
        id: 'SequenceFlow3',
        conditionExpression: {
            body: expressionParsedStringMock
        },
        get() {
            return { body: expressionParsedStringMock };
        }
    },
    parent: processElement,
    source: exclusiveGatewayElement
};

export const sequenceFlowElement4: Bpmn.DiagramElement = {
    id: 'SequenceFlow4',
    type: BpmnElement.SequenceFlow,
    businessObject: {
        $type: BpmnElement.SequenceFlow,
        id: 'SequenceFlow4'
    },
    source: exclusiveGatewayElement,
    parent: processElement
};
