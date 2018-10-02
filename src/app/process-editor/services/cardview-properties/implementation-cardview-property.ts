import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '../bpmn/properties';
import { FactoryProps } from './cardview-properties.factory';
import { ImplementationItemModel } from './implementation-item/implementation-item.model';

const property = BpmnProperty.implementation;

export function createImplementationProperty({ element }: FactoryProps) {
    return new ImplementationItemModel({
        label: 'APP.PROCESS_EDITOR.ELEMENT_PROPERTIES.IMPLEMENTATION',
        value: ElementHelper.getProperty(element, property),
        key: property,
        default: '',
        editable: true,
        data: { id: element.id }
    });
}
