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

import {
    Component,
    Output,
    EventEmitter,
    Input,
    ViewContainerRef,
    ViewChild,
    ComponentRef,
    ComponentFactory,
    OnDestroy,
    ComponentFactoryResolver,
    OnChanges,
    forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { valueTypeInputsMapping } from './value-type-inputs/value-type-inputs.mapping';


@Component({
    template: '<template #valueTypeInput></template>',
    selector: 'amasdk-value-type-input',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ValueTypeInputComponent), multi: true }
      ]
})

export class ValueTypeInputComponent implements OnDestroy, OnChanges, ControlValueAccessor {

    @Input() value = null;
    @Input() index: number;
    @Output() change = new EventEmitter();
    @Input() type: string;

    @ViewChild('valueTypeInput', { read: ViewContainerRef }) valueTypeInput;
    valueTypeInputRef: ComponentRef<any>;

    _onChange: any = () => {};

    constructor(private resolver: ComponentFactoryResolver) {}

    setInputValue(value) {
        this.value = value;
        this.valueTypeInputRef.instance.value = this.value;
        this._onChange(value);
        this.change.emit(this.value);
    }

    ngOnChanges(changes) {
        if (changes.type && changes.type.previousValue !== changes.type.currentValue) {
            this.value = null;
        }

        this.valueTypeInput.clear();
        const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(valueTypeInputsMapping[this.type]);

        this.valueTypeInputRef = this.valueTypeInput.createComponent(factory);
        this.valueTypeInputRef.instance.value = this.value;
        this.valueTypeInputRef.instance.change.subscribe(inputValue => this.setInputValue(inputValue));
    }

    writeValue(value) {
        if (value !== undefined && value !== null) {
            this.setInputValue(value);
        }
    }

    registerOnChange(fn) {
        this._onChange = fn;
    }

    registerOnTouched() {}

    ngOnDestroy() {
        this.valueTypeInputRef.destroy();
    }

}
