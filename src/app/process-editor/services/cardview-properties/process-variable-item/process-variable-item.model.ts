import { CardViewBaseItemModel, CardViewItem, DynamicComponentModel } from '@alfresco/adf-core';

export class CardViewProcessVariableItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type = 'properties';

    get displayValue() {
        return this.default;
    }
}
