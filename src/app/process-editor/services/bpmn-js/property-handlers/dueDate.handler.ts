import { BpmnProperty } from '../../bpmn/properties';
import moment from 'moment-es6';

const propertyKey = BpmnProperty.dueDate;

export const displayFormat = 'YYYY-MM-DDTHH:mm:ss';
export const exportFormat = 'YYYY-MM-DDTHH:mm:ss';

const get = element => {
    const property = element.businessObject.get(propertyKey);
    return property ? moment(property, exportFormat).format(displayFormat) : '';
};

const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: moment(value).format(exportFormat),
    });
};

export const dueDateHandler = { get, set };
