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
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { VariablesModule } from '../../public-api';
import { PropertyTypeDialogComponent } from './property-type-dialog.component';

describe('PropertyTypeDialogComponent', () => {
    let fixture: ComponentFixture<PropertyTypeDialogComponent>;

    const mockDialog = {
        close: () => { },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PropertyTypeDialogComponent],
            imports: [
                MatDialogModule,
                TranslateModule.forRoot(),
                VariablesModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MatDialogRef, useValue: mockDialog },
                {
                    provide: MAT_DIALOG_DATA, useValue: {
                        value: { type: 'string' }
                    }
                },
                provideMockStore({}),
            ]
        });

        fixture = TestBed.createComponent(PropertyTypeDialogComponent);
        fixture.detectChanges();
    });

    it('should display the json schema editor', () => {
        const editor: HTMLElement = fixture.debugElement.query(By.css('modelingsdk-json-schema-editor')).nativeElement;

        expect(editor).not.toBeNull();
    });
});
