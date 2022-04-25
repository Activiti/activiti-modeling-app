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
    PROCESS,
    MODEL_EDITOR_ROUTES,
    ModelLoaderGuard,
    ModelEditorProxyComponent,
    ModelEditorRouterGuardData,
    ModelEditorRouterData,
    ModelHeaderBreadcrumbProxyComponent,
    PROCESSES_ENTITY_KEY
} from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessDeactivateGuard } from './guards/process-deactivate.guard';
import { ProcessesLoaderGuard } from './guards/processes-loader.guard';
import { GetProcessAttemptAction } from '../store/process-editor.actions';

export const processEditorRoutes: Routes = [
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
                        canDeactivate: [UnsavedPageGuard, ProcessDeactivateGuard],
                        component: ModelEditorProxyComponent,
                        data: {
                            modelType: PROCESS,
                            actionClass: GetProcessAttemptAction
                        } as ModelEditorRouterGuardData & ModelEditorRouterData
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
