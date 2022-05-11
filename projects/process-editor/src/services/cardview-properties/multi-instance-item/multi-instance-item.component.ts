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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AppConfigService, CardViewSelectItemOption, CardViewUpdateService, UpdateNotification } from '@alfresco/adf-core';
import { MultiInstanceItemModel } from './multi-instance.item.model';
import { getMultiInstanceType, MultiInstanceProps, MultiInstanceType } from '../../bpmn-js/property-handlers/multi-instance.handler';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _isNumberValue } from '@angular/cdk/coercion';
import { CardViewMultiInstanceItemService } from './multi-instance-item.service';
import { takeUntil, filter, map } from 'rxjs/operators';

@Component({
    selector: 'ama-multi-instance-item',
    templateUrl: './multi-instance-item.component.html',
    styleUrls: ['./multi-instance-item.component.scss'],
    providers: [ CardViewMultiInstanceItemService ]
})
export class CardViewMultiInstanceItemComponent implements OnInit, OnDestroy {
    @Input() property: MultiInstanceItemModel;

    options$: Observable<CardViewSelectItemOption<string>[]>;
    selectedType: MultiInstanceType;
    form: FormGroup;
    onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private appConfigService: AppConfigService,
        private multiInstanceItemService: CardViewMultiInstanceItemService,
        private formBuilder: FormBuilder,
        private cardViewUpdateService: CardViewUpdateService) {
        this.options$ = of(this.appConfigService.get('process-modeler.multi-instance-types'));
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    get element(): Bpmn.BusinessObject {
        return this.property.data.element.businessObject;
    }

    get cardinality(): AbstractControl {
        return this.form.get('cardinality');
    }

    get completionCondition(): AbstractControl {
        return this.form.get('completionCondition');
    }

    get collectionExpression(): AbstractControl {
        return this.form.get('collectionExpression');
    }

    get elementVariable(): AbstractControl {
        return this.form.get('elementVariable');
    }

    get loopDataOutputRef(): AbstractControl {
        return this.form.get('loopDataOutputRef');
    }

    get outputDataItem(): AbstractControl {
        return this.form.get('outputDataItem');
    }

    ngOnInit() {
        this.selectedType = getMultiInstanceType(this.element[MultiInstanceProps.loopCharacteristics]);
        this.form = this.formBuilder.group({
            cardinality: [ this.parseMultiInstanceProperty(MultiInstanceProps.loopCardinality) ],
            collectionExpression: [ this.parseMultiInstance(MultiInstanceProps.collection), [ Validators.pattern(/{([^}]+)}/) ] ],
            elementVariable: [ this.parseMultiInstance(MultiInstanceProps.elementVariable) ],
            completionCondition: [ this.parseMultiInstanceProperty(MultiInstanceProps.completionCondition), [ Validators.pattern(/{([^}]+)}/) ] ],
            loopDataOutputRef: [ this.parseMultiInstanceLoopDataOutputRef() ],
            outputDataItem: [ this.parseMultiInstanceOutputDataItem() ],
        },   { validators: this.validateExpression });
        this.multiInstanceItemService.element = this.element;
        this.cardViewUpdateService.itemUpdated$
            .pipe(
                filter((element: UpdateNotification) => element?.target?.data?.id === this.property.data.id && this.isLoopRefProperty(element)),
                map((mappedElement: UpdateNotification) => this.getLoopCharacteristicsValue(mappedElement)),
                takeUntil(this.onDestroy$))
            .subscribe((outputLoopRef: string) => {
                this.onLoopDataOutputRefChange(outputLoopRef);
            });
    }

    onTypeChange(selection: MultiInstanceType) {
        switch (selection) {
        case MultiInstanceType.parallel:
        case MultiInstanceType.sequence:
            this.multiInstanceItemService.createOrUpdateMultiInstanceElement(selection);
            this.cardViewUpdateService.update(this.property, {value: true});
            break;
        case MultiInstanceType.none:
            delete this.element[MultiInstanceProps.loopCharacteristics];
            this.cardViewUpdateService.update(this.property, {value: false});
            this.form.reset();
            break;
        }
        this.multiInstanceItemService.updateEditor();
    }

    onCardinalityChange(expression: string) {
        this.multiInstanceItemService.createOrUpdateExpression(MultiInstanceProps.loopCardinality, expression);
    }

    onCompletionConditionChange(expression: string) {
        this.multiInstanceItemService.createOrUpdateExpression(MultiInstanceProps.completionCondition, expression);
    }

    onCollectionExpressionChange(expression: string) {
        this.multiInstanceItemService.createOrUpdateCollectionExpression(expression);
    }

    onElementVariableChange(iterationVariable: string) {
        this.multiInstanceItemService.createOrUpdateElementVariable(iterationVariable);
    }

    onLoopDataOutputRefChange(loopDataOutputRef: string) {
        this.multiInstanceItemService.createOrUpdateLoopDataOutputRef(loopDataOutputRef);
    }

    onOutputDataItemChange(iterationVariable: string) {
        this.multiInstanceItemService.createOrUpdateOutputDataItem(iterationVariable);
    }

    private isLoopRefProperty(element: UpdateNotification): boolean {
        return element?.changed?.loopDataOutputRef ? this.getLoopCharacteristicsValue(element) !== null : false;
    }

    private getLoopCharacteristicsValue(element: UpdateNotification) {
        return element?.changed?.loopDataOutputRef ? Object.keys(element?.changed?.loopDataOutputRef)[0] : '';
    }

    private parseMultiInstance(props: MultiInstanceProps) {
        return (
            this.element[MultiInstanceProps.loopCharacteristics] &&
            this.element[MultiInstanceProps.loopCharacteristics][props]
        );
    }

    private parseMultiInstanceProperty(props: MultiInstanceProps) {
        return (
            this.element[MultiInstanceProps.loopCharacteristics] &&
            this.element[MultiInstanceProps.loopCharacteristics][props] &&
            this.element[MultiInstanceProps.loopCharacteristics][props]['body']
        );
    }

    private parseMultiInstanceLoopDataOutputRef() {
        return (
            this.element[MultiInstanceProps.loopCharacteristics] &&
            this.element[MultiInstanceProps.loopCharacteristics][MultiInstanceProps.loopDataOutputRef] &&
            this.element[MultiInstanceProps.loopCharacteristics][MultiInstanceProps.loopDataOutputRef]
        );
    }

    private parseMultiInstanceOutputDataItem() {
        return (
            this.element[MultiInstanceProps.loopCharacteristics] &&
            this.element[MultiInstanceProps.loopCharacteristics][MultiInstanceProps.outputDataItem] &&
            this.element[MultiInstanceProps.loopCharacteristics][MultiInstanceProps.outputDataItem]['name']
        );
    }

    validateExpression(formGroup: FormGroup) {
        const cardinalityControl = formGroup.controls['cardinality'], elementControl =  formGroup.controls['elementVariable'];
        const expression = /{([^}]+)}/;
        if (cardinalityControl.value) {
            const isValidCardinality: boolean = expression.test(cardinalityControl.value) || _isNumberValue(cardinalityControl.value);
            cardinalityControl.setErrors(isValidCardinality ? null : {
                message: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.INVALID_CARDINALITY'
            });
        }
        const isValidElementVariable = !_isNumberValue(elementControl.value);
        elementControl.setErrors(isValidElementVariable ? null : {
            message: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.INVALID_ELEMENT_VARIABLE'
        });
    }

}
