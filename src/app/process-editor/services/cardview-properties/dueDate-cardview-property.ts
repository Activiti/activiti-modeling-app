import { CardViewDateItemModel } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '../bpmn/properties';
import moment from 'moment-es6';
import { FactoryProps } from './cardview-properties.factory';

const propertyName = BpmnProperty.dueDate;

export function createDueDateProperty({ element }: FactoryProps) {
    return new CardViewDateItemModel({
        label: 'APP.PROCESS_EDITOR.ELEMENT_PROPERTIES.DUE_DATE',
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        default: moment().format('MMM DD YYYY'),
        editable: true,
        format: 'MMM DD YYYY',
        data: { id: element.id }
    });
}
