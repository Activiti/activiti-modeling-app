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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ElementVariable, ProcessEditorElementVariable } from '../../../api/types';
import { ModelingJSONSchemaService } from '../../../services/modeling-json-schema.service';

@Component({
    selector: 'modelingsdk-variable-selector',
    templateUrl: './variable-selector.component.html',
    styleUrls: ['./variable-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VariableSelectorComponent implements OnInit, OnChanges {

    @Input()
    variables: ProcessEditorElementVariable[];

    @Input()
    varIdSelected: string;

    @Input()
    typeFilter: string[] | string;

    @Input()
    tooltipOffsetX = -230;

    @Input()
    tooltipOffsetY = 33;

    @Input()
    filterExpressionVariables = false;

    @Input()
    displayClearButton = false;

    @Output()
    variableSelected = new EventEmitter<ElementVariable>();

    search = '';

    filteredVars: ProcessEditorElementVariable[];
    private readonly EXPRESSION_REGEX = /\${([^]*)}/gm;

    constructor(
        private modelingJSONSchemaService: ModelingJSONSchemaService
    ) { }

    ngOnInit(): void {
        if (this.varIdSelected && this.variables?.length > 0) {
            let vars: ElementVariable[] = [];
            this.variables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));
            this.search = vars.find(variable => variable.id === this.varIdSelected)?.name || null;
        }
        this.filteredVars = this.getFilteredVariables();
    }

    ngOnChanges(): void {
        this.filteredVars = this.getFilteredVariables();
    }

    onSearch() {
        this.filteredVars = this.getFilteredVariables();
    }

    clearSearch() {
        this.search = '';
        this.onSearch();
    }

    onVariableSelect(variable: ElementVariable) {
        this.variableSelected.emit(variable);
    }

    clearSelection() {
        this.varIdSelected = null;
        this.clearSearch();
        this.onVariableSelect(null);
    }

    private getFilteredVariables() {
        let filteredExpressionVariables = [];
        if (this.filterExpressionVariables) {
            this.variables.forEach(element => {
                const elementVariables = element.variables.filter(variable => !variable.name.match(this.EXPRESSION_REGEX));
                if (elementVariables.length > 0) {
                    filteredExpressionVariables.push({
                        source: element.source,
                        variables: elementVariables
                    });
                }
            });
        } else {
            filteredExpressionVariables = [...this.variables];
        }

        const vars: ProcessEditorElementVariable[] = [];
        filteredExpressionVariables.forEach(element => {
            vars.push({
                source: element.source,
                variables: this.filterBySearchAndType(element.variables)
            });
        });
        return vars.filter(variable => variable.variables.length > 0);
    }

    private filterBySearchAndType(variables: ElementVariable[]): ElementVariable[] {
        const vars = [];
        variables.forEach(variable => {
            if (
                !variable.onlyForExpression &&
                (!this.search || this.search.trim().length === 0 || variable.name.includes(this.search.trim())) &&
                (!this.typeFilter || this.modelingJSONSchemaService.variableMatchesTypeFilter(variable, this.typeFilter))
            ) {
                vars.push({ ...variable });
            }
        });
        return vars;
    }
}
