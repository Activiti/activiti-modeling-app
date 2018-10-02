import { BpmnProperty } from '../../bpmn/properties';

const propertyKey = BpmnProperty.candidateGroups;

const get = element => element.businessObject.get(propertyKey);
const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: value
    });
};

export const candidateGroupsHandler = { get, set };
