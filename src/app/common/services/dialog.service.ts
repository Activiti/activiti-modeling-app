import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from '../../app/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';

export interface ConfirmDialogData {
    title?: string;
    subtitle?: string;
}

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog) {}

    openDialog(dialog, options = {}): void {
        this.dialog.open(dialog, {
            width: '600px',
            ...options
        });
    }

    closeAll(): void {
        this.dialog.closeAll();
    }

    confirm(dialogData?: ConfirmDialogData): Observable<boolean> {
        const subjectConfirm = new Subject<boolean>();

        this.dialog.open(ConfirmationDialogComponent, {
            width: '600px',
            disableClose: true,
            data: {
                ...dialogData,
                subject: subjectConfirm
            }
        });

        return subjectConfirm.asObservable();
    }
}
