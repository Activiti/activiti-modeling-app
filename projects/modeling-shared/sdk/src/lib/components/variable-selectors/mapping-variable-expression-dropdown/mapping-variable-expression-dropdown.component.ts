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

import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ElementVariable, ExpressionSyntax, MappingType, ProcessEditorElementVariable } from '../../../api/types';
import { ExpressionCodeEditorDialogComponent } from '../../../variables/expression-code-editor/components/expression-code-editor-dialog/expression-code-editor-dialog.component';
import { ModelingJSONSchemaService } from '../../../services/modeling-json-schema.service';
import { VariableExpressionLanguagePipe } from '../../../variables/properties-viewer/variable-expression-language.pipe';

@Component({
    selector: 'modelingsdk-mapping-variable-expression-dropdown',
    templateUrl: './mapping-variable-expression-dropdown.component.html',
    styleUrls: ['./mapping-variable-expression-dropdown.component.scss']
})
export class MappingVariableExpressionDropdownComponent implements OnInit, AfterViewInit, OnChanges {

    @Input()
    variables: ProcessEditorElementVariable[];

    @Input()
    mapping: {
        type: MappingType;
        value: any;
    };

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
    panelHeight = 200;

    @Input()
    panelWidth: number;

    @Input()
    expressionSyntax: ExpressionSyntax = ExpressionSyntax.JUEL;

    @Input()
    variablesTitle = 'SDK.VARIABLE_EXPRESSION.TITLE.VARIABLES';

    @Input()
    switchToVariablesSelectorTitle = 'SDK.VARIABLE_EXPRESSION.TITLE.SWITCH_TO_VARIABLES';

    @Input()
    noVariablePlaceholder = 'SDK.VARIABLE_MAPPING.NO_PROCESS_PROPERTIES';

    @Input()
    filterExpressionVariables = false;

    @Input()
    expressionEditorVariables: ElementVariable[];

    @Input()
    required = false;

    @Input()
    disabled = false;

    @Output()
    mappingChanged = new EventEmitter<{
        type: MappingType;
        value: any;
    }>();

    @ViewChild('dropdown')
    dropdown: ElementRef;

    mode: 'variables' | 'expression';
    selectedVariableName: string;
    displayedValue: string;
    selectedVariableId: string;
    expression: string;
    panelDisplay: boolean;
    vars: ElementVariable[];
    availableVariables: boolean;
    language: string;

    private readonly EXPRESSION_REGEX = /\${([^]*)}/gm;

    constructor(
        private cdr: ChangeDetectorRef,
        private dialogService: DialogService,
        private expressionLanguagePipe: VariableExpressionLanguagePipe,
        private modelingJSONSchemaService: ModelingJSONSchemaService
    ) { }

    ngOnInit(): void {
        this.init();
    }

    ngOnChanges(): void {
        this.init();
    }

    private init() {
        this.mode = 'variables';
        this.selectedVariableName = '';
        this.displayedValue = '';
        this.selectedVariableId = null;
        this.expression = '';
        this.panelDisplay = false;
        this.vars = [];
        this.availableVariables = true;

        this.variables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => this.vars = this.vars.concat(element.variables));

        if (!this.expressionEditorVariables) {
            this.expressionEditorVariables = this.vars;
        }

        this.language = this.expressionLanguagePipe.transform(this.typeFilter);

        if (this.mapping) {
            if (!this.mapping.type || this.mapping.type === MappingType.variable) {
                this.mode = 'variables';
                this.selectedVariableName = this.mapping.value || '';
                const variable = this.vars.find(elementVariable => elementVariable.name === this.selectedVariableName);
                this.selectedVariableId = variable?.name;
                this.displayedValue = variable?.label || this.selectedVariableName;
            } else {
                this.mode = 'expression';
                if (this.mapping.value !== null && this.mapping.value !== undefined) {
                    if (typeof this.mapping.value === 'string' && this.language !== 'json') {
                        this.expression = this.mapping.value;
                    } else {
                        try {
                            this.expression = JSON.stringify(this.mapping.value, null, 4);
                        } catch (error) {
                            this.expression = `${this.mapping.value}`;
                        }
                    }
                }
                this.displayedValue = this.expression;
            }
        }
        if (this.typeFilter) {
            this.availableVariables = this.vars.filter(variable => this.modelingJSONSchemaService.variableMatchesTypeFilter(variable, this.typeFilter)).length > 0;
        } else {
            this.availableVariables = this.vars.length > 0;
        }
    }

    ngAfterViewInit(): void {
        if (!this.panelWidth) {
            this.panelWidth = this.dropdown.nativeElement.offsetWidth - 24;
        }
    }

    openPanel() {
        if (!this.disabled) {
            this.panelDisplay = true;
            this.cdr.detectChanges();
        }
    }

    detachPanel() {
        this.init();
        this.panelDisplay = false;
        this.cdr.detectChanges();
    }

    closePanel() {
        this.mappingChanged.emit(this.mapping);
        this.panelDisplay = false;
        this.cdr.detectChanges();
    }

    onVariableSelected(variable: ElementVariable) {
        this.selectedVariableName = variable?.name || '';
        this.displayedValue = variable?.label || this.selectedVariableName;
        this.selectedVariableId = variable?.id;

        if (this.selectedVariableName.match(this.EXPRESSION_REGEX)) {
            this.mapping = {
                type: MappingType.value,
                value: this.selectedVariableName
            };
            this.expression = this.selectedVariableName;
            this.displayedValue = this.expression;
            this.mode = 'expression';
            this.selectedVariableId = null;
            this.selectedVariableName = '';
        } else {
            this.mapping = {
                type: MappingType.variable,
                value: this.selectedVariableName
            };
            this.expression = '';
        }
        this.closePanel();
    }

    switchToVariables() {
        this.mode = 'variables';
        this.cdr.detectChanges();
    }

    openExpressionEditor() {
        const expressionUpdate$ = new Subject<string>();

        const dialogData = {
            expression: this.expression,
            language: this.language,
            removeEnclosingBrackets: false,
            variables: this.filterExpressionVariables ?
                this.expressionEditorVariables.filter(variable => !variable.name.match(this.EXPRESSION_REGEX)) :
                this.expressionEditorVariables,
            nonBracketedOutput: false,
            expressionUpdate$: expressionUpdate$,
            expressionSyntax: this.expressionSyntax
        };

        this.dialogService.openDialog(ExpressionCodeEditorDialogComponent, {
            disableClose: true,
            height: '450px',
            width: '1000px',
            data: dialogData,
        });

        expressionUpdate$.subscribe(data => {
            this.onExpressionChanges(data);
        });
    }

    onExpressionChanges(data: string) {
        this.expression = data;
        let value = data?.trim().length > 0 ? data.trim() : null;
        if (data) {
            if (!data.match(this.EXPRESSION_REGEX) || this.language === 'json') {
                try {
                    value = JSON.parse(data);
                } catch (error) { }
            }
        }
        this.mode = 'expression';
        this.mapping = {
            type: MappingType.value,
            value
        };
        this.displayedValue = this.expression;
        this.selectedVariableId = null;
        this.selectedVariableName = '';
        this.closePanel();
    }

    clearSelection() {
        this.selectedVariableName = '';
        this.displayedValue = '';
        this.selectedVariableId = null;
        this.expression = '';
        this.mode = 'variables';
        this.mapping = null;
        this.closePanel();
    }

    displayValue(): boolean {
        return this.availableVariables || this.displayedValue?.length > 0;
    }
}
