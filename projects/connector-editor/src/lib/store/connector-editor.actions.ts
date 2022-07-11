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

import {
    ConnectorContent,
    EntityDialogForm,
    Connector,
    UploadFileAttemptPayload,
    SaveAsDialogPayload,
    GetConnectorAttemptAction,
    CreateConnectorAttemptAction,
    ShowConnectorsAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';

export interface ValidateConnectorPayload {
    title: string;
    modelId: string;
    modelContent: ConnectorContent;
    action: Action;
    errorAction?: Action;
    projectId?: string;
}

export interface UpdateConnectorPayload {
    connectorId: string;
    projectId: string;
    form: Partial<EntityDialogForm>;
}

export interface ConnectorDialogPayload {
    projectId: string;
    connector?: Connector;
}
export interface SaveConnectorPayload {
    modelId: string;
    modelContent: ConnectorContent;
}

export const VALIDATE_CONNECTOR_ATTEMPT = '[Connector] Validate attempt';
export class ValidateConnectorAttemptAction implements Action {
    readonly type = VALIDATE_CONNECTOR_ATTEMPT;
    constructor(public payload: ValidateConnectorPayload) {}
}

export const VALIDATE_CONNECTOR_SUCCESS = '[Connector] Validate success';
export class ValidateConnectorSuccessAction implements Action {
    readonly type = VALIDATE_CONNECTOR_SUCCESS;
    constructor(public payload: Action[]) {}
}

export const CHANGE_CONNECTOR_CONTENT = '[Connector] Content change';
export class ChangeConnectorContent implements Action {
    readonly type = CHANGE_CONNECTOR_CONTENT;
    constructor() {}
}

export const GET_CONNECTORS_ATTEMPT = '[Connectors] Get attempt';
export class GetConnectorsAttemptAction implements Action {
    readonly type = GET_CONNECTORS_ATTEMPT;
    constructor(public projectId: string) {}
}

export const GET_CONNECTORS_SUCCESS = '[Connectors] Get success';
export class GetConnectorsSuccessAction implements Action {
    readonly type = GET_CONNECTORS_SUCCESS;
    constructor(public connectors: Connector[]) {}
}

export const GET_CONNECTOR_SUCCESS = '[Connector] Get success';
export class GetConnectorSuccessAction implements Action {
    readonly type = GET_CONNECTOR_SUCCESS;
    constructor(public connector: Connector, public connectorContent: ConnectorContent) {}
}

export const UPDATE_CONNECTOR_CONTENT_ATTEMPT = '[Connector] Update content attempt';
export class UpdateConnectorContentAttemptAction implements Action {
    readonly type = UPDATE_CONNECTOR_CONTENT_ATTEMPT;
    constructor(public payload: SaveConnectorPayload) {}
}

export const UPDATE_CONNECTOR_SUCCESS = '[Connector] Update success';
export class UpdateConnectorSuccessAction implements Action {
    readonly type = UPDATE_CONNECTOR_SUCCESS;
    constructor(public connector: Update<Partial<ConnectorContent>>) {}
}

export const UPDATE_CONNECTOR_FAILED = '[Connector] Update failed';
export class UpdateConnectorFailedAction implements Action {
    readonly type = UPDATE_CONNECTOR_FAILED;
    constructor() {}
}

export const DRAFT_UPDATE_CONNECTOR_CONTENT = '[Connector] Draft Content update';
export class DraftUpdateConnectorContentAction implements Action {
    readonly type = DRAFT_UPDATE_CONNECTOR_CONTENT;
    constructor(public connector: Update<Partial<ConnectorContent>>) {}
}

export const DRAFT_DELETE_CONNECTOR = '[Connector] Draft Delete';
export class DraftDeleteConnectorAction implements Action {
    readonly type = DRAFT_DELETE_CONNECTOR;
    constructor(public modelId: string) {}
}
export const DELETE_CONNECTOR_ATTEMPT = '[Connector] Delete attempt';
export class DeleteConnectorAttemptAction implements Action {
    readonly type = DELETE_CONNECTOR_ATTEMPT;
    constructor(public connectorId: string) {}
}

export const DELETE_CONNECTOR_SUCCESS = '[Connector] Delete success';
export class DeleteConnectorSuccessAction implements Action {
    readonly type = DELETE_CONNECTOR_SUCCESS;
    constructor(public connectorId: string) {}
}

export const UPLOAD_CONNECTOR_ATTEMPT = '[Connector] Upload file';
export class UploadConnectorAttemptAction implements Action {
    readonly type = UPLOAD_CONNECTOR_ATTEMPT;
    constructor(public payload: UploadFileAttemptPayload) {}
}

export const DOWNLOAD_CONNECTOR = '[Connector] Download connector';
export class DownloadConnectorAction implements Action {
    readonly type = DOWNLOAD_CONNECTOR;
    constructor(public modelId: string) {}
}

export const OPEN_CONNECTOR_SAVE_AS_FORM = '[Connector] Open save as connector';
export class OpenSaveAsConnectorAction implements Action {
    readonly type = OPEN_CONNECTOR_SAVE_AS_FORM;
    constructor(public dialogData: SaveAsDialogPayload) {}
}

export const SAVE_AS_CONNECTOR_ATTEMPT = '[Connector] Save as attempt';
export class SaveAsConnectorAttemptAction implements Action {
    readonly type = SAVE_AS_CONNECTOR_ATTEMPT;
    constructor(public payload: SaveAsDialogPayload, public navigateTo = false) {}
}

export type ConnectorActions =
    | ShowConnectorsAction
    | UploadConnectorAttemptAction
    | GetConnectorsAttemptAction
    | GetConnectorsSuccessAction
    | GetConnectorAttemptAction
    | GetConnectorSuccessAction
    | CreateConnectorAttemptAction
    | UpdateConnectorContentAttemptAction
    | UpdateConnectorSuccessAction
    | DeleteConnectorAttemptAction
    | DeleteConnectorSuccessAction;
