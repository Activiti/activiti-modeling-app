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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ExpressionSyntax, MappingType, ProcessEditorElementWithVariables, ServiceParameterMapping } from '../../api/types';
import { OutputMappingTableComponent } from './output-mapping-table.component';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { OutputMappingTableModule } from './output-mapping-table.module';
import { MatDialog } from '@angular/material/dialog';
import { CoreModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { selectSelectedTheme } from '../../store/app.selectors';
import { mockDropDownFields, mockDropDownProcessVariable, mockValueMapping } from './output-mapping-table.component.mock';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS } from '../../services/process-editor-element-variables-provider.service';
import { ProcessEditorElementVariablesService } from '../../services/process-editor-element-variables.service';
import { VariableMappingType } from '../../services/mapping-dialog.service';
import { MappingDialogComponent } from '../mapping-dialog/mapping-dialog.component';

describe('OutputMappingTableComponent', () => {
    let fixture: ComponentFixture<OutputMappingTableComponent>;
    let component: OutputMappingTableComponent;
    let dialogService: DialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forChild(),
                OutputMappingTableModule,
                NoopAnimationsModule,
                FormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
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
                { provide: PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS, useValue: [] },
                ProcessEditorElementVariablesService
            ], schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        dialogService = TestBed.inject(DialogService);
        fixture = TestBed.createComponent(OutputMappingTableComponent);
        component = fixture.componentInstance;
        component.parameters = [{
            id: 'id1',
            name: 'name',
            description: 'desc',
            type: 'string'
        }, {
            id: 'idToFilter',
            name: 'variables.filterMe',
            description: 'this is the parameter that needs to be filtered',
            type: 'string'
        }];
        component.processProperties = [
            {
                source: {
                    name: 'Process',
                    type: ProcessEditorElementWithVariables.Process
                },
                variables: [
                    {
                        id: '1',
                        name: 'var1',
                        type: 'string'
                    },
                    {
                        id: '2',
                        name: 'var2',
                        type: 'date'
                    },
                    {
                        id: 'stringVarId',
                        name: 'stringVar',
                        type: 'string'
                    }
                ]
            }
        ];
        component.mapping = {};

        component.ngOnChanges();
        fixture.detectChanges();
    });

    it('should emit the correct data when a property value is set', () => {
        spyOn(component.update, 'emit');

        component.changeSelection(component.processProperties[0].variables[1], 0, component.parameters[0]);

        const data: ServiceParameterMapping = {
            [component.processProperties[0].variables[1].name]: {
                type: MappingType.variable,
                value: component.parameters[0].name
            }
        };
        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should emit the correct data when a property value is reset', () => {
        component.mapping = {
            [component.processProperties[0].variables[0].name]: {
                type: MappingType.variable,
                value: component.parameters[0].name
            }
        };
        component.ngOnChanges();
        fixture.detectChanges();

        spyOn(component.update, 'emit');

        component.changeSelection(component.processProperties[0].variables[1], 0, component.parameters[0]);

        const data = {
            [component.processProperties[0].variables[1].name]: {
                type: MappingType.variable,
                value: component.parameters[0].name
            }
        };

        expect(component.update.emit).toHaveBeenCalledWith(data);
    });

    it('should filter the form variables labeled as variables. in the name', () => {
        const select = fixture.debugElement.queryAll(By.css('mat-table .mat-row'));
        const spanLabel = fixture.debugElement.query(By.css('mat-table .mat-row .mat-column-name > span > span'));
        expect(select).not.toBeNull();
        expect(select.length).toBe(1);
        expect(spanLabel.nativeElement.textContent.trim()).toBe('name');
    });

    it('should update the value if mapping type is expression', () => {
        component.parameters.concat(mockDropDownFields);
        component.processProperties = [
            {
                source: {
                    name: 'Process',
                    type: ProcessEditorElementWithVariables.Process
                },
                variables: mockDropDownProcessVariable
            }
        ];
        component.mapping = mockValueMapping;

        component.ngOnChanges();
        fixture.detectChanges();
        expect(component.data).toEqual(mockValueMapping);

        component.changeSelection(mockDropDownProcessVariable[0], 0, mockDropDownFields[0]);
        let updatedMapping: ServiceParameterMapping = {
            ...mockValueMapping,
            'dId': {
                type: MappingType.value,
                value: '${Dropdown009gay.id}'
            }
        };

        component.changeSelection(mockDropDownProcessVariable[4], 0, mockDropDownFields[4]);
        updatedMapping = {
            ...updatedMapping,
            'text': {
                type: MappingType.variable,
                value: 'Text0yru6p'
            }
        };
        expect(component.data).toEqual(updatedMapping);
    });

    it('should display an icon help for each parameter', () => {
        component.ngOnChanges();
        fixture.detectChanges();
        const icon = fixture.debugElement.query(By.css('.ama-help-icon'));
        expect(icon).toBeDefined();
        expect(icon.nativeElement).toBeDefined();
    });

    it('should init selected variables', () => {
        component.processProperties = [
            {
                source: {
                    name: 'Process',
                    type: ProcessEditorElementWithVariables.Process
                },
                variables: mockDropDownProcessVariable
            }
        ];
        component.mapping = mockValueMapping;

        component.ngOnChanges();

        expect(component.selectedVariablesArray).toEqual([undefined, '2beb4fd9-dd04-4413-993b-1c102b88e60d', '87a99fda-ff12-4ec4-a516-27415e7bd2d0']);
    });

    it('should use JUEL expression syntax by default', () => {
        spyOn(dialogService, 'openDialog');
        const data = {
            mappingType: VariableMappingType.output,
            outputMapping: component.mapping,
            outputParameters: component.parameters,
            editorVariables: component.processProperties,
            selectedProcessVariable: undefined,
            selectedOutputParameter: component.tableParameters[0].name,
            outputMappingUpdate$: jasmine.any(Subject),
            expressionSyntax: ExpressionSyntax.JUEL
        };

        const expectedData = {
            disableClose: true,
            height: '530px',
            width: '1000px',
            data
        };

        component.edit(0);

        expect(component.expressionSyntax).toEqual(ExpressionSyntax.JUEL);
        expect(dialogService.openDialog).toHaveBeenCalledWith(MappingDialogComponent, expectedData);
    });
});
