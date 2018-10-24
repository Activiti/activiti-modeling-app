import { CardViewBaseItemModel, CardViewItem, DynamicComponentModel } from '@alfresco/adf-core';

export class ImplementationItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type = 'implementation';

    get displayValue() {
        return this.default;
    }
}
