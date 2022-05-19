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
import { TranslateModule } from '@ngx-translate/core';
import { PropertyTypeSelectorSmartComponent } from '../../../properties-viewer/property-type-selector/property-type-selector.smart-component';

import { ReferenceSelectorComponent } from './reference-selector.component';

describe('ReferenceSelectorComponent', () => {
    let component: ReferenceSelectorComponent;
    let fixture: ComponentFixture<ReferenceSelectorComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [ReferenceSelectorComponent, PropertyTypeSelectorSmartComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });

        fixture = TestBed.createComponent(ReferenceSelectorComponent);
        component = fixture.componentInstance;
    });

    it('should create property', () => {
        component.writeValue('my-reference');

        expect(component.property).toEqual({
            id: 'property',
            name: 'property',
            type: 'json',
            model: {
                $ref: 'my-reference'
            }
        });
    });

    it('should emit the reference', () => {
        spyOn(component.change, 'emit');

        component.onPropertyChanges({
            id: 'property',
            name: 'property',
            type: 'json',
            model: {
                $ref: 'changed-reference'
            }
        });

        expect(component.change.emit).toHaveBeenCalledWith('changed-reference');
    });
});
