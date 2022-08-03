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
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { VariableSelectorComponent } from '../variable-selector/variable-selector.component';
import { MappingVariableExpressionDropdownComponent } from './mapping-variable-expression-dropdown.component';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { expectedVariables } from '../../../mocks/process-editor.mock';
import { UuidService } from '../../../services/uuid.service';
import { ExpressionsEditorService } from '../../../variables/expression-code-editor/services/expressions-editor.service';
import { VariablesModule } from '../../../variables/variables.module';
import { ElementVariable, ExpressionSyntax, MappingType } from '../../../api/types';
import { ExpressionCodeEditorDialogComponent } from '../../../variables/expression-code-editor/components/expression-code-editor-dialog/expression-code-editor-dialog.component';
import { VariableExpressionLanguagePipe } from '../../../variables/properties-viewer/variable-expression-language.pipe';

describe('MappingVariableExpressionDropdownComponent', () => {

    let fixture: ComponentFixture<MappingVariableExpressionDropdownComponent>;
    let component: MappingVariableExpressionDropdownComponent;
    let vars: ElementVariable[];
    let dialogService: DialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DialogService,
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: UuidService,
                    useValue: {
                        generate: () => 'generated-uuid'
                    }
                },
                {
                    provide: ExpressionsEditorService,
                    useValue: {
                        initExpressionEditor: jest.fn(),
                        colorizeElement: jest.fn(),
                    }
                },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(() => of('vs-light'))
                    }
                },
                VariableExpressionLanguagePipe
            ],
            imports: [
                CommonModule,
                CoreModule.forChild(),
                OverlayModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                VariablesModule
            ],
            declarations: [VariableSelectorComponent, MappingVariableExpressionDropdownComponent]
        });
        dialogService = TestBed.inject(DialogService);
        vars = [];
        expectedVariables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));

        fixture = TestBed.createComponent(MappingVariableExpressionDropdownComponent);
        component = fixture.componentInstance;
        component.variables = expectedVariables;
        component.ngOnInit();
        fixture.detectChanges();
    });

    describe('variable selection', () => {
        it('should display the selected variable name in the dropdown input at start', () => {
            component.mapping = {
                type: MappingType.variable,
                value: vars[0].name
            };
            component.ngOnInit();
            fixture.detectChanges();

            const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input input'));

            expect(dropdown.nativeElement.value).toBe(vars[0].name);
        });

        it('should display the variable selector when clicking on the select and there is no mapping', async () => {
            component.mapping = null;
            component.ngOnInit();
            fixture.detectChanges();

            const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input'));

            dropdown.nativeElement.click();

            fixture.detectChanges();
            await fixture.whenStable();
            const variablesPanel = fixture.debugElement.query(By.css('modelingsdk-variable-selector'));

            expect(variablesPanel).not.toBeNull();
        });

        it('should display the variable selector when clicking on the select and the mapping type is variable', async () => {
            component.mapping = {
                type: MappingType.variable,
                value: vars[0].name
            };
            component.ngOnInit();
            fixture.detectChanges();

            const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input'));

            dropdown.nativeElement.click();

            fixture.detectChanges();
            await fixture.whenStable();
            const variablesPanel = fixture.debugElement.query(By.css('modelingsdk-variable-selector'));

            expect(variablesPanel).not.toBeNull();
        });

        it('should emit the mapping with selected variable, close the panel and display the variable name in the input', () => {
            spyOn(component.mappingChanged, 'emit');
            component.panelDisplay = true;
            component.expression = 'this is an ${expression}';

            component.onVariableSelected(vars[0]);
            const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input input'));

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.variable,
                value: vars[0].name
            });
            expect(component.panelDisplay).toBe(false);
            expect(dropdown.nativeElement.value).toBe(vars[0].name);
            expect(component.expression).toBe('');
        });

        it('should emit the value mapping with expression, close the panel and display the expression in the input when variable name is an expression', () => {
            spyOn(component.mappingChanged, 'emit');
            component.panelDisplay = true;
            component.expression = 'this is an ${expression}';

            component.onVariableSelected({
                id: 'variable-id',
                name: '${radioButton.id}',
                type: 'string'
            });
            const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input input'));

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.value,
                value: '${radioButton.id}'
            });
            expect(component.panelDisplay).toBe(false);
            expect(dropdown.nativeElement.value).toBe('${radioButton.id}');
            expect(component.expression).toBe('${radioButton.id}');
            expect(component.selectedVariableId).toBe(null);
            expect(component.selectedVariableName).toBe('');
            expect(component.displayedValue).toBe('${radioButton.id}');
        });

        it('should switch from expression to variables when strikethrough dollar button is clicked', async () => {
            component.mapping = {
                type: MappingType.value,
                value: ''
            };
            component.ngOnInit();
            fixture.detectChanges();

            const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input'));
            dropdown.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            const button = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-panel-title-button.switch'));
            button.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
            const variablesPanel = fixture.debugElement.query(By.css('modelingsdk-variable-selector'));

            expect(variablesPanel).not.toBeNull();
        });
    });

    describe('expression', () => {
        it('should display the expression editor dialog when clicking on the dollar button', async () => {
            spyOn(dialogService, 'openDialog');

            component.mapping = {
                type: MappingType.variable,
                value: vars[0].name
            };
            component.ngOnInit();
            fixture.detectChanges();

            const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input'));
            dropdown.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            const button = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-panel-title-button.expression'));
            button.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(dialogService.openDialog).toHaveBeenCalledWith(ExpressionCodeEditorDialogComponent, {
                disableClose: true,
                height: '450px',
                width: '1000px',
                data: {
                    expression: '',
                    language: null,
                    removeEnclosingBrackets: false,
                    variables: jasmine.any(Array),
                    nonBracketedOutput: false,
                    expressionUpdate$: jasmine.any(Object),
                    expressionSyntax: ExpressionSyntax.JUEL
                }
            });
        });

        it('should create expression from string value', () => {
            component.mapping = {
                type: MappingType.value,
                value: 'this is a string'
            };
            component.ngOnInit();

            expect(component.mode).toBe('expression');
            expect(component.expression).toBe('this is a string');
            expect(component.displayedValue).toBe('this is a string');
        });

        it('should create expression from integer value', () => {
            component.mapping = {
                type: MappingType.value,
                value: 10
            };
            component.ngOnInit();

            expect(component.mode).toBe('expression');
            expect(component.expression).toBe('10');
            expect(component.displayedValue).toBe('10');
        });

        it('should create expression from boolean value', () => {
            component.mapping = {
                type: MappingType.value,
                value: true
            };
            component.ngOnInit();

            expect(component.mode).toBe('expression');
            expect(component.expression).toBe('true');
            expect(component.displayedValue).toBe('true');
        });

        it('should create expression from array', () => {
            component.mapping = {
                type: MappingType.value,
                value: [1, 2, 3]
            };
            component.ngOnInit();

            expect(component.mode).toBe('expression');
            expect(component.expression).toBe(`[
    1,
    2,
    3
]`
            );
            expect(component.displayedValue).toBe(`[
    1,
    2,
    3
]`
            );
        });

        it('should create expression from json', () => {
            component.mapping = {
                type: MappingType.value,
                value: { a: 'b', c: 1, d: '${true}' }
            };
            component.ngOnInit();

            expect(component.mode).toBe('expression');
            expect(component.expression).toBe(`{
    "a": "b",
    "c": 1,
    "d": "\${true}"
}`
            );
            expect(component.displayedValue).toBe(`{
    "a": "b",
    "c": 1,
    "d": "\${true}"
}`
            );
        });

        it('should create expression from expression', () => {
            component.mapping = {
                type: MappingType.value,
                value: 'this is an ${expression}'
            };
            component.ngOnInit();

            expect(component.mode).toBe('expression');
            expect(component.expression).toBe('this is an ${expression}');
            expect(component.displayedValue).toBe('this is an ${expression}');
        });

        it('should emit mapping when expression changes', () => {
            spyOn(component.mappingChanged, 'emit');
            component.panelDisplay = true;
            component.selectedVariableId = vars[0].id;
            component.selectedVariableName = vars[0].name;
            component.displayedValue = vars[0].name;

            component.onExpressionChanges('this is an ${expression}');
            const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input input'));

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.value,
                value: 'this is an ${expression}'
            });
            expect(component.panelDisplay).toBe(false);
            expect(dropdown.nativeElement.value).toBe('this is an ${expression}');
            expect(component.selectedVariableId).toBe(null);
            expect(component.selectedVariableName).toBe('');
            expect(component.displayedValue).toBe('this is an ${expression}');
        });

        it('should emit mapping with string value when editor changes', () => {
            spyOn(component.mappingChanged, 'emit');

            component.onExpressionChanges('this is a string');

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.value,
                value: 'this is a string'
            });
        });

        it('should emit mapping with integer value when editor changes', () => {
            spyOn(component.mappingChanged, 'emit');

            component.onExpressionChanges('10');

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.value,
                value: 10
            });
        });

        it('should emit mapping with boolean value when editor changes', () => {
            spyOn(component.mappingChanged, 'emit');

            component.onExpressionChanges('true');

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.value,
                value: true
            });
        });

        it('should emit mapping with array value when editor changes', () => {
            spyOn(component.mappingChanged, 'emit');

            component.onExpressionChanges('[1,2,3]');

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.value,
                value: [1, 2, 3]
            });
        });

        it('should emit mapping with json value when editor changes', () => {
            spyOn(component.mappingChanged, 'emit');
            component.typeFilter = ['json'];
            component.ngOnInit();

            component.onExpressionChanges('{"a": "b","c": 1,"d": "${true}"}');

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.value,
                value: { a: 'b', c: 1, d: '${true}' }
            });
        });

        it('should emit mapping with null value when editor expression is empty', () => {
            spyOn(component.mappingChanged, 'emit');
            component.ngOnInit();

            component.onExpressionChanges('');

            expect(component.mappingChanged.emit).toHaveBeenCalledWith({
                type: MappingType.value,
                value: null
            });
        });
    });

    it('should display no variable message when there are no available variables and there is no mapped value', async () => {
        component.variables = [];
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();

        const noVariableMessage = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-no-process-properties-msg'));

        expect(noVariableMessage).not.toBeNull();
    });

    it('should not display no variable message when there are no available variables but there is a mapped value', async () => {
        component.variables = [];
        component.mapping = {
            type: MappingType.value,
            value: '${abcd}'
        };
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();

        const noVariableMessage = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-no-process-properties-msg'));

        expect(noVariableMessage).toBeNull();
    });

    it('should not display no variable message when there are no available variables but there is a mapped value and the value is false', async () => {
        component.variables = [];
        component.mapping = {
            type: MappingType.value,
            value: false
        };
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();

        const noVariableMessage = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-no-process-properties-msg'));

        expect(noVariableMessage).toBeNull();
    });

    it('should not display the clear selection button when no variable is selected', async () => {
        component.mapping = null;
        component.required = false;
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();

        const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input'));

        dropdown.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const clearButton = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-panel-title-button'));
        expect(clearButton).toBeNull();
    });

    it('should not display the clear selection button when required', async () => {
        component.mapping = {
            type: MappingType.variable,
            value: 'uno'
        };
        component.required = true;
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();

        const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input'));

        dropdown.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const clearButton = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-panel-title-button'));
        expect(clearButton).toBeNull();
    });

    it('should display the clear selection button when variable is selected and not required', async () => {
        component.mapping = {
            type: MappingType.variable,
            value: 'uno'
        };
        component.required = false;
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();

        const dropdown = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-input'));

        dropdown.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const clearButton = fixture.debugElement.query(By.css('.modelingsdk-mapping-variable-expression-dropdown-panel-title-button.clear'));
        expect(clearButton).not.toBeNull();
    });
});
