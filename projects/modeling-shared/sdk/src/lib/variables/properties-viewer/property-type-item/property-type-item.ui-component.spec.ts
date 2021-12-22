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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { expectedItems } from '../../../mocks/modeling-json-schema.service.mock';
import { AutomationIdPipe } from './automation-id.pipe';
import { PropertyTypeItemUiComponent } from './property-type-item.ui-component';

describe('PropertyTypeItemUiComponent', () => {
    let component: PropertyTypeItemUiComponent;
    let fixture: ComponentFixture<PropertyTypeItemUiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MatMenuModule,
                MatIconModule,
                MatTooltipModule,
                TranslateModule.forRoot()],
            declarations: [PropertyTypeItemUiComponent, AutomationIdPipe],
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyTypeItemUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(component.change, 'emit');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit value when option is selected', () => {
        component.onChange(expectedItems[0].children[3]);
        expect(component.change.emit).toHaveBeenCalledWith(expectedItems[0].children[3]);
    });
});
