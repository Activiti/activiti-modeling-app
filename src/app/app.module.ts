import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './common/material.module';

import { AppComponent } from './app.component';
import { AppLoginComponent } from './app/app-login/app-login.component';
import { AppLayoutComponent } from './app/app-layout/app-layout.component';
import { CurrentUserComponent } from './app/header/current-user/current-user.component';
import { ConfirmationDialogComponent } from './app/confirmation-dialog/confirmation-dialog.component';
import { HostSettingsComponent } from './app/host-settings/host-settings.component';

import { DialogService } from './common/services/dialog.service';

import { AdfModule } from './common/adf.module';
import { AppStoreModule } from './app-store.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProcessEditorModule } from './process-editor/process-editor.module';
import { ApplicationEditorModule } from './application-editor/application-editor.module';

import { routing } from './app.routes';
import { AmaAuthenticationService } from './common/services/ama-authentication.service';
import { AmaLocalStorageMergeGuard } from './common/services/ama-localstorage-merge-guard.service';
import { BpmnjsPropertiesModule } from './bpmnjs-properties/bpmnjs-properties.module';
import { environment } from '../environments/environment';
import { DownloadResourceService } from './common/services/download-resource';
import { MatInputModule } from '@angular/material';

import { APSApiModule } from 'ama-sdk';


@NgModule({
    imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        HttpClientModule,

        AdfModule,
        AppStoreModule,

        APSApiModule.forRoot(),

        routing,

        DashboardModule,
        ProcessEditorModule,
        ApplicationEditorModule,
        MatInputModule,

        /** @deprecated: bpmnjs-properties */
        !environment.production ? BpmnjsPropertiesModule : []
    ],
    declarations: [
        AppComponent,
        AppLoginComponent,
        AppLayoutComponent,
        CurrentUserComponent,
        ConfirmationDialogComponent,
        HostSettingsComponent
    ],
    entryComponents: [ ConfirmationDialogComponent ],
    providers: [
        DialogService,
        AmaLocalStorageMergeGuard,
        AmaAuthenticationService,
        DownloadResourceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
