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
import { HostSettingsComponent } from './app/host-settings/host-settings.component';

import { AdfModule } from './common/adf.module';
import { AppStoreModule } from './app-store.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProcessEditorModule } from './process-editor/process-editor.module';
import { ApplicationEditorModule } from './application-editor/application-editor.module';

import { routing } from './app.routes';
import { AmaLocalStorageMergeGuard } from './common/services/ama-localstorage-merge-guard.service';
import { BpmnjsPropertiesModule } from './bpmnjs-properties/bpmnjs-properties.module';
import { environment } from '../environments/environment';
import { MatInputModule } from '@angular/material';

import { APSApiModule, AmaServicesModule, ConfirmationDialogModule, AmaAuthenticationService } from 'ama-sdk';

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

        AmaServicesModule.forApplication(),

        APSApiModule.forRoot(),

        routing,

        DashboardModule,
        ProcessEditorModule,
        ApplicationEditorModule,
        MatInputModule,
        ConfirmationDialogModule,

        /** @deprecated: bpmnjs-properties */
        !environment.production ? BpmnjsPropertiesModule : []
    ],
    declarations: [
        AppComponent,
        AppLoginComponent,
        AppLayoutComponent,
        CurrentUserComponent,
        HostSettingsComponent
    ],
    providers: [
        AmaLocalStorageMergeGuard,
        AmaAuthenticationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
