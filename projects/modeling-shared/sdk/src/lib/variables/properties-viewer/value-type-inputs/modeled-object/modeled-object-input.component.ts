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

import { Component, Output, EventEmitter, Input, ViewEncapsulation, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementVariable, EntityProperty, JSONSchemaInfoBasics } from '../../../../api/types';
import { JSONSchemaToEntityPropertyService } from '../../../../services/json-schema-to-entity-property.service';

@Component({
    selector: 'modelingsdk-modeled-object-input',
    templateUrl: './modeled-object-input.component.html',
    styleUrls: ['./modeled-object-input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PropertiesViewerModeledObjectInputComponent implements OnChanges {

    // tslint:disable-next-line
    @Output() valueChanges: EventEmitter<any> = new EventEmitter();
    @Output() valid: EventEmitter<boolean> = new EventEmitter();
    @Input() value: any;
    @Input() disabled: boolean;
    @Input() model: JSONSchemaInfoBasics;
    @Input() autocompletionContext: ElementVariable[] = [];
    @Input() placeholder: string;

    inputs: EntityProperty[] = [];
    valueInit = false;
    primitiveType = null;

    objectForm: FormGroup;

    private oldModel = null;
    private oldValue = null;
    private subscription: Subscription = null;

    constructor(private formBuilder: FormBuilder, private jsonService: JSONSchemaToEntityPropertyService) { }

    ngOnChanges(): void {
        const modelChanged = !this.objectEquals(this.oldModel, this.model);
        const valueChanges = !!this.value && !this.objectEquals(this.oldValue, this.value);

        this.oldModel = this.model;
        this.oldValue = this.value;

        if (modelChanged || valueChanges) {
            this.primitiveType = this.jsonService.getPrimitiveType(this.model || { type: 'string' });
            this.inputs = this.jsonService.getEntityPropertiesFromJSONSchema(this.model).filter(input => !!input);
        }

        if (modelChanged) {
            this.init();
        }

        if (valueChanges) {
            this.subscription.unsubscribe();
            this.setValues();
            this.updateValues();
        }

    }

    primitiveTypeChanges(value: any) {
        this.value = value;
        this.valueChanges.emit(this.value);
    }

    private objectEquals(obj1: any, obj2: any): boolean {
        try {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        } catch (error) {
            return obj1 === obj2;
        }
    }

    private init(): void {
        this.buildForm();
        this.valid.emit(this.objectForm.valid);
    }

    private setValues(): void {
        this.inputs.forEach(input => this.objectForm?.get(input.name)?.setValue(this.getCurrentValueFromInput(input)));
    }

    private buildForm(): void {
        const group = {};
        if (this.model) {
            this.inputs.forEach(input => {
                group[input.name] = [
                    {
                        value: this.getCurrentValueFromInput(input),
                        disabled: this.disabled || input.readOnly || false
                    }
                ];
                if (input.required) {
                    group[input.name].push(Validators.required);
                }
            });
        }
        this.objectForm = this.formBuilder.group(group);
        this.updateValues();
    }

    private getCurrentValueFromInput(input: EntityProperty): any {
        return this.value && this.value[input.name] ? this.value[input.name] : input.value;
    }

    private updateValues() {
        this.subscription = this.objectForm.valueChanges.subscribe(() => {
            if (this.objectForm.valid) {
                this.value = this.objectForm.value;
                this.oldValue = this.value;
                this.valueChanges.emit(this.value);
            } else {
                this.valueChanges.emit(null);
            }
            this.valid.emit(this.objectForm.valid);
        });
    }
}
