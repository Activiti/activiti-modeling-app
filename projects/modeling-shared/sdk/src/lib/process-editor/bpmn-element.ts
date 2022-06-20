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

export const DECISION_TASK_IMPLEMENTATION = 'dmn-connector.EXECUTE_TABLE';
export const SCRIPT_TASK_IMPLEMENTATION = 'script.EXECUTE';
export const DECISION_TABLE_INPUT_PARAM_NAME = '_activiti_dmn_table_';
export const SCRIPT_INPUT_PARAM_NAME = '_activiti_script_';
export const EMAIL_SERVICE_SEND_TASK_IMPLEMENTATION = 'email-service.SEND';
export const EMAIL_SERVICE_NAME = 'email-service';
export const DOCGEN_SERVICE_GENERATE_TASK_IMPLEMENTATION = 'docgen-service.GENERATE';
export const DOCGEN_SERVICE_NAME = 'docgen-service';
export const CONTENT_SERVICE_NAME = 'content-service';
export const AUTHENTICATION_INPUT_PARAM_NAME = 'authentication';

export const OOTB_SERVICE_TASK_DESCRIPTORS = {
    [DOCGEN_SERVICE_GENERATE_TASK_IMPLEMENTATION]: 'docgenConnector',
    [EMAIL_SERVICE_SEND_TASK_IMPLEMENTATION]: 'emailConnector'
};

export enum BpmnElement {
    Process = 'bpmn:Process',
    IntermediateCatchEvent = 'bpmn:IntermediateCatchEvent',
    IntermediateThrowEvent = 'bpmn:IntermediateThrowEvent',
    StartEvent = 'bpmn:StartEvent',
    ErrorEventDefinition = 'bpmn:ErrorEventDefinition',
    TimerEventDefinition = 'bpmn:TimerEventDefinition',
    SignalEventDefinition = 'bpmn:SignalEventDefinition',
    MessageEventDefinition = 'bpmn:MessageEventDefinition',
    Message = 'bpmn:Message',
    EndEvent = 'bpmn:EndEvent',
    BoundaryEvent = 'bpmn:BoundaryEvent',
    SequenceFlow = 'bpmn:SequenceFlow',
    Participant = 'bpmn:Participant',
    Gateway = 'bpmn:Gateway',
    ExclusiveGateway = 'bpmn:ExclusiveGateway',
    FormalExpression = 'bpmn:FormalExpression',
    ParallelGateway = 'bpmn:ParallelGateway',
    InclusiveGateway = 'bpmn:InclusiveGateway',
    ServiceTask = 'bpmn:ServiceTask',
    UserTask = 'bpmn:UserTask',
    CallActivity = 'bpmn:CallActivity',
    SubProcess= 'bpmn:SubProcess',
    MultiInstanceLoopCharacteristics = 'bpmn:MultiInstanceLoopCharacteristics',
    Expression = 'bpmn:Expression',
    DataOutput = 'bpmn:DataOutput',
    Task = 'bpmn:Task',
    TextAnnotation= 'bpmn:TextAnnotation',
    Collaboration = 'bpmn:Collaboration',
    Lane = 'bpmn:Lane',
    Error = 'bpmn:Error',
    Label = 'label',
}
