import { CardViewBoolItemModel } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '../bpmn/properties';
import { FactoryProps } from './cardview-properties.factory';

const propertyName = BpmnProperty.isExecutable;

export function createExecutableProperty({ element }: FactoryProps) {
    return new CardViewBoolItemModel({
        label: 'APP.PROCESS_EDITOR.ELEMENT_PROPERTIES.EXECUTABLE',
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        default: false,
        editable: true,
        data: { id: element.id }
    });
}
