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
import { ProcessEditorComponent } from '../components/process-editor/process-editor.component';
import { ProcessLoaderGuard } from './guards/process-loader.guard';
import { UnsavedPageGuard, PROCESS, MODULE_EDITOR_ROUTES } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessDeactivateGuard } from './guards/process-deactivate.guard';
import { ProcessesLoaderGuard } from './guards/processes-loader.guard';

export const processEditorRoutes: Routes = [
    {
        path: PROCESS,
        data: { injectTo: MODULE_EDITOR_ROUTES },
        children: [
            {
                path: ':processId',
                canActivate: [ ProcessLoaderGuard ],
                canDeactivate: [ UnsavedPageGuard, ProcessDeactivateGuard ],
                component: ProcessEditorComponent
            }
        ],
        canActivate: [ ProcessesLoaderGuard ]
    }
];
