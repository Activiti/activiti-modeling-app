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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { MappingDialogComponent } from './mapping-dialog.component';
import { MappingDialogData, MappingValueType, VariableMappingType } from '../../services/mapping-dialog.service';
import { ExpressionSyntax, MappingType } from '../../api/types';
import { MODELING_JSON_SCHEMA_PROVIDERS, UuidService } from '../../services/public-api';
import { InputMappingDialogService } from '../../services/input-mapping-dialog.service';
import { OutputMappingDialogService } from '../../services/output-mapping-dialog.service';
import {
    PropertiesViewerStringInputComponent,
    PropertiesViewerDateInputComponent,
    PropertiesViewerDateTimeInputComponent,
    PropertiesViewerIntegerInputComponent,
    PropertiesViewerBooleanInputComponent,
    InputTypeItem,
    VariableValuePipe,
    INPUT_TYPE_ITEM_HANDLER
} from '../../variables/public-api';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ExpressionsEditorService } from '../../variables/expression-code-editor/services/expressions-editor.service';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VariableExpressionLanguagePipe } from '../../variables/properties-viewer/variable-expression-language.pipe';
import { VariableIdFromVariableNamePipe } from '../variable-selectors/variable-id-from-variable-name.pipe';
import { VariablePrimitiveTypePipe } from '../../variables/properties-viewer/variable-primitive-type.pipe';
import { MappingDialogSelectedTabPipe } from './mapping-dialog-selected-tab.pipe';
import { MappingDialogSavePipe } from './mapping-dialog-save.pipe';

