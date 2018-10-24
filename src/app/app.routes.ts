 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@alfresco/adf-core';
import { AppLayoutComponent } from './app/app-layout/app-layout.component';
import { AppLoginComponent } from './app/app-login/app-login.component';
import { dashboardRoutes } from './dashboard/router/dashboard.routes';
import { applicationEditorRoutes } from './application-editor/router/application-editor.routes';
import { HostSettingsComponent } from './app/host-settings/host-settings.component';
import { AmaLocalStorageMergeGuard } from './common/services/ama-localstorage-merge-guard.service';

export const appRoutes: Routes = [
    { path: 'login', component: AppLoginComponent },
    { path: 'settings', component: HostSettingsComponent },
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [ AuthGuard, AmaLocalStorageMergeGuard ],
        children: [
            // Impossible to lazily load ADF modules, that is why the hack
            { path: 'dashboard', children: dashboardRoutes },
            // Impossible to lazily load ADF modules, that is why the hack
            { path: 'applications', children: applicationEditorRoutes },
            { path: 'home', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
