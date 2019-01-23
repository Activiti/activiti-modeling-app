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

export const GET_CONNECTOR_ATTEMPT = '[Conector] Get attempt';
export class GetConnectorAttemptAction implements Action {
    readonly type = GET_CONNECTOR_ATTEMPT;
    constructor(public connectorId: string) {}
}

export const LOAD_CONNECTOR_ATTEMPT = '[Conector] Load attempt';
export class LoadConnectorAttemptAction implements Action {
    readonly type = LOAD_CONNECTOR_ATTEMPT;
    constructor(public connectorId: string) {}
}

