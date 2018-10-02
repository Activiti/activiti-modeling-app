import { CardViewSelectItemModel } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '../bpmn/properties';
import { of } from 'rxjs';
import { FactoryProps } from './cardview-properties.factory';

const propertyName = BpmnProperty.priority;

export function createPriorityProperty({ element, appConfigService }: FactoryProps) {
    return new CardViewSelectItemModel({
        label: 'APP.PROCESS_EDITOR.ELEMENT_PROPERTIES.PRIORITY',
        options$: of(appConfigService.get('process-modeler.priorities')),
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        editable: true,
        data: { id: element.id }
    });
}
