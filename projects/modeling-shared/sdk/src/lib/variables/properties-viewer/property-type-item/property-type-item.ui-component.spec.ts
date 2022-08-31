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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { expectedPrimitivesInputsItems } from '../../../mocks/modeling-json-schema.service.mock';
import { PropertyTypeDialogComponent } from '../property-type-dialog/property-type-dialog.component';
import { AutomationIdPipe } from './automation-id.pipe';
import { PropertyTypeItemUiComponent } from './property-type-item.ui-component';

describe('PropertyTypeItemUiComponent', () => {
    let component: PropertyTypeItemUiComponent;
    let fixture: ComponentFixture<PropertyTypeItemUiComponent>;
    let dialog: MatDialog;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MatMenuModule,
                MatIconModule,
                MatTooltipModule,
                MatDialogModule,
                TranslateModule.forRoot()],
            declarations: [PropertyTypeItemUiComponent, AutomationIdPipe],
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
        dialog = TestBed.inject(MatDialog);
        fixture = TestBed.createComponent(PropertyTypeItemUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(component.change, 'emit');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit value when option is selected', () => {
        component.onChange(expectedPrimitivesInputsItems.children[1]);
        expect(component.change.emit).toHaveBeenCalledWith(expectedPrimitivesInputsItems.children[1]);
    });

    it('should open the dialog', () => {
        spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({}) } as any);

        const customItem = {
            displayName: 'SDK.PROPERTY_TYPE_SELECTOR.EDIT_MODEL',
            description: 'SDK.PROPERTY_TYPE_SELECTOR.EDIT_MODEL_DESCRIPTION',
            isCustomIcon: false,
            iconName: 'note_alt',
            value: { type: 'object' },
            provider: 'PropertyTypeSelectorSmartComponent'
        };

        const expectedArguments = {
            data: {
                value: { type: 'object' }
            },
            width: '900px'
        };

        component.onChange(customItem);

        expect(dialog.open).toHaveBeenCalledWith(PropertyTypeDialogComponent, expectedArguments);
    });
});
