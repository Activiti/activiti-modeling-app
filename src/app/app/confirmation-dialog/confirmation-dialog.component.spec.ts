import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement } from '@angular/core';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ConfirmationDialog Component', () => {
    let fixture: ComponentFixture<ConfirmationDialogComponent>;
    let component: ConfirmationDialogComponent;
    let element: DebugElement;
    const mockDialogData: any = {};

    const mockDialog = {
        close: jest.fn()
    };

    function setUpTestBed(customMockDialogData) {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, MatDialogModule, TranslateModule.forRoot()],
            declarations: [ConfirmationDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: customMockDialogData },
                { provide: TranslationService, useClass: TranslationMock }
            ]
        }).compileComponents();
    }

    describe('For tests with no injected value for title and subtitle', () => {
        beforeEach(async(() => {
            mockDialogData.subject = new Subject<boolean>();
            setUpTestBed(mockDialogData);
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ConfirmationDialogComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement;
            fixture.detectChanges();
        });

        it('check if there are no custom title/subtitle added the default values are set', () => {
            expect(component.subtitle).toBeDefined();
            expect(component.title).toBeDefined();
            expect(component.title).toEqual('APP.DIALOGS.CONFIRM.TITLE');
            expect(component.subtitle).toEqual('APP.DIALOGS.CONFIRM.SUBTITLE');
        });
    });

    describe('For tests with injected value for title and subtitle', () => {
        beforeEach(async(() => {
            mockDialogData.subject = new Subject<boolean>();
            mockDialogData.title = 'Test title';
            mockDialogData.subtitle = 'Are you sure?';

            setUpTestBed(mockDialogData);
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ConfirmationDialogComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement;
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should have subtitle and title', () => {
            expect(component.subtitle).toBeDefined();
            expect(component.title).toBeDefined();
        });

        it('check if a custom title and subtitle are added the right value are set in the confirmation dialog component ', () => {
            expect(component.title).toEqual('Test title');
            expect(component.subtitle).toEqual('Are you sure?');
        });

        it('subject should next true when confirmed, then complete, and dialog should close', done => {
            mockDialogData.subject.subscribe({
                next: value => {
                    expect(value).toBe(true);
                },
                complete: () => {
                    expect(mockDialog.close).toHaveBeenCalled();
                    done();
                }
            });

            const confirmButton = element.query(By.css('.adf-dialog-action-button'));
            confirmButton.triggerEventHandler('click', {});
        });

        it('subject should next false when canceled, then complete and dialog should close', done => {
            mockDialogData.subject.subscribe({
                next: value => {
                    expect(value).toBe(false);
                },
                complete: () => {
                    expect(mockDialog.close).toHaveBeenCalled();
                    done();
                }
            });

            const cancelButton = element.query(By.css('[mat-dialog-close]'));
            cancelButton.triggerEventHandler('click', {});
        });
    });
});
