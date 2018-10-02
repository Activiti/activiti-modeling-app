import { CardViewKeyValuePairsItemModel } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '../bpmn/properties';
import { FactoryProps } from './cardview-properties.factory';

const propertyName = BpmnProperty.variables;

export function createVariablesProperty({ element }: FactoryProps) {
    return new CardViewKeyValuePairsItemModel({
        label: 'APP.PROCESS_EDITOR.ELEMENT_PROPERTIES.VARIABLES',
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        data: { id: element.id },
        editable: true
    });
}
