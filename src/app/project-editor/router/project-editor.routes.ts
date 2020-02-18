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
import { ProjectLoaderGuard } from './guards/project-loader.guard';
import { SelectedProjectSetterGuard } from './guards/selected-project-setter.guard';
import { ProjectContentComponent } from '../components/project-content/project-content.component';
import { ProjectNavigationComponent } from '../components/project-navigation/project-navigation.component';
import { MODULE_EDITOR_ROUTES } from '@alfresco-dbp/modeling-shared/sdk';

export const projectEditorRoutes: Routes = [
    {
        path: ':projectId',
        data: { hostFor: MODULE_EDITOR_ROUTES },
        canActivate: [ SelectedProjectSetterGuard, ProjectLoaderGuard ],
        children: [
            { path: '', component: ProjectContentComponent },
            { path: '', component: ProjectNavigationComponent, outlet: 'navigation' }
        ]
    }
];
