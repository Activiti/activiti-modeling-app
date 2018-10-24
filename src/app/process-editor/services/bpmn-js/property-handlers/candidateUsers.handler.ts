import { BpmnProperty } from '../../bpmn/properties';

const propertyKey = BpmnProperty.candidateUsers;

const get = element => element.businessObject.get(propertyKey);
const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: value
    });
};

export const candidateUsersHandler = { get, set };
