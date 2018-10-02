import { BpmnProperty } from '../../bpmn/properties';

const propertyKey = BpmnProperty.name;

const get = element => element.businessObject[propertyKey];
const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: value
    });
};

export const nameHandler = { get, set };
