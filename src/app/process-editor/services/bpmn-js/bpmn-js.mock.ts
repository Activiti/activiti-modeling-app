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

import { BpmnFactory } from '@alfresco-dbp/modeling-shared/sdk';
import EventBusMock from './EventBusMock';

export class BpmnFactoryMock implements BpmnFactory {
    public modeler: Bpmn.Modeler;

    create(): Bpmn.Modeler {
        const eventBus = new EventBusMock();
        const canvasObject = { zoom: () => {} };
        const modelingObject: Bpmn.Modeling = { updateProperties: () => {} };

        this.modeler = {
            createDiagram() {},
            importXML() {},
            saveXML() {},
            saveSVG() {},
            get(subject) {
                if (subject === 'canvas') {
                    return canvasObject;
                } else if (subject === 'eventBus') {
                    return eventBus;
                } else if (subject === 'modeling') {
                    return modelingObject;
                }
            },
            destroy() {
                eventBus.fire('diagram.destroy');
            },
            on: eventBus.on.bind(eventBus),
            off: eventBus.off.bind(eventBus),
            attachTo() {},
            detach() {}
        };

        return this.modeler;
    }
}

export function getDiagramElementMock(businessObject): Bpmn.DiagramElement {
    const mock = {
        id: 'mock-element-id',
        type: 'mock-element-type',
        businessObject: {
            $type: 'mock-element-type',
            id: 'mock-element-id',
            $parent: {
                id: 'mock-parent-id'
            },
            get: function(key) {
                return this[key];
            },
            ...businessObject
        }
    };

    spyOn(mock.businessObject, 'get').and.callThrough();

    return mock;
}

export function getModelingMock(): Bpmn.Modeling {
    const modeling = {
        updateProperties(element: Bpmn.DiagramElement, properties) {
            Object.assign(element.businessObject, properties);
        }
    };

    return modeling;
}

export function getModdleMock(): Bpmn.Moddle {
    const bpmnFactory = {
        create(tagName: string, properties) {
            return { $type: tagName,
                    ...properties
                };
        }
    };

    return bpmnFactory;
}
