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
import { Model } from '../api/types';

export const GET_MODELS_ATTEMPT = '[Entities] Get models attempt';
export class GetModelsAttemptAction implements Action {
    readonly type = GET_MODELS_ATTEMPT;
    constructor(public projectId: string) {}
}

export const GET_MODELS_SUCCESS = '[Entities] Get models success';
export class GetModelsSuccessAction implements Action {
    readonly type = GET_MODELS_SUCCESS;
    constructor(public models: Model[]) {}
}
