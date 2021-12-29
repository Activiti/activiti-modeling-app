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

import { ChangeDetectorRef, Component, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityProperty, JSONSchemaInfoBasics } from '../../../api/types';
import { primitive_types } from '../../../helpers/primitive-types';
import { ModelingJSONSchemaService } from '../../../services/modeling-json-schema.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../services/registered-inputs-modeling-json-schema-provider.service';
import { PropertyTypeItem } from '../property-type-item/models';

@Component({
    selector: 'modelingsdk-property-type-selector-smart',
    templateUrl: './property-type-selector.smart-component.html',
    styleUrls: ['./property-type-selector.smart-component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PropertyTypeSelectorSmartComponent), multi: true }
    ]
})
export class PropertyTypeSelectorSmartComponent implements ControlValueAccessor, OnChanges, OnDestroy {

    @Output() change = new EventEmitter();
    @Input() property: EntityProperty;
    @Input() disabled: boolean;
    @Input() automationId = 'ama-property-type-selector';
    @Input() onlyPrimitiveTypes = false;

    placeholder: string;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    displayedValue = null;
    displayedCustomIcon = false;
    displayedIcon = null;

    hierarchy: PropertyTypeItem[];
    private initialHierarchy: PropertyTypeItem[];

    private readonly modeledPrimitiveTypes = ['json', 'array'];

    private onDestroy$: Subject<boolean> = new Subject<boolean>();

    _onChange: any = () => { };
    _onTouched: any = () => { };

    constructor(
        private modelingJSONSchemaService: ModelingJSONSchemaService,
        private cdr: ChangeDetectorRef
    ) {
        this.modelingJSONSchemaService.getPropertyTypeItems().pipe(takeUntil(this.onDestroy$)).subscribe(items => {
            this.initialHierarchy = items;

            if (this.initialHierarchy) {
                this.initHierarchy();
            }
            if (this.property) {
                this.hierarchy.some(child => this.initSelectedValue(child));
            }
        });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['property'] && changes['property'].currentValue !== changes['property'].previousValue && this.property) {
            this.hierarchy.some(child => this.initSelectedValue(child));
        }

        if (changes['onlyPrimitiveTypes'] && changes['onlyPrimitiveTypes'].currentValue !== changes['onlyPrimitiveTypes'].previousValue && this.initialHierarchy) {
            this.initHierarchy();
        }
    }

    onSelectionChanges($event: PropertyTypeItem) {
        this.displayedValue = $event.displayName;
        this.displayedCustomIcon = $event.isCustomIcon;
        this.displayedIcon = $event.iconName;
        this.trigger.closeMenu();

        this.updatePropertyModel($event);

        this.change.emit(this.property);
    }

    writeValue(property: EntityProperty): void {
        this.property = property;
        if (this.property && this.hierarchy) {
            this.hierarchy.some(child => this.initSelectedValue(child));
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private initHierarchy() {
        this.hierarchy = this.initialHierarchy.slice();
        if (this.onlyPrimitiveTypes) {
            const registeredInputsProviderItem = this.hierarchy.find(item => item.provider === RegisteredInputsModelingJsonSchemaProvider.PROVIDER_NAME);
            if (registeredInputsProviderItem) {
                registeredInputsProviderItem.children = registeredInputsProviderItem.children.filter(item => primitive_types.find(element => element === item.displayName));
            }
        }
    }

    private initSelectedValue(item: PropertyTypeItem): boolean {
        let result = false;
        this.clearInput();
        if (item.children && item.children.length) {
            result = item.children.some(child => this.initSelectedValue(child));
        } else {
            if (this.compareObjects(this.property, item.value)) {
                this.displayedValue = item.displayName;
                this.displayedCustomIcon = item.isCustomIcon;
                this.displayedIcon = item.iconName;
                result = true;
            }
        }
        this.cdr.detectChanges();
        return result;
    }

    private compareObjects(property: EntityProperty, value: JSONSchemaInfoBasics): boolean {
        const primitive = this.modeledPrimitiveTypes.find(type => property.type === type);
        if (primitive) {
            try {
                return JSON.stringify(property.model) === JSON.stringify(value);
            } catch (error) {
                return false;
            }
        } else {
            return value.$ref === ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH + '/' + property.type;
        }
    }

    @HostListener('keydown', ['$event']) onKeyDown(event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            this.clearSelection();
        } else {
            this.trigger.openMenu();
        }
        return false;
    }

    @HostListener('paste', ['$event']) onPaste(event: Event) {
        return false;
    }

    private clearInput() {
        this.displayedValue = null;
        this.displayedIcon = null;
        this.displayedCustomIcon = false;
    }

    private clearSelection() {
        delete this.property.type;
        delete this.property.model;
        this.clearInput();
        this.change.emit(this.property);
    }

    private updatePropertyModel($event: PropertyTypeItem) {
        if ($event.value.$ref && $event.value.$ref.startsWith(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH)) {
            const parts = $event.value.$ref.split('/');
            this.property.type = parts[parts.length - 1];
        } else {
            this.property.type = 'json';
        }
        this.property.model = $event.value;
    }
}
