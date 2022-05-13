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

import { VariableMappingTypeComponent } from './variable-mapping.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VariableMappingBehavior } from '../../interfaces/public-api';

describe('VariableMappingComponent', () => {
    let fixture: ComponentFixture<VariableMappingTypeComponent>;
    let component: VariableMappingTypeComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                TranslateModule.forRoot(),
                MatSelectModule,
                MatInputModule,
                MatFormFieldModule,
                NoopAnimationsModule,
            ],
            declarations: [
                VariableMappingTypeComponent
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VariableMappingTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should validate the 2 mapping type options', () => {
        fixture.detectChanges();
        const select1 = fixture.debugElement.query(By.css('[data-automation-id="mapping-type"] mat-select'));
        select1.nativeElement.click();
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        expect(options[0].nativeElement.textContent).toEqual('SDK.VARIABLE_MAPPING.MAP_NO_VARIABLE');
        expect(options[1].nativeElement.textContent).toEqual('SDK.VARIABLE_MAPPING.MAP_ALL');
        expect(options[2].nativeElement.textContent).toEqual('SDK.VARIABLE_MAPPING.MAP_VARIABLES');
        expect(options[3].nativeElement.textContent).toEqual('SDK.VARIABLE_MAPPING.MAP_ALL_INPUTS');
        expect(options[4].nativeElement.textContent).toEqual('SDK.VARIABLE_MAPPING.MAP_ALL_OUTPUTS');
    });

    it('should emit mapping behavior on dropdown change', () => {
        spyOn(component.mappingBehaviorChange, 'emit');
        fixture.detectChanges();
        const select1 = fixture.debugElement.query(By.css('[data-automation-id="mapping-type"] mat-select'));
        select1.nativeElement.click();
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('.mat-option'));
        options[2].nativeElement.click();
        fixture.detectChanges();
        expect(component.mappingBehaviorChange.emit).toHaveBeenCalledWith(VariableMappingBehavior.MAP_VARIABLE);
    });
});
