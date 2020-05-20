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
    forwardRef,
    SimpleChanges,
    Inject,
    Type
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { INPUT_TYPE_ITEM_HANDLER, InputTypeItem } from './value-type-inputs/value-type-inputs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PropertiesViewerJsonInputComponent } from './value-type-inputs/json-input.component';

@Component({
    template: '<template #valueTypeInput></template>',
    selector: 'modelingsdk-value-type-input',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ValueTypeInputComponent), multi: true }
    ]
})

export class ValueTypeInputComponent implements OnDestroy, OnChanges, ControlValueAccessor {
    onDestroy$: Subject<void> = new Subject<void>();

    @Input() value = null;
    @Input() index: number;
    // tslint:disable-next-line
    @Output() onChange = new EventEmitter();
    @Input() type: string;
    @Input() disabled = false;
    @Input() extendedProperties = null;
    @Input() required = false;
    @Input() placeholder: string;

    @ViewChild('valueTypeInput', { read: ViewContainerRef }) valueTypeInput;
    valueTypeInputRef: ComponentRef<any>;

    _onChange: any = () => { };

    constructor(private resolver: ComponentFactoryResolver,
        @Inject(INPUT_TYPE_ITEM_HANDLER) private inputTypeItemHandler: InputTypeItem[]) { }

    setInputValue(value) {
        this.value = value;
        this.valueTypeInputRef.instance.value = this.value;
        this._onChange(value);
        this.onChange.emit(this.value);
    }

    ngOnChanges(changes: SimpleChanges) {

        if (!changes.value && changes.type && changes.type.previousValue !== changes.type.currentValue) {
            this.value = null;
        }

        if (changes.index && !changes.value) {
            this.value = null;
        } else if (!changes.value && this.valueTypeInputRef.instance.value) {
            this.value = this.valueTypeInputRef.instance.value;
        }

        if (changes.type) {
            this.valueTypeInput.clear();
            const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(this.getInputItemImplementationClass(this.type));
            this.valueTypeInputRef = this.valueTypeInput.createComponent(factory);
            this.valueTypeInputRef.instance.change.pipe(takeUntil(this.onDestroy$)).subscribe(inputValue => this.setInputValue(inputValue));
        }

        this.valueTypeInputRef.instance.disabled = this.disabled;
        this.valueTypeInputRef.instance.placeholder = this.placeholder;
        this.valueTypeInputRef.instance.extendedProperties = this.extendedProperties;
        this.writeValue(this.value);
    }

    private getInputItemImplementationClass(type: string): Type<{}> {
        for (const handler of this.inputTypeItemHandler) {
            if (handler.type === type) {
                return handler.implementationClass;
            }
        }
        return PropertiesViewerJsonInputComponent;
    }

    writeValue(value) {
        if (value !== undefined && value !== null) {
            if (this.type === 'json' && typeof (value) === 'object') {
                value = JSON.stringify(value, null, 4);
            }
            if (value !== this.valueTypeInputRef.instance.value && this.valueTypeInputRef.instance.ngOnChanges) {
                this.valueTypeInputRef.instance.value = value;
                this.valueTypeInputRef.instance.ngOnChanges(value);
            } else {
                this.valueTypeInputRef.instance.value = value;
            }
        }
    }

    registerOnChange(fn) {
        this._onChange = fn;
    }

    registerOnTouched() { }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.valueTypeInputRef.destroy();
    }

}
