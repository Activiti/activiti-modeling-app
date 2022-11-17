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

import { Action } from '@ngrx/store';
import {
    ServiceParameterMappings,
    ServicesParameterConstants,
    TaskAssignment,
    TaskTemplateMapping
} from '../api/types';

export const UPDATE_SERVICE_PARAMETERS = '[ProcessEditor] Update Service Parameters';
export class UpdateServiceParametersAction implements Action {
    readonly type = UPDATE_SERVICE_PARAMETERS;
    constructor(
        public modelId: string,
        public processId: string,
        public serviceId: string | undefined,
        public serviceParameterMappings: ServiceParameterMappings,
        public constants?: ServicesParameterConstants
    ) { }
}

export const AUTO_SAVE_PROCESS = '[ProcessEditor] Auto save process';
export class AutoSaveProcessAction implements Action {
    readonly type = AUTO_SAVE_PROCESS;
}

export const UPDATE_TASK_ASSIGNMENTS = '[ProcessEditor] Update Task Assignments';
export class UpdateServiceAssignmentAction implements Action {
    readonly type = UPDATE_TASK_ASSIGNMENTS;
    constructor(
        public modelId: string,
        public processId: string,
        public serviceId: string,
        public taskAssignment: TaskAssignment,
    ) { }
}

export const UPDATE_TASK_TEMPLATE = '[ProcessEditor] Update Task Template';
export class UpdateUserTaskTemplateAction implements Action {
    readonly type = UPDATE_TASK_TEMPLATE;
    constructor(
        public modelId: string,
        public processId: string,
        public userTaskId: string,
        public taskTemplate: TaskTemplateMapping) { }
}
