import BpmnModdle from 'bpmn-moddle';
import { BpmnProperty } from '../../bpmn/properties';
const moddle = new BpmnModdle();

const propertyKey = BpmnProperty.conditionExpression;

const get = (element: Bpmn.DiagramElement) => {
    const businessObject = element.businessObject;
    const expression = businessObject && businessObject.get(propertyKey),
        body =  expression ? expression.body : '';

    return body;
};

const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: moddle.create('bpmn:FormalExpression', {
                body: value,
            })
    });
};

export const expressionHandler = { get, set };
