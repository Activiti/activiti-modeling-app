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

import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService, CardViewSelectItemOption } from '@alfresco/adf-core';
import { MultiInstanceItemModel } from './multi-instance.item.model';
import { getMultiInstanceType, MultiInstanceProps, MultiInstanceType } from '../../bpmn-js/property-handlers/multi-instance.handler';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { _isNumberValue } from '@angular/cdk/coercion';
import { CardViewMultiInstanceItemService } from './multi-instance-item.service';

@Component({
    selector: 'ama-multi-instance-item',
    templateUrl: './multi-instance-item.component.html',
    styleUrls: ['./multi-instance-item.component.scss'],
    providers: [ CardViewMultiInstanceItemService ]
})
export class CardViewMultiInstanceItemComponent implements OnInit {
    @Input() property: MultiInstanceItemModel;

    options$: Observable<CardViewSelectItemOption<string>[]>;
    selectedType: MultiInstanceType;
    form: FormGroup;

    constructor(
        private appConfigService: AppConfigService,
        private multiInstanceItemService: CardViewMultiInstanceItemService,
        private formBuilder: FormBuilder) {
        this.options$ = of(this.appConfigService.get('process-modeler.multi-instance-types'));
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

    ngOnInit() {
        this.selectedType = getMultiInstanceType(this.element[MultiInstanceProps.loopCharacteristics]);
        this.form = this.formBuilder.group({
            cardinality: [ this.parseCardinality(), [ Validators.required, this.validateExpression ] ],
            completionCondition: [ this.parseCompletionCondition(), [ Validators.pattern(/{([^}]+)}/) ] ],
        });
        this.multiInstanceItemService.element = this.element;
    }

    onTypeChange(selection: MultiInstanceType) {
        switch (selection) {
            case MultiInstanceType.parallel:
            case MultiInstanceType.sequence:
                this.multiInstanceItemService.createOrUpdateMultiInstanceElement(selection);
                break;
            case MultiInstanceType.none:
                delete this.element[MultiInstanceProps.loopCharacteristics];
                this.form.reset();
                break;
        }
        this.multiInstanceItemService.updateEditor();
    }

    onCardinalityChange(expression: string) {
        this.multiInstanceItemService.createOrUpdateCardinality(expression);
    }

    onCompletionConditionChange(expression: string) {
        this.multiInstanceItemService.createOrUpdateCompleteCondition(expression);
    }

    parseCardinality(): string {
        return this.parseMultiInstanceProperty(MultiInstanceProps.loopCardinality);
    }

    parseCompletionCondition(): string {
        return this.parseMultiInstanceProperty(MultiInstanceProps.completionCondition);
    }

    private parseMultiInstanceProperty(props: MultiInstanceProps) {
        return (
            this.element[MultiInstanceProps.loopCharacteristics] &&
            this.element[MultiInstanceProps.loopCharacteristics][props] &&
            this.element[MultiInstanceProps.loopCharacteristics][props]['body']
        );
    }

    validateExpression({ value }: FormControl) {
        const expression: RegExp = /{([^}]+)}/;
        const isValid: boolean = expression.test(value) || _isNumberValue(value);

        return (isValid) ? null : {
            message: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.INVALID_CARDINALITY'
        };
    }

}
