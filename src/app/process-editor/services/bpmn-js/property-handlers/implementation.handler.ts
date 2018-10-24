import { BpmnProperty } from '../../bpmn/properties';

const propertyKey = BpmnProperty.implementation;

const get = element => element.businessObject[propertyKey];
const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: value
    });
};

export const implementationHandler = { get, set };
