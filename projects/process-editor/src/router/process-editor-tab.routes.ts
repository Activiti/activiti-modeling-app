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
import {
    UnsavedPageGuard,
    MODEL_EDITOR_ROUTES,
    ModelLoaderGuard,
    ModelEditorRouterGuardData,
    ModelHeaderBreadcrumbProxyComponent,
    TabManagerComponent,
    PROCESSES_ENTITY_KEY,
    PROCESS
} from '@alfresco-dbp/modeling-shared/sdk';
import { PROCESS_ICON } from '../extension/processes-filter.extension';
import { GetProcessAttemptAction } from '../store/process-editor.actions';
import { ProcessesLoaderGuard } from './guards/processes-loader.guard';

export const processEditorTabRoutes: Routes = [
    {
        path: PROCESS,
        data: { injectTo: MODEL_EDITOR_ROUTES },
        children: [
            {
                path: ':modelId',
                children: [
                    {
                        path: '',
                        canActivate: [ModelLoaderGuard],
                        canDeactivate: [UnsavedPageGuard],
                        component: TabManagerComponent,
                        data: {
                            modelEntity: PROCESSES_ENTITY_KEY,
                            entityIcon: PROCESS_ICON,
                            actionClass: GetProcessAttemptAction
                        } as ModelEditorRouterGuardData
                    },
                    {
                        path: '',
                        component: ModelHeaderBreadcrumbProxyComponent,
                        outlet: 'editors-headers',
                        data: {
                            modelType: PROCESSES_ENTITY_KEY
                        }
                    }
                ]

            }
        ],
        canActivate: [ProcessesLoaderGuard]
    }
];
