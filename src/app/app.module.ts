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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './common/material.module';

import { AppComponent } from './app.component';
import { AppLoginComponent } from './app/app-login/app-login.component';
import { AppLayoutComponent } from './app/app-layout/app-layout.component';
import { CurrentUserComponent } from './app/header/current-user/current-user.component';
import { SettingsDialogComponent } from './app/settings/settings-dialog.component';
import { HostSettingsComponent } from './app/host-settings/host-settings.component';

import { AdfModule } from './common/adf.module';
import { AppStoreModule } from './app-store.module';
import { ProcessEditorModule } from './process-editor/process-editor.module';
import { ProjectEditorModule } from './project-editor/project-editor.module';

import { appRoutes } from './app.routes';
import { ConnectorEditorModule } from './connector-editor/connector-editor.module';
import { AmaLocalStorageMergeGuard } from './common/services/ama-localstorage-merge-guard.service';
import { ErrorContentComponent } from './app/error/error-content.component';
import { BpmnjsPropertiesModule } from './bpmnjs-properties/bpmnjs-properties.module';
import { environment } from '../environments/environment';
import { MatInputModule } from '@angular/material';

import { ACMApiModule, AmaServicesModule, ConfirmationDialogModule, AmaAuthenticationService, AuthTokenProcessorService, SharedModule, EditorHelperService } from 'ama-sdk';
import { AmaRoleGuard } from './ama-role-guard.service';
import { AppExtensionsModule } from './extensions.module';
import { ModelStorageService } from './common/services/model-storage.service';
import { GlobalErrorHandler } from './common/helpers/services/error-handler.service';
import { LogHistoryComponent } from './app/app-layout/logging/components/log-history/log-history.component';
import { LogHistoryEntryComponent } from './app/app-layout/logging/components/log-history/log-history-entry/log-history-entry.component';
import { EditorFooterComponent } from './app/app-layout/editor-footer/editor-footer.component';

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

        ACMApiModule.forRoot(),

        RouterModule.forRoot(appRoutes, { useHash: true }),

        ProjectEditorModule,
        ProcessEditorModule,
        ConnectorEditorModule,

        MatInputModule,
        ConfirmationDialogModule,

        AppExtensionsModule,
        SharedModule,

        /** @deprecated: bpmnjs-properties */
        !environment.production ? BpmnjsPropertiesModule : []
    ],
    declarations: [
        AppComponent,
        AppLoginComponent,
        AppLayoutComponent,
        ErrorContentComponent,
        CurrentUserComponent,
        SettingsDialogComponent,
        HostSettingsComponent,
        LogHistoryComponent,
        LogHistoryEntryComponent,
        EditorFooterComponent
    ],
    entryComponents: [SettingsDialogComponent],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        AmaLocalStorageMergeGuard,
        AmaRoleGuard,
        AuthTokenProcessorService,
        AmaAuthenticationService,
        ModelStorageService,
        EditorHelperService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
