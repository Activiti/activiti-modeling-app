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
import { MultipleChoiceDialogComponent } from './multiple-choice-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { MultipleChoiceDialogReturnType } from '../../services/dialog.service';
import { DebugElement } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('MultipleChoiceDialog Component', () => {
    enum fakeType {
        WITH_SAVE = 'WITH_SAVE',
        WITHOUT_SAVE = 'WITHOUT_SAVE',
        ABORT = 'ABORT'
    }
    let fixture: ComponentFixture<MultipleChoiceDialogComponent<fakeType>>;
    let component: MultipleChoiceDialogComponent<fakeType>;
    let element: DebugElement;
    const mockDialogData: any = {};

    const mockDialog = {
        close: jest.fn()
    };

    function setUpTestBed(customMockDialogData) {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, MatDialogModule, TranslateModule.forRoot(), MatButtonModule, MatProgressSpinnerModule],
            declarations: [MultipleChoiceDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: customMockDialogData },
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
    }

    describe('For tests with no injected value for title and subtitle', () => {
        beforeEach(() => {
            mockDialogData.subject = new Subject<MultipleChoiceDialogReturnType<fakeType>>();
            setUpTestBed(mockDialogData);
        });

        beforeEach(() => {
            fixture = TestBed.createComponent<MultipleChoiceDialogComponent<fakeType>>(MultipleChoiceDialogComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement;
            fixture.detectChanges();
        });
    });

    describe('For tests with injected value for title and subtitle', () => {
        beforeEach(() => {
            mockDialogData.subject = new Subject<MultipleChoiceDialogReturnType<fakeType>>();
            mockDialogData.title = 'Test title';
            mockDialogData.subtitle = 'Do you want to save the changes made to your model?';
            mockDialogData.choices = [
                { title: `Don't Save`, choice: fakeType.WITHOUT_SAVE },
                { title: 'Cancel', choice: fakeType.ABORT },
                { title: 'Save', choice: fakeType.WITH_SAVE }
            ];
            setUpTestBed(mockDialogData);
        });

        beforeEach(() => {
            fixture = TestBed.createComponent<MultipleChoiceDialogComponent<fakeType>>(MultipleChoiceDialogComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement;
            fixture.detectChanges();
        });

        it('should have subtitle and title', () => {
            expect(component.subtitle).toBeDefined();
            expect(component.title).toBeDefined();
        });

        it('should check if a custom title subtitle are added the right value are set in the multiple choice dialog component ', () => {
            expect(component.title).toEqual('Test title');
            expect(component.subtitle).toEqual('Do you want to save the changes made to your model?');
        });

        it(`should check if subject next's WITH_SAVE choice and a dialogRef when Save is clicked and then complete`, done => {
            mockDialogData.subject.subscribe({
                next: value => {
                    expect(value.choice).toBe('WITH_SAVE');
                    expect(value.dialogRef).toBeTruthy();
                },
                complete: () => {
                    done();
                }
            });

            const saveButton = element.nativeElement.querySelector('[data-automation-id="dialog-button-WITH_SAVE"]');
            saveButton.dispatchEvent(new Event('click'));
        });

        it(`should check if subject next's WITHOUT_SAVE choice and a dialogRef when Don't Save  is clicked and then complete`, done => {
            mockDialogData.subject.subscribe({
                next: value => {
                    expect(value.choice).toBe('WITHOUT_SAVE');
                    expect(value.dialogRef).toBeTruthy();
                },
                complete: () => {
                    done();
                }
            });

            const dontSaveButton = element.nativeElement.querySelector('[data-automation-id="dialog-button-WITHOUT_SAVE"]');
            dontSaveButton.dispatchEvent(new Event('click'));
        });

        it(`should check if subject next's ABORT choice and a dialogRef when cancel is clicked and then complete`, done => {
            mockDialogData.subject.subscribe({
                next: value => {
                    expect(value.choice).toBe('ABORT');
                    expect(value.dialogRef).toBeTruthy();
                },
                complete: () => {
                    done();
                }
            });

            const cancelButton = element.nativeElement.querySelector('[data-automation-id="dialog-button-ABORT"]');
            cancelButton.dispatchEvent(new Event('click'));
        });
    });
});
