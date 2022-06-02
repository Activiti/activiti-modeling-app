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
    CONNECTORS_ENTITY_KEY,
    CONNECTOR_ICON,
    GetConnectorAttemptAction,
    CONNECTOR
} from '@alfresco-dbp/modeling-shared/sdk';
import { ConnectorsLoaderGuard } from './guards/connectors-loader.guard';


export const connectorEditorTabRoutes: Routes = [
    {
        path: CONNECTOR,
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
                            modelEntity: CONNECTORS_ENTITY_KEY,
                            entityIcon: CONNECTOR_ICON,
                            actionClass: GetConnectorAttemptAction
                        } as ModelEditorRouterGuardData
                    },
                    {
                        path: '',
                        component: ModelHeaderBreadcrumbProxyComponent,
                        outlet: 'editors-headers',
                        data: {
                            modelType: CONNECTORS_ENTITY_KEY
                        }
                    }
                ]

            }
        ],
        canActivate: [ConnectorsLoaderGuard]
    }
];
