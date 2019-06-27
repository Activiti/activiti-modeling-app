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

import { ACMCrud } from '../acm-crud';
import { ServiceInputParameterMapping, MappingType, ServiceOutputParameterMapping } from '../../../util/types';

export class ACMProcess extends ACMCrud {

    displayName = 'Process';
    namePrefix = 'QA_APS_PROCESS_';
    type = 'PROCESS';
    contentType = 'text/plain';
    contentExtension = 'xml';

    /* cSpell:disable */
    getDefaultContent(entityName: string, entityId: string) {
        const entityUuid = `${this.type.toLowerCase()}-${entityId}`;
        return `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn2:definitions
            xmlns:activiti="http://activiti.org/bpmn"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
            xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
            xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
            xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
            xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
            id="sample-diagram"
            targetNamespace="http://bpmn.io/schema/bpmn">
          <bpmn2:process id="${entityUuid}" isExecutable="true" name="${entityName}">
            <bpmn2:documentation>Lorem ipsum dolor sit amet...</bpmn2:documentation>
            <bpmn2:startEvent id="StartEvent_1"/>
          </bpmn2:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${entityUuid}">
              <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
                <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn2:definitions>`;
    }
    /* cSpell:enable */
}

export class ServiceParameterMappings {
    inputs: ServiceInputParameterMapping;
    outputs: ServiceOutputParameterMapping;

    constructor(inputs?: ServiceInputParameterMapping, outputs?: ServiceOutputParameterMapping) {
      this.inputs = inputs;
      this.outputs = outputs;
    }

    setInputs(inputs?: ServiceInputParameterMapping) {
      this.inputs = Object.assign(this.inputs, inputs);
    }

    setOutputs(outputs?: ServiceOutputParameterMapping) {
      this.outputs = Object.assign(this.outputs, outputs);
    }
}

export class ParameterMapping {
      parameterName: string;
      value: string;
      type: MappingType;

    static getParameterMapping(parameterName: string, processVariable: string, variableType: MappingType): ServiceInputParameterMapping {
        const mapping = {};
        mapping[parameterName] = {
          type: variableType,
          value: processVariable
        };

        return mapping;
    }
}
