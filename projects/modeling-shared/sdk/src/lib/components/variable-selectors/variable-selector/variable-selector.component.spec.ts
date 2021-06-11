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

import { ElementVariable } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { expectedVariables } from '../../../mocks/process-editor.mock';
import { VariableSelectorComponent } from './variable-selector.component';

describe('VariableSelectorComponent', () => {

    let fixture: ComponentFixture<VariableSelectorComponent>;
    let component: VariableSelectorComponent;
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
            declarations: [VariableSelectorComponent]
        }).compileComponents();
        vars = [];
        expectedVariables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));

        fixture = TestBed.createComponent(VariableSelectorComponent);
        component = fixture.componentInstance;
        component.variables = expectedVariables;
        component.ngOnInit();
        fixture.detectChanges();
    }));

    it('should display variable list', () => {
        const variableIcons = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-type'));
        const variableNames = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-name'));

        expect(variableIcons.length).toBe(vars.length);
        expect(variableNames.length).toBe(vars.length);

        for (let index = 0; index < vars.length; index++) {
            const variable = vars[index];
            expect(variable.icon).toBe(variableIcons[index].nativeElement.textContent.trim());
        }

        for (let index = 0; index < vars.length; index++) {
            const variable = vars[index];
            expect(variable.label || variable.name).toBe(variableNames[index].nativeElement.textContent.trim());
        }
    });

    it('should filter variable list by type', () => {
        component.typeFilter = 'string';
        component.ngOnInit();
        fixture.detectChanges();

        const expectation = [vars[0], vars[3]];
        const variableIcons = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-type'));
        const variableNames = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-name'));

        expect(variableIcons.length).toBe(expectation.length);
        expect(variableNames.length).toBe(expectation.length);

        for (let index = 0; index < expectation.length; index++) {
            const variable = expectation[index];
            expect(variable.icon).toBe(variableIcons[index].nativeElement.textContent.trim());
        }

        for (let index = 0; index < expectation.length; index++) {
            const variable = expectation[index];
            expect(variable.label || variable.name).toBe(variableNames[index].nativeElement.textContent.trim());
        }
    });

    it('should filter variable list by search', () => {
        component.search = 'o';
        component.onSearch();
        fixture.detectChanges();

        const expectation = [vars[0], vars[1], vars[3], vars[4]];
        const variableIcons = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-type'));
        const variableNames = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-name'));

        expect(variableIcons.length).toBe(expectation.length);
        expect(variableNames.length).toBe(expectation.length);

        for (let index = 0; index < expectation.length; index++) {
            const variable = expectation[index];
            expect(variable.icon).toBe(variableIcons[index].nativeElement.textContent.trim());
        }

        for (let index = 0; index < expectation.length; index++) {
            const variable = expectation[index];
            expect(variable.label || variable.name).toBe(variableNames[index].nativeElement.textContent.trim());
        }
    });

    it('should clear search', () => {
        component.search = 'o';
        component.onSearch();
        fixture.detectChanges();

        const expectation = [vars[0], vars[1], vars[3], vars[4]];
        let variableIcons = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-type'));
        let variableNames = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-name'));

        expect(variableIcons.length).toBe(expectation.length);
        expect(variableNames.length).toBe(expectation.length);

        component.clearSearch();
        fixture.detectChanges();

        variableIcons = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-type'));
        variableNames = fixture.debugElement.queryAll(By.css('.variables-selector-variables-group-list-item-name'));

        expect(component.search).toBe('');
        expect(variableIcons.length).toBe(vars.length);
        expect(variableNames.length).toBe(vars.length);

        for (let index = 0; index < vars.length; index++) {
            const variable = vars[index];
            expect(variable.icon).toBe(variableIcons[index].nativeElement.textContent.trim());
        }

        for (let index = 0; index < vars.length; index++) {
            const variable = vars[index];
            expect(variable.label || variable.name).toBe(variableNames[index].nativeElement.textContent.trim());
        }
    });

    it('should emit the selected variable', () => {
        spyOn(component.variableSelected, 'emit');
        component.onVariableSelect(vars[0]);
        expect(component.variableSelected.emit).toHaveBeenCalledWith(vars[0]);
    });
});
