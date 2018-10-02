import BpmnModdle from 'bpmn-moddle';
import { BpmnProperty } from '../../bpmn/properties';
const moddle = new BpmnModdle();

const propertyKey = BpmnProperty.documentation;

const get = (element: Bpmn.DiagramElement) => {
    const businessObject = element.businessObject;
    const documentations = businessObject && businessObject.get(propertyKey),
        text = documentations && documentations.length > 0 ? documentations[0].text : '';

    return text;
};

const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: [
            moddle.create('bpmn:Documentation', {
                text: value
            })
        ]
    });
};

export const documentationHandler = { get, set };
