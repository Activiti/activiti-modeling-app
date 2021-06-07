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

import { DialogService, MultipleChoiceDialogReturnType } from './dialog.service';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { DialogData, MultipleChoiceDialogData } from '../interfaces/dialog.interface';
import { MultipleChoiceDialogComponent } from '../components/multiple-choice-dialog/multiple-choice-dialog.component';
import { Subject } from 'rxjs';

describe('DialogService ', () => {
    let service: DialogService;
    let dialog: MatDialog;
    let dialogOpenSpy: jasmine.Spy;
    const multipleChoiceDialogRef: MatDialogRef<MultipleChoiceDialogComponent<fakeType>> = null;
    const subjectMultipleChoice: Subject<MultipleChoiceDialogReturnType<fakeType>> = null;
    enum fakeType {
        WITH_SAVE = 'WITH_SAVE',
        WITHOUT_SAVE = 'WITHOUT_SAVE',
        ABORT = 'ABORT'
    }
    const multipleChoiceDialogData: MultipleChoiceDialogData<fakeType> = {
        choices: [
            { title: 'Save', choice: fakeType.WITH_SAVE, spinnable: true}
        ],
        subtitle: 'Do you want to save changes?',
        title: 'Are you sure?',
        ...subjectMultipleChoice
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, NoopAnimationsModule],
            declarations: [],
            providers: [DialogService]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(DialogService);
        dialog = TestBed.inject(MatDialog);
        dialogOpenSpy = spyOn(dialog, 'open').and.callFake(() => {});
        spyOn(dialog, 'closeAll').and.callFake(() => {});
    });

    it('the confirm return should open a dialog', () => {
        service.confirm();

        expect(dialog.open).toHaveBeenCalled();
        expect(dialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
            width: '600px',
            disableClose: true,
            data: jasmine.any(Object)
        });
    });

    it('check if the subject was passed down', () => {
        service.confirm();
        const args = dialogOpenSpy.calls.argsFor(0);
        const subject = args[1].data.subject;

        expect(subject).toBeDefined();
        expect(subject.next).toBeDefined();
    });

    it('check if the dialog data was passed down', () => {
        const dialogData: DialogData = {
            title: 'Berta',
            subtitle: 'Josef'
        };

        service.confirm(dialogData);
        const args = dialogOpenSpy.calls.argsFor(0);
        const data = args[1].data;

        expect(data.title).toBe(dialogData.title);
        expect(data.subtitle).toBe(dialogData.subtitle);
    });

    it('check if the returned observable is related to the subject', done => {
        const observable = service.confirm();
        const args = dialogOpenSpy.calls.argsFor(0);
        const subject = args[1].data.subject;

        observable.subscribe(value => {
            expect(value).toBe(false);
            done();
        });

        subject.next(false);
    });

    it('should check the openDialog method', () => {
        const component = null;
        const options = { test: 1 };
        service.openDialog(component, options);

        expect(dialog.open).toHaveBeenCalledWith(null, { width: '600px', ...options });
    });

    it('should check the closeAll method', () => {
        service.closeAll();
        expect(dialog.closeAll).toHaveBeenCalled();
    });

    it('the openMultipleChoiceDialog return should open a dialog', () => {
        service.openMultipleChoiceDialog(multipleChoiceDialogData);

        expect(dialog.open).toHaveBeenCalled();
        expect(dialog.open).toHaveBeenCalledWith(MultipleChoiceDialogComponent, {
            width: '600px',
            disableClose: true,
            data: jasmine.any(Object)
        });
    });

    it('check if the subject was passed down in openMultipleChoiceDialog', () => {
        service.openMultipleChoiceDialog(multipleChoiceDialogData);
        const args = dialogOpenSpy.calls.argsFor(0);
        const subject = args[1].data.subject;

        expect(subject).toBeDefined();
        expect(subject.next).toBeDefined();
    });

    it('check if the MultipleChoiceDialog data was passed down', () => {
        service.confirm(multipleChoiceDialogData);
        const args = dialogOpenSpy.calls.argsFor(0);
        const data = args[1].data;

        expect(data.title).toBe(multipleChoiceDialogData.title);
        expect(data.subtitle).toBe(multipleChoiceDialogData.subtitle);
    });

    it('check if the returned observable is related to the subject for MultipleChoiceDialog', done => {
        const observable = service.openMultipleChoiceDialog(multipleChoiceDialogData);
        const args = dialogOpenSpy.calls.argsFor(0);
        const subject = args[1].data.subject;

        observable.subscribe(value => {
            expect(value.choice).toBe(fakeType.WITH_SAVE);
            done();
        });

        subject.next({dialogRef: multipleChoiceDialogRef, choice: fakeType.WITH_SAVE});
    });
});
