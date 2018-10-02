import { BpmnProperty } from '../../bpmn/properties';

const propertyKey = BpmnProperty.activityName;

const get = element => element.businessObject.get(propertyKey);
const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: value
    });
};

export const activityNameHandler = { get, set };
