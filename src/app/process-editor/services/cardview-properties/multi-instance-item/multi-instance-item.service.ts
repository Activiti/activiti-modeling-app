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
import { ProcessModelerService, ProcessModelerServiceToken, BpmnProperty, BpmnElement } from 'ama-sdk';
import { MultiInstanceProps, MultiInstanceType } from '../../bpmn-js/property-handlers/multi-instance.handler';

@Injectable()
export class CardViewMultiInstanceItemService {

    constructor(@Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService) {}

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

    createOrUpdateCompleteCondition(expression: string) {
        if (!this.element.loopCharacteristics[MultiInstanceProps.completionCondition]) {
            this.createLoopCharacteristics(MultiInstanceProps.completionCondition, expression);
        } else {
            this.element.loopCharacteristics[MultiInstanceProps.completionCondition].set('body', expression);
        }
        this.updateEditor();
    }

    createOrUpdateCardinality(expression: string) {
        if (!this.element.loopCharacteristics[MultiInstanceProps.loopCardinality]) {
            this.createLoopCharacteristics(MultiInstanceProps.loopCardinality, expression);
        } else {
            this.element.loopCharacteristics[MultiInstanceProps.loopCardinality].set('body', expression);
        }
        this.updateEditor();
    }

    createOrUpdateMultiInstanceElement(selectedType: MultiInstanceType) {
        const isSequence = selectedType === MultiInstanceType.sequence;
        if (!this.element[MultiInstanceProps.loopCharacteristics]) {
            this.createMultiInstanceElement();
        }
        this.element[MultiInstanceProps.loopCharacteristics].set(MultiInstanceProps.isSequential, isSequence);
    }

    createOrUpdateCollectionExpression(expression: string) {
        this.element[MultiInstanceProps.loopCharacteristics].set(MultiInstanceProps.collection, expression);
        this.updateEditor();
    }

    createOrUpdateElementVariable(expression: string) {
        this.element[MultiInstanceProps.loopCharacteristics].set(MultiInstanceProps.elementVariable, expression);
        this.updateEditor();
    }

    updateEditor() {
        this.processModelerService.updateElementProperty(this.element.id, BpmnProperty.multiInstanceType, this.element);
    }

    private createLoopCharacteristics(character: MultiInstanceProps, expression) {
        const characterElement = this.bpmnFactory.create(BpmnElement.Expression, { 'body': expression });
        this.element.loopCharacteristics.set(character, characterElement);
    }

    private createMultiInstanceElement() {
        const multiInstanceElement = this.bpmnFactory.create(BpmnElement.MultiInstanceLoopCharacteristics);
        this.element.set(MultiInstanceProps.loopCharacteristics, multiInstanceElement);
    }

}
