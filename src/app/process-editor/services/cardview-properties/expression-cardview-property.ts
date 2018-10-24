import { CardViewTextItemModel } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '../bpmn/properties';
import { FactoryProps } from './cardview-properties.factory';
import { BpmnElement } from '../bpmn/elements';

const propertyName = BpmnProperty.conditionExpression;

export function createExpressionProperty({ element }: FactoryProps) {
   if (element.businessObject.sourceRef.$type ===  BpmnElement.ExclusiveGateway) {
    return new CardViewTextItemModel({
        label: 'APP.PROCESS_EDITOR.ELEMENT_PROPERTIES.EXPRESSION',
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        default: '',
        multiline: true,
        editable: true,
        data: { id: element.id }
    });
   } else {
       return;
   }
}
