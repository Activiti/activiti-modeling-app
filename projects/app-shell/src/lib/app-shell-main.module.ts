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

import { SettingsDialogComponent } from './common/components/settings/settings-dialog.component';
import { ErrorContentComponent } from './common/components/error/error-content.component';
import { HostSettingsComponent } from './common/components/host-settings/host-settings.component';
import { CustomIconsModule } from './common/custom-icons.module';
import { AppLoginComponent } from './common/components/app-login/app-login.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MaterialModule } from './common/material.module';
import { AdfModule } from './common/adf.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService, TranslateLoaderService } from '@alfresco/adf-core';
import { getBackendLogInitiator } from './common/services/application.constants';
import { provideLogFilter, NavigationModule } from '@alfresco-dbp/modeling-shared/sdk';
import { unauthorizedServiceFactory } from './common/services/unauthorized-service-factory';
import { Store } from '@ngrx/store';
import { AppStoreModule } from './store/app-store.module';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './router';
import { StudioLayoutModule, studioLayoutRoutes } from './layout';
import { getApplicationRoutes } from './application.routes';

@NgModule({
    imports: [
        CommonModule,
        CustomIconsModule,
        MaterialModule,
        AdfModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        HttpClientModule,
        NavigationModule,
        AppStoreModule
    ],
    declarations: [
        AppLoginComponent,
        ErrorContentComponent,
        SettingsDialogComponent,
        HostSettingsComponent
    ],
    providers: [
        provideLogFilter(getBackendLogInitiator()),
        {
            provide: APP_INITIALIZER,
            useFactory: unauthorizedServiceFactory,
            deps: [
                AlfrescoApiService,
                Store
            ],
            multi: true
        }
    ]
})
export class AppShellMainModule {}
@NgModule({
    imports: [
        AppShellMainModule,
        StudioLayoutModule,
        AppRoutingModule.forRoot(getApplicationRoutes(studioLayoutRoutes), { useHash: true }),
        // Ngx-translate only works if placed here, not in the AppShellMainModule...
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        })
    ]
})
export class StudioAppShellModule {}
