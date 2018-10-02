import { DialogService, ConfirmDialogData } from './dialog.service';
import { TestBed, async } from '@angular/core/testing';
import { MatDialogModule, MatDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from '../../app/confirmation-dialog/confirmation-dialog.component';

describe('DialogService ', () => {
    let service: DialogService;
    let dialog: MatDialog;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, NoopAnimationsModule],
            declarations: [],
            providers: [DialogService]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(DialogService);
        dialog = TestBed.get(MatDialog);
        spyOn(dialog, 'open').and.callFake(() => {});
        spyOn(dialog, 'closeAll').and.callFake(() => {});
    });

    it('the confirm method should return an Observable but not a Subject', () => {
        const observable = service.confirm();

        expect(observable).toBeDefined();
        expect(observable.subscribe).toBeDefined();
        expect(observable.next).toBeUndefined();
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
        const args = dialog.open.calls.argsFor(0);
        const subject = args[1].data.subject;

        expect(subject).toBeDefined();
        expect(subject.next).toBeDefined();
    });

    it('check if the dialog data was passed down', () => {
        const dialogData: ConfirmDialogData = {
            title: 'Berta',
            subtitle: 'Josef'
        };

        service.confirm(dialogData);
        const args = dialog.open.calls.argsFor(0);
        const data = args[1].data;

        expect(data.title).toBe(dialogData.title);
        expect(data.subtitle).toBe(dialogData.subtitle);
    });

    it('check if the returned observable is related to the subject', done => {
        const observable = service.confirm();
        const args = dialog.open.calls.argsFor(0);
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
});
