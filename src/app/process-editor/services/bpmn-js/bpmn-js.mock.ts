import { BpmnFactory } from '../bpmn-factory.token';

export class BpmnFactoryMock implements BpmnFactory {
    create() {
        const canvasObject = { zoom: () => {} };

        return {
            createDiagram() {},
            importXML() {},
            saveXML() {},
            saveSVG() {},
            get(subject) {
                if (subject === 'canvas') {
                    return canvasObject;
                }
            },
            destroy() {},
            on() {},
            off() {},
            attachTo() {},
            detach() {}
        };
    }
}

export function getDiagramElementMock(businessObject): Bpmn.DiagramElement {
    const mock = {
        id: 'mock-element-id',
        type: 'mock-element-type',
        businessObject: {
            $type: 'mock-element-type',
            id: 'mock-element-id',
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
