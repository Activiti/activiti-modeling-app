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

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { ConnectorEditorModule } from '@alfresco-dbp/modeling-ce/connector-editor';
import { DashboardModule } from '@alfresco-dbp/modeling-ce/dashboard';
import { MatInputModule } from '@angular/material/input';

import {
    ACMApiModule,
    AmaServicesModule,
    allLogFilter,
    provideLogFilter,
    featuresInfo,
    STUDIO_ENVIRONMENT_SERVICE_TOKEN
} from '@alfresco-dbp/modeling-shared/sdk';
import { DialogsModule } from '@alfresco-dbp/adf-candidates/core/dialog';
import { AppExtensionsModule } from './extensions.module';
import { ProcessEditorModule } from '@alfresco-dbp/modeling-ce/process-editor';
import { ProjectEditorModule } from '@alfresco-dbp/modeling-ce/project-editor';
import { AboutModule, StudioAppShellModule } from '@alfresco-dbp/modeling-ce/app-shell';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EnvironmentModule } from '@alfresco-dbp/adf-candidates/core/environment';

@NgModule({
    imports: [
        AmaServicesModule.forApplication(),
        ACMApiModule.forRoot(),
        DashboardModule,
        ProjectEditorModule,
        ProcessEditorModule,
        ConnectorEditorModule,
        MatInputModule,
        DialogsModule,
        StudioAppShellModule,
        AppExtensionsModule,
        environment.devTools ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],
        EnvironmentModule.forRoot(environment, featuresInfo, STUDIO_ENVIRONMENT_SERVICE_TOKEN),
        AboutModule.forRoot(environment.production)
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        provideLogFilter(allLogFilter)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
