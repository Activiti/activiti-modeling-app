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

import { Routes } from '@angular/router';
import { AuthGuard } from '@alfresco/adf-core';
import { AppLayoutComponent } from './app/app-layout/app-layout.component';
import { AppLoginComponent } from './app/app-login/app-login.component';
import { projectEditorRoutes } from './project-editor/router/project-editor.routes';
import { HostSettingsComponent } from './app/host-settings/host-settings.component';
import { AmaLocalStorageMergeGuard } from './common/services/ama-localstorage-merge-guard.service';
import { AmaRoleGuard } from './ama-role-guard.service';
import { ErrorContentComponent } from './app/error/error-content.component';
import { AboutComponent } from './app/about/about.component';
import { dashboardRoutes } from './dashboard/router/dashboard.routes';
import { AmaModelSchemaLoaderGuard } from './common/services/ama-model-schema-loader-guard.service';
import { DASHBOARD_ROUTES } from '@alfresco-dbp/modeling-shared/sdk';

export const appRoutes: Routes = [
    { path: 'login', component: AppLoginComponent },
    { path: 'settings', component: HostSettingsComponent },
    {
        path: '',

        component: AppLayoutComponent,
        canActivate: [
            AuthGuard,
            AmaLocalStorageMergeGuard,
            AmaModelSchemaLoaderGuard
        ],
        children: [
            { path: 'error/:id', component: ErrorContentComponent },
            {
                path: 'dashboard',
                canActivate: [AmaRoleGuard],
                children: dashboardRoutes,
                data: { hostFor: DASHBOARD_ROUTES }
            },
            // Impossible to lazily load ADF modules, that is why the hack
            {
                path: 'projects',
                canActivate: [AmaRoleGuard],
                children: projectEditorRoutes
            },
            { path: 'about', component: AboutComponent },
            { path: 'home', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
