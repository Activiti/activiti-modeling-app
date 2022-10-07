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
import { By } from '@angular/platform-browser';
import { ExpressionSyntax, MappingType, ProcessEditorElementWithVariables, ServiceParameterMapping } from '../../api/types';
import { OutputMappingTableComponent } from './output-mapping-table.component';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { OutputMappingTableModule } from './output-mapping-table.module';
import { MatDialog } from '@angular/material/dialog';
import { CoreModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { selectSelectedTheme } from '../../store/app.selectors';
import { mockDropDownFields, mockDropDownProcessVariable, mockValueMapping } from './output-mapping-table.component.mock';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS } from '../../services/process-editor-element-variables-provider.service';
import { ProcessEditorElementVariablesService } from '../../services/process-editor-element-variables.service';
import { VariableMappingType } from '../../services/mapping-dialog.service';
import { MappingDialogComponent } from '../mapping-dialog/mapping-dialog.component';
import { provideMockStore } from '@ngrx/store/testing';
import { MatTooltip } from '@angular/material/tooltip';
import {
    mockOutputParameters,
    mockProcessVariables,
    mockSystemTaskAssigneeParameter
} from './mock/output-mapping.mock';

describe('OutputMappingTableComponent', () => {
    let fixture: ComponentFixture<OutputMappingTableComponent>;
    let component: OutputMappingTableComponent;
    let dialogService: DialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forChild(),
                OutputMappingTableModule,
                TranslateModule.forRoot()
            ],
            providers: [
                provideMockStore({
                   initialState: {},
                   selectors: [
                       { selector: selectSelectedTheme, value: 'vs-light'}
                   ]
                }),
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                DialogService,
                MatDialog,
                { provide: PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS, useValue: [] },
                ProcessEditorElementVariablesService
            ]
        });
    });

    beforeEach(() => {
        dialogService = TestBed.inject(DialogService);
        fixture = TestBed.createComponent(OutputMappingTableComponent);
        component = fixture.componentInstance;
        component.parameters = mockOutputParameters;
        component.processProperties = mockProcessVariables;
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

    it('should edit button be disabled for system output parameters', () => {
        component.parameters = [mockSystemTaskAssigneeParameter];
        component.ngOnChanges();
        fixture.detectChanges();
        const editButton = fixture.debugElement.query(By.css('[data-automation-id="edit-output-mapping-button-sys_task_assignee"]'));

        expect(editButton.nativeElement.disabled).toBeTruthy();
    });

    it('should display a tooltip in the edit icon that system output parameters are not editable', () => {
        component.parameters = [mockSystemTaskAssigneeParameter];
        component.ngOnChanges();
        fixture.detectChanges();

        const editIcon = fixture.debugElement.query(By.css('[data-automation-id="edit-output-mapping-icon-sys_task_assignee"]'));
        const tooltip = editIcon.injector.get(MatTooltip);

        expect(tooltip.disabled).toEqual(false);
        expect(tooltip.message).toEqual('SDK.VARIABLE_MAPPING.NOT_EDITABLE');
    });

    it('should not display a tooltip for non system output parameters in the edit icon', () => {
        component.parameters = [mockDropDownFields[0]];
        component.ngOnChanges();
        fixture.detectChanges();

        const editIcon = fixture.debugElement.query(By.css('[data-automation-id="edit-output-mapping-icon-Dropdown009gay"]'));
        const tooltip = editIcon.injector.get(MatTooltip);

        expect(tooltip.disabled).toEqual(true);
    });

    it('should not be able to open an edit dialog when edit button is disabled', () => {
        const openEditDialogSpy = spyOn(dialogService, 'openDialog');
        component.parameters = [mockSystemTaskAssigneeParameter];
        component.ngOnChanges();
        fixture.detectChanges();
        const editButton = fixture.debugElement.query(By.css('[data-automation-id="edit-output-mapping-button-sys_task_assignee"]'));
        editButton.nativeElement.click();

        expect(openEditDialogSpy).not.toHaveBeenCalled();
    });

    it('should be able to map a system output parameters to a process variable', () => {
        const updateSpy = spyOn(component.update, 'emit');
        component.parameters = [mockSystemTaskAssigneeParameter];
        component.changeSelection(mockProcessVariables[0].variables[2], 0, component.parameters[0]);

        const expectedData: ServiceParameterMapping = {
            ['stringVar']: {
                type: MappingType.variable,
                value: mockSystemTaskAssigneeParameter.name
            }
        };
        expect(updateSpy).toHaveBeenCalledWith(expectedData);
    });
});
