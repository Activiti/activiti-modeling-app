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
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './common/material.module';

import { AppComponent } from './app.component';
import { AppLoginComponent } from './app/app-login/app-login.component';
import { AppLayoutComponent } from './app/app-layout/app-layout.component';
import { HeaderMenuComponent } from './app/header/header-menu.component';
import { SettingsDialogComponent } from './app/settings/settings-dialog.component';
import { HostSettingsComponent } from './app/host-settings/host-settings.component';

import { AboutModule } from './app/about/about.module';
import { AdfModule } from './common/adf.module';
import { AppStoreModule } from './app-store.module';

import { appRoutes } from './app.routes';
import { ConnectorEditorModule } from '@alfresco-dbp/modeling-ce/connector-editor';
import { DashboardModule } from '@alfresco-dbp/modeling-ce/dashboard';
import { AmaLocalStorageMergeGuard } from './common/services/ama-localstorage-merge-guard.service';
import { ErrorContentComponent } from './app/error/error-content.component';
import { MatInputModule } from '@angular/material/input';

import {
    ACMApiModule,
    AmaServicesModule,
    AuthTokenProcessorService,
    allLogFilter,
    provideLogFilter
} from '@alfresco-dbp/modeling-shared/sdk';
import { DialogsModule } from '@alfresco-dbp/adf-candidates/core/dialog';
import { AmaRoleGuard } from './ama-role-guard.service';
import { AppExtensionsModule } from './extensions.module';
import { GlobalErrorHandler } from './common/helpers/services/error-handler.service';
import { LogHistoryComponent } from './app/app-layout/logging/components/log-history/log-history.component';
import { LogHistoryEntryComponent } from './app/app-layout/logging/components/log-history/log-history-entry/log-history-entry.component';
import { EditorFooterComponent } from './app/app-layout/editor-footer/editor-footer.component';
import { AppFooterService } from './common/services/app-footer.service';
import { EDITOR_FOOTER_SERVICE_TOKEN } from './app/app-layout/editor-footer/editor-footer.service.interface';
import { AmaModelSchemaLoaderGuard } from './common/services/ama-model-schema-loader-guard.service';
import { getBackendLogInitiator } from './common/services/application.constants';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService, TranslateLoaderService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { unauthorizedServiceFactory } from './common/services/unauthorized-service-factory';
import { CustomIconsModule } from './common/custom-icons.module';
import { ProcessEditorModule } from '@alfresco-dbp/modeling-ce/process-editor';
import { environment } from '../environments/environment';
import { ProjectEditorModule } from '@alfresco-dbp/modeling-ce/project-editor';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        AdfModule,
        AppStoreModule,

        AmaServicesModule.forApplication(),

        ACMApiModule.forRoot(),

        RouterModule.forRoot(appRoutes, { useHash: true }),

        DashboardModule,
        ProjectEditorModule,
        ProcessEditorModule,
        ConnectorEditorModule,

        MatInputModule,
        DialogsModule,

        AppExtensionsModule,
        CustomIconsModule,
        ...(environment.devTools ? [ AboutModule ] : [])
    ],
    declarations: [
        AppComponent,
        AppLoginComponent,
        AppLayoutComponent,
        ErrorContentComponent,
        HeaderMenuComponent,
        SettingsDialogComponent,
        HostSettingsComponent,
        LogHistoryComponent,
        LogHistoryEntryComponent,
        EditorFooterComponent,
    ],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        AmaLocalStorageMergeGuard,
        AmaRoleGuard,
        AmaModelSchemaLoaderGuard,
        AuthTokenProcessorService,
        { provide: EDITOR_FOOTER_SERVICE_TOKEN, useClass: AppFooterService },
        provideLogFilter(getBackendLogInitiator()),
        provideLogFilter(allLogFilter),
        {
            provide: APP_INITIALIZER,
            useFactory: unauthorizedServiceFactory,
            deps: [
                AlfrescoApiService,
                Store
            ],
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
