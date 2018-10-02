import BpmnModdle from 'bpmn-moddle';
import { BpmnProperty } from '../../bpmn/properties';

const moddle = new BpmnModdle();
const propertyKey = BpmnProperty.properties;

const get = element => {};

const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    const values = value;
    const moddles =  Object.keys(values).map(key => moddle.create('bpmn:Property', { name: key } ));

    modeling.updateProperties(element, {
        [propertyKey]: moddles
    });
};

export const propertiesHandler = { get, set };
