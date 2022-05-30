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
import { Connector } from './../api/types';
import { EntityDialogForm } from '../helpers/common';

export const GET_CONNECTOR_ATTEMPT = '[Connector] Get attempt';
export class GetConnectorAttemptAction implements Action {
    readonly type = GET_CONNECTOR_ATTEMPT;
    constructor(public connectorId: string) {}
}

export const LOAD_CONNECTOR_ATTEMPT = '[Connector] Load attempt';
export class LoadConnectorAttemptAction implements Action {
    readonly type = LOAD_CONNECTOR_ATTEMPT;
    constructor(public connectorId: string) {}
}

export const CREATE_CONNECTOR_SUCCESS = '[Connector] Create success';
export class CreateConnectorSuccessAction implements Action {
    readonly type = CREATE_CONNECTOR_SUCCESS;
    constructor(public connector: Connector, public navigateTo = false) {}
}

export const CREATE_CONNECTOR_ATTEMPT = '[Connector] Create attempt';
export class CreateConnectorAttemptAction implements Action {
    readonly type = CREATE_CONNECTOR_ATTEMPT;
    constructor(public payload: Partial<EntityDialogForm>, public navigateTo = false, public callback?: (param: Connector) => any) {}
}

export const SHOW_CONNECTORS = '[Connectors] Show the list';
export class ShowConnectorsAction implements Action {
    readonly type = SHOW_CONNECTORS;
    constructor(public projectId: string) {}
}
