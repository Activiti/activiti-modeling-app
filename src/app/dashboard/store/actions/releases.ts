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
import { PaginatedEntries, ReleaseEntry } from 'ama-sdk';
import { Pagination } from 'alfresco-js-api-node';

export const GET_PROJECT_RELEASES_ATTEMPT = 'GET_PROJECT_RELEASES_ATTEMPT';
export class GetProjectReleasesAttemptAction implements Action {
    readonly type = GET_PROJECT_RELEASES_ATTEMPT;
    constructor(public projectId: string, public pagination?: Partial<Pagination>) {
    }
}

export const GET_PROJECT_RELEASES_SUCCESS =  'GET_PROJECT_RELEASES_SUCCESS';
export class GetProjectReleasesSuccessAction implements Action {
    readonly type = GET_PROJECT_RELEASES_SUCCESS;
    constructor(public payload: PaginatedEntries<ReleaseEntry>) {}
}