describe('MappingDialogComponent', () => {
    let fixture: ComponentFixture<MappingDialogComponent>;
    let element: DebugElement;
    let component: MappingDialogComponent;

    const inputTypes: InputTypeItem[] = [
        { type: 'string', implementationClass: PropertiesViewerStringInputComponent, primitiveType: 'string' },
        { type: 'date', implementationClass: PropertiesViewerDateInputComponent, primitiveType: 'date' },
        { type: 'datetime', implementationClass: PropertiesViewerDateTimeInputComponent, primitiveType: 'datetime' },
        { type: 'integer', implementationClass: PropertiesViewerIntegerInputComponent, primitiveType: 'integer' },
        { type: 'boolean', implementationClass: PropertiesViewerBooleanInputComponent, primitiveType: 'boolean' }
    ];

    const inputMappingDialogService: InputMappingDialogService = new InputMappingDialogService(inputTypes);
    const outputMappingDialogService: OutputMappingDialogService = new OutputMappingDialogService(inputTypes);

    const helpIconText = 'help';

    const mockDialogDataInputMapping: MappingDialogData = {
        mappingType: VariableMappingType.input,
        inputMapping: {
            checkid: { type: MappingType.variable, value: 'booleanVar' },
            dateid: { type: MappingType.variable, value: 'dateVar' },
            datetimeid: { type: MappingType.variable, value: 'datetimeVar' },
            numberid: { type: MappingType.variable, value: 'integerVar' },
            textexp: { type: MappingType.value, value: '${textExpression}' },
            textid: { type: MappingType.variable, value: 'stringVar' },
            textval: { type: MappingType.value, value: 'textValue' }
        },
        inputParameters: [
            { id: 'checkid', label: 'Label Checkbox', name: 'checkid', type: 'boolean', description: 'Label Checkbox' },
            { id: 'dateid', label: 'Label Date', name: 'dateid', type: 'date', description: 'Label Date' },
            { id: 'datetimeid', label: '', name: 'datetimeid', type: 'datetime', description: 'Label DateTime' },
            { id: 'numberid', label: 'Label Number', name: 'numberid', type: 'integer', description: 'Label Number' },
            { id: 'textval', label: '', name: 'textval', type: 'string', description: '' },
            { id: 'textid', label: 'Label Text', name: 'textid', type: 'string', description: 'Label Text' },
            { id: 'textexp', label: '', name: 'textexp', type: 'string', description: '' }
        ],
        editorVariables: [
            {
                source: {
                    name: 'process'
                },
                variables: [
                    { id: '1e6da084-63bf-4f2a-8003-bd0969f461e9', name: 'datetimeVar', type: 'datetime' },
                    { id: 'a9af83ae-5fd2-4547-8d9a-122d9edf96a2', name: 'stringVar', type: 'string' },
                    { id: '8046efe8-c58d-42af-8958-dd9a9048c72b', name: 'integerVar', type: 'integer' },
                    { id: '7d073289-abd9-40d8-9124-e7b10cdd218f', name: 'dateVar', type: 'date' },
                    { id: 'a3ec58eb-d30b-4764-8034-92f422e1de6c', name: 'booleanVar', type: 'boolean' },
                    { id: '97cba7e6-53af-409e-821b-5fe9697f77a9', name: 'stringValue', type: 'string' },
                    { id: '52e54d3e-1fbd-4440-b023-aff935a18aab', name: 'stringExpression', type: 'string' }
                ]
            }
        ],
        selectedRow: 0
    };

    const mockDialogDataInputMappingCustomHeaders: MappingDialogData = {
        ...mockDialogDataInputMapping,
        extensionObject: { editDialogKeyHeader: 'CUSTOM_KEY_HEADER', editDialogValueHeader: 'CUSTOM_VALUE_HEADER' }
    };

    const mockDialogDataOutputMapping: MappingDialogData = {
        mappingType: VariableMappingType.output,
        outputMapping: {
            stringVar: { type: MappingType.variable, value: 'textid' },
            booleanVar: { type: MappingType.variable, value: 'checkid' },
            datetimeVar: { type: MappingType.variable, value: 'datetimeid' },
            integerVar: { type: MappingType.variable, value: 'numberid' },
            dateVar: { type: MappingType.variable, value: 'dateid' }
        },
        outputParameters: [
            { id: 'checkid', label: 'Label Checkbox', name: 'checkid', type: 'boolean', description: 'Label Checkbox' },
            { id: 'dateid', label: 'Label Date', name: 'dateid', type: 'date', description: 'Label Date' },
            { id: 'datetimeid', label: '', name: 'datetimeid', type: 'datetime', description: 'Label DateTime' },
            { id: 'numberid', label: 'Label Number', name: 'numberid', type: 'integer', description: 'Label Number' },
            { id: 'textval', label: '', name: 'textval', type: 'string', description: '' },
            { id: 'textid', label: 'Label Text', name: 'textid', type: 'string', description: 'Label Text' },
            { id: 'textexp', label: '', name: 'textexp', type: 'string', description: '' }
        ],
        editorVariables: [
            {
                source: {
                    name: 'process'
                },
                variables: [
                    { id: '1e6da084-63bf-4f2a-8003-bd0969f461e9', name: 'datetimeVar', type: 'datetime' },
                    { id: 'a9af83ae-5fd2-4547-8d9a-122d9edf96a2', name: 'stringVar', type: 'string' },
                    { id: '8046efe8-c58d-42af-8958-dd9a9048c72b', name: 'integerVar', type: 'integer' },
                    { id: '7d073289-abd9-40d8-9124-e7b10cdd218f', name: 'dateVar', type: 'date' },
                    { id: 'a3ec58eb-d30b-4764-8034-92f422e1de6c', name: 'booleanVar', type: 'boolean' },
                    { id: '97cba7e6-53af-409e-821b-5fe9697f77a9', name: 'stringValue', type: 'string' },
                    { id: '52e54d3e-1fbd-4440-b023-aff935a18aab', name: 'stringExpression', type: 'string' },
                    { id: '52e54d3e-1fbd-4440-b023-aff935a18aac', name: 'notMappedProcessVariable1', type: 'string' },
                    { id: '52e54d3e-1fbd-4440-b023-aff935a18aad', name: 'notMappedProcessVariable2', type: 'datetime' },
                    { id: '52e54d3e-1fbd-4440-b023-aff935a18aae', name: 'notMappedProcessVariable3', type: 'integer' },
                    { id: '52e54d3e-1fbd-4440-b023-aff935a18aaf', name: 'notMappedProcessVariable4', type: 'date' },
                    { id: '52e54d3e-1fbd-4440-b023-aff935a18aag', name: 'notMappedProcessVariable5', type: 'boolean' }
                ]
            }
        ],
        selectedRow: 1,
        selectedProcessVariable: 'booleanVar'
    };

    const mockDialog = {
        close: jest.fn()
    };

    function setUpTestBed(customMockDialogData) {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                MatTableModule,
                MatSelectModule,
                NoopAnimationsModule
            ],
            declarations: [
                MappingDialogComponent,
                VariableValuePipe,
                VariableExpressionLanguagePipe,
                VariableIdFromVariableNamePipe,
                VariablePrimitiveTypePipe,
                MappingDialogSelectedTabPipe,
                MappingDialogSavePipe
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: customMockDialogData },
                { provide: TranslationService, useClass: TranslationMock },
                { provide: UuidService, useValue: { generate() { return 'generated-uuid'; } } },
                { provide: InputMappingDialogService, useValue: inputMappingDialogService },
                { provide: OutputMappingDialogService, useValue: outputMappingDialogService },
                {
                    provide: ExpressionsEditorService, useValue: {
                        initExpressionEditor: jest.fn()
                    }
                },
                { provide: MODELING_JSON_SCHEMA_PROVIDERS, useValue: [] },
                { provide: INPUT_TYPE_ITEM_HANDLER, useValue: [] }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(MappingDialogComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        component.ngOnInit();
        fixture.detectChanges();
    }

    describe('Display existing input mapping', () => {
        beforeEach(() => {
            setUpTestBed(mockDialogDataInputMapping);
        });

        it('should render input mapping table correctly', () => {
            const parameters = Object.values(mockDialogDataInputMapping.inputParameters).sort(fixture.componentInstance.sortByName);

            const rows = element.queryAll(By.css('div.ama-mapping-table-viewer mat-row'));
            expect(rows.length).toBe(parameters.length);

            for (let index = 0; index < rows.length; index++) {
                const parameter = parameters[index];
                const mapping = mockDialogDataInputMapping.inputMapping[parameter.id];

                const parameterContainer = element.query(By.css(`[data-automation-id=variable-name-cell-${index}]`));
                const iconContainer = element.query(By.css(`[data-automation-id=variable-icon-cell-${index}] mat-icon`));
                const variableValueContainer = element.query(By.css(`[data-automation-id=variable-value-cell-${index}] span`));
                const deleteButtonContainer = element.query(By.css(`[data-automation-id=delete-row-button-${index}]`));
                const iconHelp = fixture.debugElement.query(By.css('.ama-help-icon'));

                expect(parameterContainer.nativeElement.textContent.replace(helpIconText, '').trim())
                    .toBe(parameter.label && parameter.label !== '' ? parameter.label : parameter.name);

                expect(variableValueContainer.nativeElement.textContent.trim()).toBe(mapping.value);
                if (mapping.type === MappingType.variable) {
                    expect(variableValueContainer.nativeElement.className).toBe('variable-mapping');
                } else {
                    expect(variableValueContainer.nativeElement.className).toBe('ama-non-variable-mapping');
                }

                expect(iconHelp.nativeElement).toBeDefined();
                expect(iconContainer.nativeElement.textContent.trim()).toBe('arrow_backward');
                expect(deleteButtonContainer).toBeNull();
            }
        });

        it('should render input mapping table with default headers', () => {
            const headers = element.queryAll(By.css('div.ama-mapping-table-viewer mat-header-cell'));
            expect(headers).not.toBeNull();
            expect(headers.filter(header =>
                header.nativeElement.textContent.trim() === 'SDK.MAPPING_DIALOG.INPUT_PARAMETER').length).toBe(1);
            expect(headers.filter(header =>
                header.nativeElement.textContent.trim() === 'SDK.MAPPING_DIALOG.PROCESS_VARIABLE/SDK.MAPPING_DIALOG.VALUE_MAPPING').length).toBe(1);
        });
    });

    describe('Display custom table headers in input mapping', () => {

        beforeEach(() => {
            setUpTestBed(mockDialogDataInputMappingCustomHeaders);
        });

        it('should render input mapping table with custom headers', () => {
            const headers = element.queryAll(By.css('div.ama-mapping-table-viewer mat-header-cell'));
            expect(headers).not.toBeNull();
            expect(headers.filter(header =>
                header.nativeElement.textContent.trim() === 'CUSTOM_KEY_HEADER').length).toBe(1);
            expect(headers.filter(header =>
                header.nativeElement.textContent.trim() === 'CUSTOM_VALUE_HEADER/SDK.MAPPING_DIALOG.VALUE_MAPPING').length).toBe(1);
        });
    });

    describe('Display existing output mapping', () => {
        beforeEach(() => {
            setUpTestBed(mockDialogDataOutputMapping);
        });

        it('should render output mapping table correctly', () => {
            const outputMapping = Object.keys(mockDialogDataOutputMapping.outputMapping);

            const rows = element.queryAll(By.css('div.ama-mapping-table-viewer mat-row'));
            expect(rows.length).toBe(outputMapping.length);

            for (let index = 0; index < rows.length; index++) {
                const mappingKey = outputMapping[index];
                const mapping = mockDialogDataOutputMapping.outputMapping[mappingKey];

                const parameterContainer = element.query(By.css(`[data-automation-id=variable-name-cell-${index}]`));
                const iconContainer = element.query(By.css(`[data-automation-id=variable-icon-cell-${index}] mat-icon`));
                const variableValueContainer = element.query(By.css(`[data-automation-id=variable-value-cell-${index}] span`));
                const deleteButtonContainer = element.query(By.css(`[data-automation-id=delete-row-button-${index}]`));
                const iconHelp = fixture.debugElement.query(By.css('.ama-help-icon'));

                let parameter = '';
                if (mapping.type === MappingType.variable) {
                    const parameterFound = mockDialogDataOutputMapping.outputParameters.find(param => param.id === mapping.value);
                    parameter = parameterFound.label && parameterFound.label !== '' ? parameterFound.label : parameterFound.name;
                    expect(parameterContainer.classes['variable-mapping']).toBe(true);
                } else {
                    parameter = mapping.value;
                    expect(parameterContainer.classes['ama-non-variable-mapping']).toBe(true);
                }

                expect(iconHelp.nativeElement).toBeDefined();
                expect(parameterContainer.nativeElement.textContent.replace(helpIconText, '').trim()).toBe(parameter);
                expect(variableValueContainer.nativeElement.textContent.trim()).toBe(mappingKey);
                expect(variableValueContainer.nativeElement.className).toBe('variable-mapping');
                expect(iconContainer.nativeElement.textContent.trim()).toBe('arrow_forward');
                expect(deleteButtonContainer).toBeDefined();
            }
        });

        it('should display all the process variable except those  when creating a new entry', async () => {
            let processVariableSelector = element.query(By.css(`[data-automation-id="process-variable-destination-select"]>div`));
            processVariableSelector.nativeElement.click();
            fixture.detectChanges();
            let processVariablesAvailable = element.queryAll(By.css('.mat-option-text'));
            expect(processVariablesAvailable.length).toBe(2);
            expect(processVariablesAvailable[0].nativeElement.textContent.trim()).toBe('booleanVar');
            expect(processVariablesAvailable[1].nativeElement.textContent.trim()).toBe('notMappedProcessVariable5');
            const addButton = element.query(By.css(`[data-automation-id="add-variable-button"]`));
            addButton.nativeElement.click();
            fixture.detectChanges();
            processVariableSelector = element.query(By.css(`[data-automation-id="process-variable-destination-select"]`));
            processVariableSelector.nativeElement.click();
            fixture.detectChanges();
            processVariablesAvailable = element.queryAll(By.css('.mat-option-text'));
            const expectedProcessVariableSelectOptions = [
                'notMappedProcessVariable1',
                'notMappedProcessVariable2',
                'notMappedProcessVariable3',
                'notMappedProcessVariable4',
                'notMappedProcessVariable5',
                'stringExpression',
                'stringValue'
            ];
            expect(processVariablesAvailable.length).toBe(expectedProcessVariableSelectOptions.length);
            expectedProcessVariableSelectOptions.forEach((value, index) => {
                expect(processVariablesAvailable[index].nativeElement.textContent.trim()).toBe(value);
            });
        });
    });

    it('should emit null as value if the expression string is empty', async () => {
        setUpTestBed(mockDialogDataInputMapping);
        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        component.valueMappingExpressionChange('', 5);

        expect(component.dataSource[5].mappingValueType).toEqual(MappingValueType.expression);
        expect(component.dataSource[5].value).toEqual(null);
    });

    describe('Display tabs', () => {
        it('should display the process variable tab when it is enabled', async () => {
            setUpTestBed(mockDialogDataInputMapping);
            component.enableVariableSelection = true;

            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            const tab = fixture.debugElement.nativeElement.querySelector('[data-automation-id="process-variable-tab"]');

            expect(tab).toBeTruthy();
        });

        it('should display the value tab when it is enabled', async () => {
            setUpTestBed(mockDialogDataInputMapping);
            component.enableValueSelection = true;

            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            const tab = fixture.debugElement.nativeElement.querySelector('[data-automation-id="value-mapping-tab"]');

            expect(tab).toBeTruthy();
        });

        it('should display the expression tab when it has an expression language set', async () => {
            setUpTestBed(mockDialogDataInputMapping);
            component.data.expressionSyntax = ExpressionSyntax.JUEL;

            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            const tab = fixture.debugElement.nativeElement.querySelector('[data-automation-id="expression-mapping-tab"]');

            expect(tab).toBeTruthy();
        });
    });

    describe('Hide tabs', () => {
        it('should hide the process variable tab when it is not enabled', async () => {
            setUpTestBed(mockDialogDataInputMapping);
            component.enableVariableSelection = false;

            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            const tab = fixture.debugElement.nativeElement.querySelector('[data-automation-id="process-variable-tab"]');

            expect(tab).toBeFalsy();
        });

        it('should hide the value tab when it is not enabled', async () => {
            setUpTestBed(mockDialogDataInputMapping);
            component.enableValueSelection = false;

            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            const tab = fixture.debugElement.nativeElement.querySelector('[data-automation-id="value-mapping-tab"]');

            expect(tab).toBeFalsy();
        });

        it('should hide the expression tab when it has no expression language set', async () => {
            setUpTestBed(mockDialogDataInputMapping);
            component.data.expressionSyntax = ExpressionSyntax.NONE;

            component.ngOnInit();
            fixture.detectChanges();
            await fixture.whenStable();

            const tab = fixture.debugElement.nativeElement.querySelector('[data-automation-id="expression-mapping-tab"]');

            expect(tab).toBeFalsy();
        });
    });

    describe('Init tabs', () => {
        describe('variable tab', () => {
            beforeEach(() => {
                setUpTestBed(mockDialogDataInputMapping);
                component.selectedRow = 0;
            });

            it('should init to 0', () => {
                component.ngOnInit();
                expect(component.selectedTab).toEqual(0);
            });
        });

        describe('value tab', () => {
            beforeEach(() => {
                setUpTestBed(mockDialogDataInputMapping);
                component.selectedRow = 6;
            });

            it('should init to 1 when variables selection is enabled', () => {
                component.enableVariableSelection = true;
                component.ngOnInit();
                expect(component.selectedTab).toEqual(1);
            });

            it('should init to 0 when variables selection is disabled', () => {
                component.enableVariableSelection = false;
                component.ngOnInit();
                expect(component.selectedTab).toEqual(0);
            });
        });

        describe('expression tab', () => {
            beforeEach(() => {
                setUpTestBed(mockDialogDataInputMapping);
                component.selectedRow = 4;
            });

            it('should init to 2 when variables selection is enabled and value selection is enabled', () => {
                component.enableVariableSelection = true;
                component.enableValueSelection = true;
                component.ngOnInit();
                expect(component.selectedTab).toEqual(2);
            });

            it('should init to 1 when variables selection is enabled and value selection is disabled', () => {
                component.enableVariableSelection = true;
                component.enableValueSelection = false;
                component.ngOnInit();
                expect(component.selectedTab).toEqual(1);
            });

            it('should init to 1 when variables selection is disabled and value selection is enabled', () => {
                component.enableVariableSelection = false;
                component.enableValueSelection = true;
                component.ngOnInit();
                expect(component.selectedTab).toEqual(1);
            });

            it('should init to 0 when variables selection is disabled and value selection is disabled', () => {
                component.enableVariableSelection = false;
                component.enableValueSelection = false;
                component.ngOnInit();
                expect(component.selectedTab).toEqual(0);
            });
        });
    });
});
