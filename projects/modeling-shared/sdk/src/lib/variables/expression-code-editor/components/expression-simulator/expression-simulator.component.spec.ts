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

import { CoreModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { EntityProperty, ExpressionSyntax } from '../../../../api/types';
import { VariableIconPipe } from '../../pipes/variable-icon.pipe';
import { ExpressionSimulatorService } from '../../services/expression-simulator.service';
import { ExpressionSimulatorComponent } from './expression-simulator.component';

describe('ExpressionSimulatorComponent', () => {
    let component: ExpressionSimulatorComponent;
    let fixture: ComponentFixture<ExpressionSimulatorComponent>;
    let service: ExpressionSimulatorService;

    const expression = '${str.concat(int).concat(bool)}';

    const variables: EntityProperty[] = [
        {
            id: 'str',
            name: 'str',
            type: 'string'
        },
        {
            id: 'int',
            name: 'int',
            type: 'integer'
        },
        {
            id: 'bool',
            name: 'bool',
            type: 'boolean'
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                CoreModule.forChild(),
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            declarations: [
                ExpressionSimulatorComponent,
                VariableIconPipe
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: ExpressionSimulatorService,
                    useValue: {
                        getSimulationResult: jest.fn()
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(ExpressionSimulatorComponent);
        service = TestBed.inject(ExpressionSimulatorService);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.variables = [...variables];
        component.expression = expression;

        component.ngOnInit();
    });

    it('should initialize filtered variables', () => {
        expect(component.filteredVars).toEqual(variables);
    });

    describe('onSearch', () => {
        it('should not filter if search is empty', () => {
            component.search = null;
            component.onSearch();
            expect(component.filteredVars).toEqual(variables);

            component.search = undefined;
            component.onSearch();
            expect(component.filteredVars).toEqual(variables);

            component.search = '';
            component.onSearch();
            expect(component.filteredVars).toEqual(variables);
        });

        it('should filter by name containing', () => {
            component.search = 't';
            component.onSearch();
            expect(component.filteredVars).toEqual([variables[0], variables[1]]);
        });

        it('should search only in not already selected variables', () => {
            component.variablesToSimulate = [variables[1]];

            component.search = 't';
            component.onSearch();
            expect(component.filteredVars).toEqual([variables[0]]);
        });
    });

    describe('clearSearch', () => {
        it('should clear the search', () => {
            component.search = 't';
            component.onSearch();

            component.clearSearch();

            expect(component.search).toEqual('');
            expect(component.filteredVars).toEqual(variables);
        });

        it('should clear the search and set the filtered variables to those that are not already selected', () => {
            component.variablesToSimulate = [variables[2]];

            component.search = 't';
            component.onSearch();

            component.clearSearch();

            expect(component.search).toEqual('');
            expect(component.filteredVars).toEqual([variables[0], variables[1]]);
        });
    });

    it('onVariableSelect', () => {
        component.variablesToSimulate = [variables[2]];
        component.collapsiblePanelStatus = [false];
        spyOn(component.trigger, 'closeMenu');

        component.search = 't';
        component.onSearch();

        component.onVariableSelect(variables[0]);

        expect(component.search).toEqual('');
        expect(component.filteredVars).toEqual([variables[1]]);
        expect(component.variablesToSimulate).toEqual([variables[2], variables[0]]);
        expect(component.collapsiblePanelStatus).toEqual([false, true]);
        expect(component.trigger.closeMenu).toHaveBeenCalled();
    });

    it('deleteVariableToSimulate', () => {
        component.onVariableSelect(variables[0]);
        component.collapsiblePanelStatus[0] = true;
        component.onVariableSelect(variables[1]);
        component.collapsiblePanelStatus[1] = false;

        component.deleteVariableToSimulate(0);

        expect(component.filteredVars).toEqual([variables[0], variables[2]]);
        expect(component.variablesToSimulate).toEqual([variables[1]]);
        expect(component.collapsiblePanelStatus).toEqual([false]);
    });

    it('variableChanges', () => {
        component.onVariableSelect(variables[0]);

        component.simulation = true;
        component.variableChanges(0, '123456');

        expect(component.variablesToSimulate[0].value).toEqual('123456');
        expect(component.simulation).toEqual(false);
    });

    describe('simulation', () => {

        it('should display the simulation result on success', () => {
            spyOn(service, 'getSimulationResult').and.returnValue(of('myResult'));

            component.onVariableSelect(variables[0]);
            component.variableChanges(0, '123456');
            component.onVariableSelect(variables[1]);
            component.variableChanges(1, 123456);

            component.executeSimulation();
            getTestScheduler().flush();

            expect(service.getSimulationResult).toHaveBeenCalledWith(expression, { str: '123456', int: 123456 }, ExpressionSyntax.JUEL);
            expect(component.simulation).toBe(true);
            expect(component.result).toBe('"myResult"');
            expect(component.loading).toBe(false);
        });

        it('should display null string when simulation result is null', () => {
            spyOn(service, 'getSimulationResult').and.returnValue(of(null));

            component.executeSimulation();
            getTestScheduler().flush();

            expect(component.result).toBe('null');
        });

        it('should send bracketed expression when removeEnclosingBrackets', () => {
            const expressionNoBracketed = 'str.concat(int).concat(bool)';
            spyOn(service, 'getSimulationResult').and.returnValue(of(''));
            component.removeEnclosingBrackets = true;
            component.expression = expressionNoBracketed;

            component.executeSimulation();
            getTestScheduler().flush();

            expect(service.getSimulationResult).toHaveBeenCalledWith(`\${${expressionNoBracketed}}`, {}, ExpressionSyntax.JUEL);
        });

        it('should not display the simulation result on success', () => {
            spyOn(service, 'getSimulationResult').and.returnValue(throwError(Error('error')));

            component.executeSimulation();
            getTestScheduler().flush();

            expect(service.getSimulationResult).toHaveBeenCalledWith(expression, {}, ExpressionSyntax.JUEL);
            expect(component.simulation).toBe(false);
            expect(component.result).toBeNull();
            expect(component.loading).toBe(false);
        });

        it('should return false when the result is false', () => {
            spyOn(service, 'getSimulationResult').and.returnValue(of(false));

            component.executeSimulation();
            getTestScheduler().flush();

            expect(component.result).toBe('false');
        });
    });
});
