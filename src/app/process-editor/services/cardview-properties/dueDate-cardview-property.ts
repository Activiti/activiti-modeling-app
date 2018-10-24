import { CardViewDateItemModel } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '../bpmn/properties';
import { FactoryProps } from './cardview-properties.factory';
import { displayFormat } from '../bpmn-js/property-handlers/dueDate.handler';

const propertyName = BpmnProperty.dueDate;

export function createDueDateProperty({ element }: FactoryProps) {
    return new CardViewDateItemModel({
        label: 'APP.PROCESS_EDITOR.ELEMENT_PROPERTIES.DUE_DATE',
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        editable: true,
        format: displayFormat,
        data: { id: element.id }
    });
}
