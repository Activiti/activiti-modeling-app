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

import { ProcessModel } from './process.model';

export class ProcessDefinitionModel {
    '_declaration' = {};
    'bpmn2:definitions' = {
        '_attributes' : {
            'xmlns:xsi': '',
            'xmlns:bpmn2': '',
            'xmlns:bpmndi': '',
            'xmlns:dc': '',
            id: '',
            targetNamespace: '',
            'xsi:schemaLocation': ''
        },
        'bpmn2:process': new ProcessModel(),
        'bpmndi:BPMNDiagram': {}
    };

    constructor(details?: any) {
        Object.assign(this['_declaration'], details[`_declaration`]);
        Object.assign(this['bpmn2:definitions']['_attributes'], details[`bpmn2:definitions`][`_attributes`]);
        this['bpmn2:definitions']['bpmn2:process'] = details[`bpmn2:definitions`]['bpmn2:process'] ? new ProcessModel(details[`bpmn2:definitions`]['bpmn2:process']) : null;
        Object.assign(this['bpmn2:definitions']['bpmndi:BPMNDiagram'], details[`bpmn2:definitions`][`bpmndi:BPMNDiagram`]);
    }

    getProcessName() {
        return this['bpmn2:definitions']['bpmn2:process'].getName();
    }

    setProcessName(name) {
        this['bpmn2:definitions']['bpmn2:process'].setName(name);
    }
}
