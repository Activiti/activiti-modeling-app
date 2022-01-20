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

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ElementVariable, ProcessEditorElementVariable } from '../../../api/types';
import { ModelingJSONSchemaService } from '../../../services/modeling-json-schema.service';

@Component({
    selector: 'modelingsdk-variable-selector-dropdown',
    templateUrl: './variable-selector-dropdown.component.html',
    styleUrls: ['./variable-selector-dropdown.component.scss']
})
export class VariableSelectorDropdownComponent implements OnInit, AfterViewInit, OnChanges {

    @Input()
    variables: ProcessEditorElementVariable[];

    @Input()
    varIdSelected: string;

    @Input()
    typeFilter: string[];

    @Input()
    placeholder: string;

    @Input()
    offsetX = 0;

    @Input()
    offsetY = 0;

    @Input()
    tooltipOffsetX = -230;

    @Input()
    tooltipOffsetY = 33;

    @Input()
    plain = true;

    @Input()
    variablesPanelHeight = 200;

    @Input()
    variablesPanelWidth: number;

    @Input()
    variablesTitle = 'SDK.VARIABLE_EXPRESSION.TITLE.VARIABLES';

    @Input()
    noVariablePlaceholder = 'SDK.VARIABLE_MAPPING.NO_PROCESS_PROPERTIES';

    @Input()
    filterExpressionVariables = false;

    @Input()
    required = false;

    @Output()
    variableSelected = new EventEmitter<ElementVariable>();

    @ViewChild('dropdown')
    dropdown: ElementRef;

    selectedVariableName = '';
    variablesPanelDisplay = false;
    availableVariables = true;

    constructor(
        private cdr: ChangeDetectorRef,
        private modelingJSONSchemaService: ModelingJSONSchemaService
    ) { }

    ngOnInit(): void {
        this.init();
    }

    ngOnChanges(): void {
        this.init();
    }

    private init() {
        let vars: ElementVariable[] = [];
        this.variables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));

        if (this.varIdSelected) {
            const selectedVariable = vars.find(variable => variable.id === this.varIdSelected);
            this.selectedVariableName = selectedVariable?.label || selectedVariable?.name || '';
        }

        if (this.typeFilter) {
            this.availableVariables = vars.filter(variable => this.modelingJSONSchemaService.variableMatchesTypeFilter(variable, this.typeFilter)).length > 0;
        } else {
            this.availableVariables = vars.length > 0;
        }
    }

    ngAfterViewInit(): void {
        if (!this.variablesPanelWidth) {
            this.variablesPanelWidth = this.dropdown.nativeElement.offsetWidth - 24;
        }
    }

    openPanel() {
        this.variablesPanelDisplay = true;
        this.cdr.detectChanges();
    }

    closePanel() {
        this.variablesPanelDisplay = false;
        this.cdr.detectChanges();
    }

    onVariableSelected(variable: ElementVariable) {
        this.selectedVariableName = variable?.label || variable?.name || '';
        this.varIdSelected = variable.id;
        this.closePanel();
        this.variableSelected.emit(variable);
    }

    clearSelection() {
        this.selectedVariableName = '';
        this.varIdSelected = null;
        this.closePanel();
        this.variableSelected.emit(null);
    }

    displayValue(): boolean {
        return this.availableVariables || this.selectedVariableName?.length > 0;
    }
}
