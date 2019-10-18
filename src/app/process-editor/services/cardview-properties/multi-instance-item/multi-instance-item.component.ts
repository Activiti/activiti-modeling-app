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

import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService, CardViewSelectItemOption } from '@alfresco/adf-core';
import { MultiInstanceItemModel } from './multi-instance.item.model';
import { BpmnElement, BpmnProperty, ProcessModelerService, ProcessModelerServiceToken } from 'ama-sdk';
import { getMultiInstanceType, MultiInstanceProps, MultiInstanceType } from '../../bpmn-js/property-handlers/multi-instance.handler';
import { FormControl, Validators } from '@angular/forms';
import { _isNumberValue } from '@angular/cdk/coercion';

@Component({
    selector: 'ama-multi-instance-item',
    templateUrl: './multi-instance-item.component.html',
    styleUrls: ['./multi-instance-item.component.scss']
})
export class CardViewMultiInstanceItemComponent implements OnInit {
    @Input() property: MultiInstanceItemModel;

    options$: Observable<CardViewSelectItemOption<string>[]>;
    selectedType: MultiInstanceType;
    cardinality: FormControl;

    constructor(
        private appConfigService: AppConfigService,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService
    ) {
        this.options$ = of(this.appConfigService.get('process-modeler.multi-instance-types'));
    }

    get element(): any {
        return this.property.data.element.businessObject;
    }

    private get bpmnFactory() {
        return this.processModelerService.getFromModeler('bpmnFactory');
    }

    ngOnInit() {
        this.selectedType = getMultiInstanceType(this.element[MultiInstanceProps.loopCharacteristics]);
        this.cardinality = new FormControl(this.parseCardinality(), [ Validators.required, this.validateExpression ]);
    }

    onTypeChange(selection: MultiInstanceType) {
        switch (selection) {
            case MultiInstanceType.parallel:
            case MultiInstanceType.sequence:
                this.modifyMultiInstanceElement(selection);
                break;
            case MultiInstanceType.none:
                delete this.element[MultiInstanceProps.loopCharacteristics];
                this.cardinality.reset();
                break;
        }
        this.processModelerService.updateElementProperty(this.element.id, BpmnProperty.multiInstanceType, this.element);
    }

    onCardinalityChange(expression) {
        if (!this.hasCardinalityElement()) {
            this.createCardinalityElement(expression);
        } else {
            this.element.loopCharacteristics[MultiInstanceProps.loopCardinality].set('body', expression);
        }
        this.processModelerService.updateElementProperty(this.element.id, BpmnProperty.multiInstanceType, this.element);
    }

    parseCardinality(): string {
        return (
            this.element[MultiInstanceProps.loopCharacteristics] &&
            this.element[MultiInstanceProps.loopCharacteristics][MultiInstanceProps.loopCardinality] &&
            this.element[MultiInstanceProps.loopCharacteristics][MultiInstanceProps.loopCardinality]['body']
        );
    }

    validateExpression({ value }: FormControl) {
        const expression: RegExp = /{([^}]+)}/;
        const isValid: boolean = expression.test(value) || _isNumberValue(value);

        return (isValid) ? null : {
            message: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.MESSAGE_EXPRESSION_INVALID'
        };
    }

    private modifyMultiInstanceElement(selectedType: MultiInstanceType) {
        const isSequence = selectedType === MultiInstanceType.sequence;
        if (!this.hasMultiInstanceElement()) {
            this.createMultiInstanceElement();
        }
        this.element[MultiInstanceProps.loopCharacteristics].set(MultiInstanceProps.isSequential, isSequence);
    }

    private createMultiInstanceElement() {
        const multiInstanceElement = this.bpmnFactory.create(BpmnElement.MultiInstanceLoopCharacteristics);
        this.element.set(MultiInstanceProps.loopCharacteristics, multiInstanceElement);
    }

    private createCardinalityElement(expression: string) {
        const loopCardinality = this.bpmnFactory.create(BpmnElement.Expression, {'body': expression});
        this.element.loopCharacteristics.set(MultiInstanceProps.loopCardinality, loopCardinality);
    }

    private hasMultiInstanceElement(): boolean {
        return !!this.element[MultiInstanceProps.loopCharacteristics];
    }

    private hasCardinalityElement(): boolean {
        return !!this.element.loopCharacteristics[MultiInstanceProps.loopCardinality];
    }
}
