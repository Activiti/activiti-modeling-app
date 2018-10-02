import { FactoryProps } from './cardview-properties.factory';
import { CardViewProcessVariableItemModel } from './process-variable-item/process-variable-item.model';
import { BpmnProperty } from '../bpmn/properties';

const propertyName = BpmnProperty.properties;

export function createProcessVariablesProperty({ element }: FactoryProps) {
    return new CardViewProcessVariableItemModel({
        label: '',
        value: '',
        key: propertyName,
        default: '',
        editable: false
    });
}
