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
import { DASHBOARD_ROUTES, MODEL_EDITOR_ROUTES, SelectedProjectSetterGuard, ProjectLoaderGuard, AUTHENTICATED_ROUTES, MainNavigationComponent, StudioHeaderComponent } from '@alfresco-dbp/modeling-shared/sdk';
import { StudioLayoutComponent } from './components/studio-layout/studio-layout.component';
import { ErrorContentComponent } from '../../common/components/error/error-content.component';
import { AboutComponent } from '../../common/components/about/about.component';
import { AmaLocalStorageMergeGuard, AmaModelSchemaLoaderGuard, AmaRoleGuard } from '../../router';
import { StudioProjectEditorLayoutComponent } from './components/studio-project-editor-layout/studio-project-editor-layout.component';

export const studioLayoutRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'about', component: AboutComponent },
            {
                path: '',
                component: StudioLayoutComponent,
                data: { hostFor: AUTHENTICATED_ROUTES },
                canActivate: [
                    AmaLocalStorageMergeGuard,
                    AmaModelSchemaLoaderGuard
                ],
                children: [
                    { path: 'error/:id', component: ErrorContentComponent },
                    {
                        path: 'dashboard',
                        canActivate: [AmaRoleGuard],
                        children: [
                            { path: '', component: MainNavigationComponent, outlet: 'left-sidebar' }
                        ],
                        // Impossible to lazily load ADF modules, that is why the hack
                        data: { hostFor: DASHBOARD_ROUTES }
                    },

                    { path: 'home', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
                ]
            },
            {
                path: 'projects',
                canActivate: [AmaRoleGuard],
                component: StudioProjectEditorLayoutComponent,
                data: { hostFor: AUTHENTICATED_ROUTES },
                children: [
                    {
                        path: ':projectId',
                        // Impossible to lazily load ADF modules, that is why the hack
                        data: { hostFor: MODEL_EDITOR_ROUTES },
                        canActivate: [ SelectedProjectSetterGuard, ProjectLoaderGuard ],
                        children: []
                    },
                    { path: '', component: StudioHeaderComponent, outlet: 'main-header'}
                ]
            }
        ]
    }
];
