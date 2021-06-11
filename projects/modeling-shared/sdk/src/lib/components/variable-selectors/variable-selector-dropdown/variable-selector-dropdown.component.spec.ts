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

import { ElementVariable } from '../../../services/process-editor-element-variables-provider.service';
import { CoreModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { VariableSelectorComponent } from '../variable-selector/variable-selector.component';
import { VariableSelectorDropdownComponent } from './variable-selector-dropdown.component';
import { expectedVariables } from '../../../mocks/process-editor.mock';

describe('VariableSelectorDropdownComponent', () => {

    let fixture: ComponentFixture<VariableSelectorDropdownComponent>;
    let component: VariableSelectorDropdownComponent;
    let vars: ElementVariable[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ],
            imports: [
                CommonModule,
                CoreModule.forChild(),
                OverlayModule,
                TranslateModule.forRoot(),
                BrowserAnimationsModule
            ],
            declarations: [VariableSelectorComponent, VariableSelectorDropdownComponent]
        }).compileComponents();
        vars = [];
        expectedVariables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));

        fixture = TestBed.createComponent(VariableSelectorDropdownComponent);
        component = fixture.componentInstance;
        component.variables = expectedVariables;
        component.ngOnInit();
        fixture.detectChanges();
    }));

    it('should display the variable selector when clicking on the select', async () => {
        const dropdown = fixture.debugElement.query(By.css('.ama-variable-selector-dropdown-input'));

        dropdown.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();
        const variablesPanel = fixture.debugElement.query(By.css('.ama-variable-selector-dropdown-variables-panel'));

        expect(variablesPanel).not.toBeNull();
    });

    it('should emit the selected variable and close the panel', () => {
        spyOn(component.variableSelected, 'emit');
        component.variablesPanelDisplay = true;

        component.onVariableSelected(vars[0]);

        expect(component.variableSelected.emit).toHaveBeenCalledWith(vars[0]);
        expect(component.variablesPanelDisplay).toBe(false);
    });
});
