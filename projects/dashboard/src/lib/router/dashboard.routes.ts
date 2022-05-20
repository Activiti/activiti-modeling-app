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
import { ProjectsListComponent } from '../components/projects-list/projects-list.component';
import { SearchHeaderComponent } from '../components/search-header/search-header.component';
import { DASHBOARD_ROUTES, MainNavigationHeaderComponent } from '@alfresco-dbp/modeling-shared/sdk';

export const dashboardRoutes: Routes = [
    {
        path: '',
        data: { injectTo: DASHBOARD_ROUTES },
        children: [
            {
                path: 'projects',
                component: ProjectsListComponent,
            },
            {
                path: '',
                component: MainNavigationHeaderComponent,
                outlet: 'content-header'
            },
            {
                path: 'favorite-projects',
                component: ProjectsListComponent
            },
            {
                path: '',
                component: SearchHeaderComponent,
                outlet: 'search'
            },
            { path: '', redirectTo: '/dashboard/projects?maxItems=25&skipCount=0&sort=lastModifiedDate,desc', pathMatch: 'full' },
            { path: '', redirectTo: '/dashboard/example-projects?maxItems=10&skipCount=0&sort=name,asc', pathMatch: 'full' }
        ]
    }
];
