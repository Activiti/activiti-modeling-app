import { BpmnProperty } from '../../bpmn/properties';
import moment from 'moment-es6';

const propertyKey = BpmnProperty.dueDate;

const get = element => {
    const property = element.businessObject.get(propertyKey);
    return property ? moment(property, 'DD.MM.YYYY').format('MMM DD YYYY') : '';
};

const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: moment(value).format('DD.MM.YYYY'),
    });
};

export const dueDateHandler = { get, set };
