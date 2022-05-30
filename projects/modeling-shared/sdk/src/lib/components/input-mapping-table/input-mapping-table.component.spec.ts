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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConnectorParameter, ExpressionSyntax, MappingType, ProcessEditorElementWithVariables } from '../../api/types';
import { InputMappingTableComponent } from './input-mapping-table.component';
import { InputMappingTableModule } from './input-mapping-table.module';
import { CoreModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { selectSelectedTheme } from '../../store/app.selectors';
import { of, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { PropertiesViewerStringInputComponent, INPUT_TYPE_ITEM_HANDLER } from '../../variables/public-api';
import { TranslateModule } from '@ngx-translate/core';
import { ExpressionsEditorService } from '../../variables/expression-code-editor/services/expressions-editor.service';
import { UuidService } from '../../services/uuid.service';
import { provideModelingJsonSchemaProvider } from '../../services/modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../services/registered-inputs-modeling-json-schema-provider.service';
import { VariableMappingType } from '../../services/mapping-dialog.service';
import { MappingDialogComponent } from '../mapping-dialog/mapping-dialog.component';

describe('InputMappingTableComponent', () => {
    let fixture: ComponentFixture<InputMappingTableComponent>;
    let component: InputMappingTableComponent;
    let uuidService: UuidService;
    let expressionsEditorService: ExpressionsEditorService;
    let dialogService: DialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forChild(),
                InputMappingTableModule,
                NoopAnimationsModule,
                FormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                UuidService,
                ExpressionsEditorService,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(selector => {
                            if (selector === selectSelectedTheme) {
                                return of('vs-light');
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                DialogService,
                MatDialog,
                { provide: INPUT_TYPE_ITEM_HANDLER, useValue: { type: 'string', implementationClass: PropertiesViewerStringInputComponent }, multi: true },
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider)
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        uuidService = TestBed.inject(UuidService);
        spyOn(uuidService, 'generate').and.returnValue('generated-uuid');
        expressionsEditorService = TestBed.inject(ExpressionsEditorService);
        dialogService = TestBed.inject(DialogService);
        spyOn(expressionsEditorService, 'initExpressionEditor');
        fixture = TestBed.createComponent(InputMappingTableComponent);
        component = fixture.componentInstance;
        component.parameters = [{
            id: 'id1',
            name: 'name',
            description: 'desc',
            required: false,
            type: 'string'
        }];
        component.processProperties = [
            {
                source: {
                    name: 'Process',
                    type: ProcessEditorElementWithVariables.Process
                },
                variables: [{
                    id: '1',
                    name: 'var1',
                    type: 'string',
                },
                {
                    id: '2',
                    name: 'var2',
                    type: 'date',
                }]
            }
        ];
        component.mapping = {};

        component.ngOnChanges();
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should emit the correct data when a property value is set to a variable', () => {
        spyOn(component.update, 'emit');

        component.selectVariable(
            {
                type: MappingType.variable,
                value: component.processProperties[0].variables[0].name
            },
            component.parameters[0]
        );

        const data = {
            ...component.data, [component.parameters[0].name]: {
                type: MappingType.variable,
                value: component.processProperties[0].variables[0].name
            }
        };
        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should emit the correct data when a required property variable is reset', () => {
        spyOn(component.update, 'emit');
        component.parameters[0].required = true;
        component.mapping = {
            'name': {
                type: MappingType.variable,
                value: 'var1'
            }
        };
        component.ngOnChanges();
        fixture.detectChanges();

        component.selectVariable(
            null,
            component.parameters[0]
        );

        const data = {
            'name': {
                type: MappingType.variable,
                value: null
            }
        };
        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should emit the correct data when a NON-required property variable is reset', () => {
        spyOn(component.update, 'emit');
        component.parameters[0].required = false;
        component.mapping = {
            'name': {
                type: MappingType.variable,
                value: 'var1'
            }
        };
        component.ngOnChanges();
        fixture.detectChanges();

        component.selectVariable(
            null,
            component.parameters[0]
        );

        const data = {};
        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should display the process selector if parameter\'s type is process and is value mapping', () => {
        component.parameters[0].type = 'process';
        component.parameters[0].required = false;
        component.mappingTypes[component.parameters[0].name] = MappingType.value;
        component.ngOnChanges();
        fixture.detectChanges();

        const processSelector = fixture.debugElement.query(By.css('.selector-process-input-mapping'));
        expect(processSelector).not.toBeNull();
    });

    it('should not display the process selector if parameter\'s type is process and is variable mapping and has value', () => {
        component.parameters[0].type = 'process';
        component.parameters[0].required = false;
        component.mappingTypes[component.parameters[0].name] = MappingType.variable;
        component.values[component.parameters[0].name] = 'test';
        component.ngOnChanges();
        fixture.detectChanges();

        const processSelector = fixture.debugElement.query(By.css('.selector-process-input-mapping'));
        expect(processSelector).toBeNull();
    });

    it('should display the process selector if parameter\'s type is process and is variable mapping and has not value', () => {
        component.parameters[0].type = 'process';
        component.parameters[0].required = false;
        component.mappingTypes[component.parameters[0].name] = MappingType.variable;
        component.values[component.parameters[0].name] = undefined;
        component.ngOnChanges();
        fixture.detectChanges();

        const processSelector = fixture.debugElement.query(By.css('.selector-process-input-mapping'));
        expect(processSelector).not.toBeNull();
    });

    it('should display an icon help for each parameter', () => {
        component.ngOnChanges();
        fixture.detectChanges();
        const icon = fixture.debugElement.query(By.css('.ama-help-icon'));
        expect(icon).toBeDefined();
        expect(icon.nativeElement).toBeDefined();
    });

    it('should reset to default mapping `variable` type when no value', () => {
        component.parameters = [{ name: 'test', type: 'string' }] as ConnectorParameter[];
        component.mapping[component.parameters[0].name] = { type: MappingType.value, value: 'bogus' };

        component.ngOnChanges();
        expect(component.mappingTypes[component.parameters[0].name]).toBe(MappingType.value);

        component.mapping[component.parameters[0].name].value = null;
        component.ngOnChanges();
        expect(component.mappingTypes[component.parameters[0].name]).toBe(MappingType.variable);
    });

    it('should open the edit dialog', () => {
        spyOn(dialogService, 'openDialog');

        component.edit(0);

        expect(dialogService.openDialog).toHaveBeenCalledWith(MappingDialogComponent, {
            data: {
                editorVariables: [
                    {
                        source: {
                            name: 'Process',
                            type: ProcessEditorElementWithVariables.Process
                        },
                        variables: [{
                            id: '1',
                            name: 'var1',
                            type: 'string',
                        },
                        {
                            id: '2',
                            name: 'var2',
                            type: 'date',
                        }]
                    }
                ],
                enableValueSelection: true,
                enableVariableSelection: true,
                expressionSyntax: ExpressionSyntax.JUEL,
                extensionObject: {
                    editDialogKeyHeader: 'SDK.VARIABLE_MAPPING.PARAMETER',
                    editDialogValueHeader: 'SDK.VARIABLE_MAPPING.PROCESS_VARIABLE'
                },
                inputMapping: {},
                inputMappingUpdate$: jasmine.any(Subject),
                inputParameters: [
                    {
                        description: 'desc',
                        id: 'id1',
                        name: 'name',
                        required: false,
                        type: 'string'
                    }
                ],
                mappingType: VariableMappingType.input,
                selectedRow: 0
            },
            disableClose: true,
            height: '530px',
            width: '1000px'
        });
    });

    it('should display NONE as placeholder in modeling-sdk-variable-selector when variable selection is disabled', async () => {
        component.enableVariableSelection = false;
        component.ngOnChanges();
        fixture.detectChanges();
        await fixture.whenStable();

        const variableSelector: HTMLElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="variable-selector-id1"]');

        expect(variableSelector.textContent).toEqual('SDK.VARIABLE_MAPPING.NONE');
    });
});
