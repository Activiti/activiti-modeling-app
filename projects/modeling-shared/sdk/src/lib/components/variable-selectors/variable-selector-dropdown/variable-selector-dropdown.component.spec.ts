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
import { TranslateModule } from '@ngx-translate/core';
import { VariableSelectorComponent } from '../variable-selector/variable-selector.component';
import { VariableSelectorDropdownComponent } from './variable-selector-dropdown.component';
import { expectedVariables } from '../../../mocks/process-editor.mock';
import { ElementVariable } from '../../../api/types';
import { MODELING_JSON_SCHEMA_PROVIDERS } from '../../../services/modeling-json-schema-provider.service';
import { INPUT_TYPE_ITEM_HANDLER } from '../../../variables/properties-viewer/value-type-inputs/value-type-inputs';

describe('VariableSelectorDropdownComponent', () => {

    let fixture: ComponentFixture<VariableSelectorDropdownComponent>;
    let component: VariableSelectorDropdownComponent;
    let vars: ElementVariable[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MODELING_JSON_SCHEMA_PROVIDERS, useValue: [] },
                { provide: INPUT_TYPE_ITEM_HANDLER, useValue: [] }
            ],
            imports: [
                CommonModule,
                CoreModule.forChild(),
                OverlayModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            declarations: [VariableSelectorComponent, VariableSelectorDropdownComponent]
        });
        vars = [];
        expectedVariables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));

        fixture = TestBed.createComponent(VariableSelectorDropdownComponent);
        component = fixture.componentInstance;
        component.variables = expectedVariables;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should display the variable selector when clicking on the select', async () => {
        const dropdown = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-input'));

        dropdown.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();
        const variablesPanel = fixture.debugElement.query(By.css('modelingsdk-variable-selector'));

        expect(variablesPanel).not.toBeNull();
    });

    it('should emit the selected variable and close the panel', () => {
        spyOn(component.variableSelected, 'emit');
        component.variablesPanelDisplay = true;

        component.onVariableSelected(vars[0]);

        expect(component.variableSelected.emit).toHaveBeenCalledWith(vars[0]);
        expect(component.variablesPanelDisplay).toBe(false);
    });

    it('should display no variable message when there are no available variables and there is no selected variable', () => {
        component.variables = [];
        component.ngOnChanges();
        fixture.detectChanges();

        const noVariableMessage = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-no-process-properties-msg'));

        expect(noVariableMessage).not.toBeNull();
    });

    it('should not display no variable message when there are no available variables but there is a selected variable', () => {
        component.variables = [];
        component.selectedVariableName = 'mock-var';
        component.ngOnChanges();
        fixture.detectChanges();

        const noVariableMessage = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-no-process-properties-msg'));

        expect(noVariableMessage).toBeNull();
    });

    it('should not display the clear selection button when no variable is selected', async() => {
        component.varIdSelected = null;
        component.required = false;
        component.ngOnChanges();
        fixture.detectChanges();

        const dropdown = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-input'));

        dropdown.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const clearButton = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-panel-title-button'));
        expect(clearButton).toBeNull();
    });

    it('should not display the clear selection button when required', async() => {
        component.varIdSelected = 'c2f8729e-5056-44d2-8cd7-fb1bada7f4dd';
        component.required = true;
        component.ngOnChanges();
        fixture.detectChanges();

        const dropdown = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-input'));

        dropdown.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const clearButton = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-panel-title-button'));
        expect(clearButton).toBeNull();
    });

    it('should display the clear selection button when variable is selected and not required', async() => {
        component.varIdSelected = 'c2f8729e-5056-44d2-8cd7-fb1bada7f4dd';
        component.required = false;
        component.ngOnChanges();
        fixture.detectChanges();

        const dropdown = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-input'));

        dropdown.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const clearButton = fixture.debugElement.query(By.css('.modelingsdk-variable-selector-dropdown-panel-title-button'));
        expect(clearButton).not.toBeNull();
    });
});
