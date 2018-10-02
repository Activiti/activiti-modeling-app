import { NgModule } from '@angular/core';
import { ProcessNamePipe } from './pipes/process-name.pipe';
import { HeaderBreadcrumbsComponent } from './components/header-breadcrumbs/header-breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';
import { CoreModule } from '@alfresco/adf-core';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        CoreModule
    ],
    declarations: [
        ProcessNamePipe,
        HeaderBreadcrumbsComponent,
        EntityDialogComponent
    ],
    exports: [
        ProcessNamePipe,
        HeaderBreadcrumbsComponent
    ],
    entryComponents: [ EntityDialogComponent ],
})
export class SharedModule {}
