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
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { CanComponentDeactivate, UnsavedPageGuard } from './unsaved-page.guard';
import { AmaTitleService } from '../../../services/title.service';
import { selectAppDirtyState } from '../../../store/app.selectors';
import { RouterTestingModule } from '@angular/router/testing';

class MockComponent implements CanComponentDeactivate {
    returnValue: Observable<boolean> = of(false);

    canDeactivate(): Observable<boolean> {
        return this.returnValue;
    }

    deleteDraftState() {}
}

describe('UnsavedPageGuard', () => {
    let mockComponent: MockComponent;
    let unsavedPageGuard: UnsavedPageGuard;
    let titleService: AmaTitleService;
    let dialogService: DialogService;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };
    let canDeactivateSpy: jasmine.Spy;
    let deleteDraftSpy: jasmine.Spy;
    let titleServiceSpy: jasmine.Spy;
    const modelMock = {};
    let isDirtyState = true;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                NoopAnimationsModule
            ],
            providers: [
                UnsavedPageGuard,
                MockComponent,
                DialogService,
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                { provide: MatDialogRef, useValue: mockDialogRef },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectAppDirtyState) {
                                return of(isDirtyState);
                            } else {
                                return of(modelMock);
                            }
                        })
                    },
                },
            ]
        });
    });

    beforeEach(() => {
        unsavedPageGuard = TestBed.inject(UnsavedPageGuard);
        mockComponent = TestBed.inject(MockComponent);
        dialogService = TestBed.inject(DialogService);
        titleService = TestBed.inject(AmaTitleService);
        titleServiceSpy = spyOn(titleService, 'setSavedTitle');
    });

    it('should instantiate UnsavedPageGuard', () => {
        expect(unsavedPageGuard).toBeTruthy();
    });

    it('should not deactivate when choice is ABORT and canDeactivate method of component is not called', (done) => {
        canDeactivateSpy = spyOn(mockComponent, 'canDeactivate');
        spyOn(dialogService, 'openMultipleChoiceDialog').and.returnValue(of({dialogRef: mockDialogRef, choice: 'ABORT' }));

        unsavedPageGuard.canDeactivate(mockComponent).subscribe((canDeactivate) => {
            expect(canDeactivateSpy).not.toHaveBeenCalled();
            expect(titleServiceSpy).not.toHaveBeenCalled();
            expect(mockDialogRef.close).toHaveBeenCalled();
            expect(canDeactivate).toEqual(false);
            done();
        });
    });

    it('should deactivate when choice is WITHOUT_SAVE and canDeactivate method of component is not called', (done) => {
        canDeactivateSpy = spyOn(mockComponent, 'canDeactivate');
        deleteDraftSpy = spyOn(mockComponent, 'deleteDraftState');
        spyOn(dialogService, 'openMultipleChoiceDialog').and.returnValue(of({dialogRef: mockDialogRef, choice: 'WITHOUT_SAVE' }));

        unsavedPageGuard.canDeactivate(mockComponent).subscribe((canDeactivate) => {
            expect(canDeactivateSpy).not.toHaveBeenCalled();
            expect(deleteDraftSpy).toHaveBeenCalled();
            expect(titleServiceSpy).toHaveBeenCalled();
            expect(mockDialogRef.close).toHaveBeenCalled();
            expect(canDeactivate).toEqual(true);
            done();
        });
    });

    it('should deactivate when choice is WITH_SAVE and when canDeactivate of component returns true', (done) => {
        canDeactivateSpy = spyOn(mockComponent, 'canDeactivate').and.returnValue(of(true));
        spyOn(dialogService, 'openMultipleChoiceDialog').and.returnValue(of({dialogRef: mockDialogRef, choice: 'WITH_SAVE' }));

        unsavedPageGuard.canDeactivate(mockComponent).subscribe((canDeactivate) => {
            expect(titleServiceSpy).toHaveBeenCalled();
            expect(canDeactivateSpy).toHaveBeenCalled();
            expect(mockDialogRef.close).toHaveBeenCalled();
            expect(canDeactivate).toEqual(true);
            done();
        });
    });

    it('should not deactivate when choice is WITH_SAVE and when canDeactivate of component returns false', (done) => {
        canDeactivateSpy = spyOn(mockComponent, 'canDeactivate').and.returnValue(of(false));
        spyOn(dialogService, 'openMultipleChoiceDialog').and.returnValue(of({dialogRef: mockDialogRef, choice: 'WITH_SAVE' }));

        unsavedPageGuard.canDeactivate(mockComponent).subscribe((canDeactivate) => {
            expect(titleServiceSpy).toHaveBeenCalled();
            expect(canDeactivateSpy).toHaveBeenCalled();
            expect(mockDialogRef.close).toHaveBeenCalled();
            expect(canDeactivate).toEqual(false);
            done();
        });
    });

    it('should deactivate when the component is not dirty', (done) => {
        isDirtyState = false;
        unsavedPageGuard.canDeactivate(mockComponent).subscribe((canDeactivate) => {
            expect(titleServiceSpy).not.toHaveBeenCalled();
            expect(mockDialogRef.open).not.toHaveBeenCalled();
            expect(canDeactivate).toEqual(true);
            done();
        });
    });
});
