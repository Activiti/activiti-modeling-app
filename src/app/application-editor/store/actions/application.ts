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

import { Action } from '@ngrx/store';
import { Application, MODEL_TYPE } from 'ama-sdk';

export const SELECT_APPLICATION = 'SELECT_APPLICATION';
export class SelectApplicationAction implements Action {
    readonly type = SELECT_APPLICATION;
    constructor(public payload: string) {}
}

export const CLOSE_FILTER = '[App Tree] Close filter';
export class CloseFilterAction implements Action {
    readonly type = CLOSE_FILTER;
    constructor(public filterType: MODEL_TYPE) {}
}

export const GET_APPLICATION_ATTEMPT = 'GET_APPLICATION_ATTEMPT';
export class GetApplicationAttemptAction implements Action {
    readonly type = GET_APPLICATION_ATTEMPT;
    constructor(public payload: string) {}
}

export const GET_APPLICATION_SUCCESS = 'GET_APPLICATION_SUCCESS';
export class GetApplicationSuccessAction implements Action {
    readonly type = GET_APPLICATION_SUCCESS;
    constructor(public payload: Partial<Application>) {}
}
export interface ExportApplicationPayload {
    applicationId: string;
    applicationName: string;
}
export const EXPORT_APPLICATION = 'EXPORT_APPLICATION';
export class ExportApplicationAction implements Action {
    readonly type = EXPORT_APPLICATION;
    constructor(public payload: ExportApplicationPayload) {}
}
