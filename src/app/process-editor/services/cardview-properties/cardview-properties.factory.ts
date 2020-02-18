/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { LogService, CardViewItem, AppConfigService } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { elementsProperties } from '../bpmn/elements-properties';
import { BpmnProperty, AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { bpmn2cardView } from './bpmn2CardView';
import { Store } from '@ngrx/store';

export interface FactoryProps {
    element: Bpmn.DiagramElement;
    appConfigService?: AppConfigService;
    store?: Store<AmaState>;
}

@Injectable()
export class CardViewPropertiesFactory {
    constructor(
        private logService: LogService,
        private appConfigService: AppConfigService,
        private store: Store<AmaState>
    ) {}

    createCardViewPropertiesFor(element: Bpmn.DiagramElement): CardViewItem[] {
        const type = ElementHelper.getType(element);
        const bpmnPropertiesForElement = elementsProperties[type];

        if (!bpmnPropertiesForElement) {
            this.logService.debug(element);
            return [];
        }

        const properties = Array.isArray(bpmnPropertiesForElement) ? bpmnPropertiesForElement : bpmnPropertiesForElement(element);
        return properties.map(this.createCardViewPropertyFor.bind(this, element));
    }

    private createCardViewPropertyFor(element: Bpmn.DiagramElement, bpmnProperty: BpmnProperty): CardViewItem {
        const factoryFunction = bpmn2cardView[bpmnProperty];

        if (!factoryFunction) {
            return null;
        }

        return factoryFunction({ element, store: this.store, appConfigService: this.appConfigService });
    }
}
