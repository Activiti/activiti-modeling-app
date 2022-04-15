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

import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { EntityProperty, ExpressionSyntax } from '../../../../api/types';
import { ExpressionSimulatorService } from '../../services/expression-simulator.service';

@Component({
    selector: 'modelingsdk-expression-simulator',
    templateUrl: './expression-simulator.component.html',
    styleUrls: ['./expression-simulator.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ExpressionSimulatorComponent implements OnInit, OnDestroy {

    @Input()
    expression = '';

    @Input()
    variables: EntityProperty[] = [];

    @Input()
    removeEnclosingBrackets = false;

    @Input()
    expressionSyntax: ExpressionSyntax = ExpressionSyntax.JUEL;

    @ViewChild(MatMenuTrigger)
    trigger: MatMenuTrigger;

    search = '';
    filteredVars: EntityProperty[];
    variablesToSimulate: EntityProperty[] = [];
    collapsiblePanelStatus: boolean[] = [];
    result: any;
    subscription: Subscription;
    loading = false;
    simulation = false;

    private readonly expressionRegex = /^\${([^]*)}$/m;

    constructor(private service: ExpressionSimulatorService) { }

    ngOnInit(): void {
        this.filteredVars = [...this.variables];
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    onSearch() {
        this.resetFilteredVars();
        this.filteredVars = this.filteredVars.filter(variable => (!this.search || this.search.trim().length === 0 || variable.name.includes(this.search.trim())));
    }

    clearSearch() {
        this.search = '';
        this.resetFilteredVars();
    }

    private resetFilteredVars() {
        this.filteredVars = [...this.variables].filter(variable => this.variablesToSimulate.findIndex(element => element.id === variable.id) === -1);
    }

    doNotCloseMenu($event: Event): boolean {
        $event.stopPropagation();
        return false;
    }

    onVariableSelect(variable: EntityProperty) {
        this.variablesToSimulate.push({ ...variable });
        this.collapsiblePanelStatus.push(true);
        this.trigger.closeMenu();
        this.clearSearch();
        this.resetSimulation();
    }

    deleteVariableToSimulate(i: number) {
        this.variablesToSimulate.splice(i, 1);
        this.collapsiblePanelStatus.splice(i, 1);
        this.resetFilteredVars();
        this.resetSimulation();
    }

    executeSimulation() {
        const variables = {};
        this.variablesToSimulate.forEach(variable => variables[variable.name] = variable.value);

        this.loading = true;
        this.subscription = this.service.getSimulationResult(this.getExpressionBracketedIfNeeded(this.expression), variables, this.expressionSyntax).pipe(first())
            .subscribe(
                (result) => {
                    this.result = (result !== null && result !== undefined) ? JSON.stringify(result, null, 4) : 'null';
                    this.loading = false;
                    this.simulation = true;
                },
                () => {
                    this.loading = false;
                    this.resetSimulation();
                }
            );
    }

    variableChanges(i: number, value: any) {
        this.variablesToSimulate[i].value = value;
        this.resetSimulation();
    }

    resetSimulation() {
        this.result = null;
        this.simulation = false;
    }

    trackByVariableId(_: number, obj: EntityProperty): string {
        return obj.id;
    }

    private getExpressionBracketedIfNeeded(expression: string): string {
        const exp = expression ? expression.trim() : expression;
        if (this.removeEnclosingBrackets && !exp.match(this.expressionRegex)) {
            return `\${${exp}}`;
        } else {
            return exp;
        }
    }
}
