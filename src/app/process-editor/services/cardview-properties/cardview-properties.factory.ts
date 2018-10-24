import { Injectable } from '@angular/core';
import { LogService, CardViewItem, AppConfigService } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { elementsProperties } from '../bpmn/elements-properties';
import { BpmnProperty } from '../bpmn/properties';
import { bpmn2cardView } from './bpmn2CardView';
import { AmaState } from 'ama-sdk';
import { Store } from '@ngrx/store';

export interface FactoryProps {
    element: Bpmn.DiagramElement;
    appConfigService?: AppConfigService;
    store?: Store<AmaState>;
}

@Injectable()
export class CardViewPropertiesFactory {
    constructor(private logService: LogService, private appConfigService: AppConfigService, private store: Store<AmaState>) {}

    createCardViewPropertiesFor(element: Bpmn.DiagramElement): CardViewItem[] {
        const type = ElementHelper.getType(element),
            bpmnPropertiesForElement = elementsProperties[type];

        if (bpmnPropertiesForElement) {
            return bpmnPropertiesForElement.map(this.createCardViewPropertyFor.bind(this, element));
        } else {
            this.logService.debug(element);
            return [];
        }
    }

    private createCardViewPropertyFor(element: Bpmn.DiagramElement, bpmnProperty: BpmnProperty): CardViewItem {
        const factoryFunction = bpmn2cardView[bpmnProperty];

        if (!factoryFunction) {
            return null;
        }

        return factoryFunction({ element, store: this.store, appConfigService: this.appConfigService });
    }
}
