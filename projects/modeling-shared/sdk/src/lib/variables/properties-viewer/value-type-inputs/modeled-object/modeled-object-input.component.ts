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

    constructor(private formBuilder: FormBuilder, private jsonService: JSONSchemaToEntityPropertyService) { }

    ngOnChanges(): void {
        if (!this.valueInit) {
            if (Array.isArray(this.model)) {
                this.primitiveType = 'array';
            } else if (typeof this.model === 'object') {
                this.primitiveType = this.jsonService.getPrimitiveType(this.model);
            } else {
                this.primitiveType = 'string';
            }
            if (!this.primitiveType) {
                this.init();
            }
            this.valueInit = !!this.value;
        }
    }

    init(): void {
        this.inputs = this.jsonService.getEntityPropertiesFromJSONSchema(this.model);
        this.buildForm();
        this.valid.emit(this.objectForm.valid);
    }

    buildForm(): void {
        const group = {};
        if (this.model) {
            this.inputs.forEach(input => {
                group[input.name] = [
                    {
                        value: this.value && this.value[input.name] ? this.value[input.name] : input.value,
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

    primitiveTypeChanges(value: any) {
        this.value = value;
        this.valueChanges.emit(this.value);
    }

    updateValues() {
        this.objectForm.valueChanges.subscribe(() => {
            if (this.objectForm.valid) {
                this.value = this.objectForm.value;
                this.valueChanges.emit(this.value);
            } else {
                this.valueChanges.emit(null);
            }
            this.valid.emit(this.objectForm.valid);
        });
    }
}
