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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    AmaApi,
    DownloadResourceService,
    UploadFileAttemptPayload,
    EntityDialogForm,
    ConnectorContent,
    Connector,
    CONNECTOR_FILE_FORMAT
} from 'ama-sdk';

@Injectable()
export class ConnectorEditorService {
    constructor(private amaApi: AmaApi, private downloadService: DownloadResourceService) {}

    update(connectorId: string, model: Connector, content: ConnectorContent, projectId: string): Observable<Connector> {
        return this.amaApi.Connector.update(connectorId, model, content, projectId);
    }

    getDetails(connectorId: string, projectId: string) {
        return this.amaApi.Connector.retrieve(connectorId, projectId);
    }

    getContent(connectorId: string) {
        return this.amaApi.Connector.export(connectorId);
    }

    delete(connectorId: string) {
        return this.amaApi.Connector.delete(connectorId);
    }

    create(form: Partial<EntityDialogForm>, appId: string): Observable<Connector> {
        return this.amaApi.Connector.create(form, appId);
    }

    fetchAll(projectId: string): Observable<Connector[]> {
        return this.amaApi.Connector.getList(projectId);
    }

    upload(payload: UploadFileAttemptPayload): Observable<Partial<Connector>> {
        return this.amaApi.Connector.import(payload.file, payload.projectId);
    }

    download(connectorName: string, connectorData: string) {
        const blob = new Blob([connectorData], { type: 'octet/stream' });
        this.downloadService.downloadResource(connectorName, blob, CONNECTOR_FILE_FORMAT);
    }

    validate(id: string, content: ConnectorContent) {
        return this.amaApi.Connector.validate(id, content);
    }
}
