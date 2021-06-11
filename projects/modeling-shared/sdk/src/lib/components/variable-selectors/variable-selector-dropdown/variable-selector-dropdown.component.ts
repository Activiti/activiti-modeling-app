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

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ElementVariable, ProcessEditorElementVariable } from '../../../services/process-editor-element-variables-provider.service';

@Component({
    selector: 'modelingsdk-variable-selector-dropdown',
    templateUrl: './variable-selector-dropdown.component.html'
})
export class VariableSelectorDropdownComponent implements OnInit, AfterViewInit {

    @Input()
    variables: ProcessEditorElementVariable[];

    @Input()
    varIdSelected: string;

    @Input()
    typeFilter: string;

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

    @Output()
    variableSelected = new EventEmitter<ElementVariable>();

    @ViewChild('dropdown')
    dropdown: ElementRef;

    selectedVariableName = '';
    variablesPanelDisplay = false;
    variablesPanelWidth = 0;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        if (this.varIdSelected) {
            let vars: ElementVariable[] = [];
            this.variables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));
            this.selectedVariableName = vars.find(variable => variable.id === this.varIdSelected)?.name || '';
        }
    }

    ngAfterViewInit(): void {
        this.variablesPanelWidth = this.dropdown.nativeElement.offsetWidth - 24;
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
        this.selectedVariableName = variable?.name || '';
        this.varIdSelected = variable.id;
        this.closePanel();
        this.variableSelected.emit(variable);
    }
}
