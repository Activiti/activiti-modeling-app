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

import { Inject, Injectable } from '@angular/core';
import { ProcessModelerService, ProcessModelerServiceToken, BpmnProperty, BpmnElement } from '@alfresco-dbp/modeling-shared/sdk';
import { MultiInstanceProps, MultiInstanceType } from '../../bpmn-js/property-handlers/multi-instance.handler';

@Injectable()
export class CardViewMultiInstanceItemService {

    constructor(@Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService) {
    }

    private _element: Bpmn.BusinessObject;

    get element(): Bpmn.BusinessObject {
        return this._element;
    }

    set element(value: Bpmn.BusinessObject) {
        this._element = value;
    }

    get bpmnFactory(): any {
        return this.processModelerService.getFromModeler('bpmnFactory');
    }

    createOrUpdateExpression(prop: MultiInstanceProps, expression: string) {
        const characterElement = this.bpmnFactory.create(BpmnElement.Expression);
        this.element.loopCharacteristics.set(prop, characterElement);
        this.element.loopCharacteristics[prop].set('body', expression);
        this.updateEditor();
    }

    createOrUpdateLoopDataOutputRef(expression: string) {
        this.element.loopCharacteristics.set(MultiInstanceProps.loopDataOutputRef, expression);
        this.updateEditor();
    }

    createOrUpdateOutputDataItem(expression: string) {
        const characterElement = this.bpmnFactory.create(BpmnElement.DataOutput, { name: expression });
        this.element.loopCharacteristics.set(MultiInstanceProps.outputDataItem, characterElement);
        this.updateEditor();
    }

    createOrUpdateMultiInstanceElement(selectedType: MultiInstanceType) {
        const isSequence = selectedType === MultiInstanceType.sequence;
        if (!this.element[MultiInstanceProps.loopCharacteristics]) {
            const multiInstanceElement = this.bpmnFactory.create(BpmnElement.MultiInstanceLoopCharacteristics);
            this.element.set(MultiInstanceProps.loopCharacteristics, multiInstanceElement);
        }
        this.element[MultiInstanceProps.loopCharacteristics].set(MultiInstanceProps.isSequential, isSequence);
    }

    createOrUpdateCollectionExpression(collection: string) {
        this.element[MultiInstanceProps.loopCharacteristics].set(MultiInstanceProps.collection, collection);
        this.updateEditor();
    }

    createOrUpdateElementVariable(elementVariable: string) {
        this.element[MultiInstanceProps.loopCharacteristics].set(MultiInstanceProps.elementVariable, elementVariable);
        this.updateEditor();
    }

    updateEditor() {
        this.processModelerService.updateElementProperty(this.element.id, BpmnProperty.multiInstanceType, this.element);
    }

}
