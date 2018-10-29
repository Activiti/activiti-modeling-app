import { CardViewSelectItemModel } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '../bpmn/properties';
import { FactoryProps } from './cardview-properties.factory';
import { selectProcessesKeyLabelArray } from '../../store/process-editor.selectors';

const propertyName = BpmnProperty.calledElement;

export function createCalledElementProperty({ element, store }: FactoryProps) {
    return new CardViewSelectItemModel({
        label: 'APP.PROCESS_EDITOR.ELEMENT_PROPERTIES.ACTIVITY_NAME',
        options$: store.select(selectProcessesKeyLabelArray),
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        editable: true,
        data: { id: element.id }
    });
}
