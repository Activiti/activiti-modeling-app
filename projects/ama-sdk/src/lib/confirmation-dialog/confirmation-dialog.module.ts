import { NgModule } from '@angular/core';
import { DialogService } from './services/dialog.service';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        CoreModule
    ],
    providers: [ DialogService ],
    declarations: [
        ConfirmationDialogComponent
    ],
    entryComponents: [ ConfirmationDialogComponent ],
    exports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        CoreModule
    ]
})
export class ConfirmationDialogModule {}
