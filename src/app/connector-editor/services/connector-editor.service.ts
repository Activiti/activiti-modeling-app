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

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
    DownloadResourceService,
    UploadFileAttemptPayload,
    EntityDialogForm,
    ConnectorContent,
    Connector,
    CONNECTOR_FILE_FORMAT,
    CONNECTOR_API_TOKEN,
    ModelApiInterface
} from 'ama-sdk';

@Injectable()
export class ConnectorEditorService {
    constructor(
        @Inject(CONNECTOR_API_TOKEN) private connectorApi: ModelApiInterface<Connector, ConnectorContent>,
        private downloadService: DownloadResourceService
    ) {}

    update(connectorId: string, model: Connector, content: ConnectorContent, projectId: string): Observable<Connector> {
        return this.connectorApi.update(connectorId, model, content, projectId);
    }

    getDetails(connectorId: string, projectId: string) {
        return this.connectorApi.retrieve(connectorId, projectId);
    }

    getContent(connectorId: string) {
        return this.connectorApi.export(connectorId);
    }

    delete(connectorId: string) {
        return this.connectorApi.delete(connectorId);
    }

    create(form: Partial<EntityDialogForm>, projectId: string): Observable<Connector> {
        return this.connectorApi.create(form, projectId);
    }

    fetchAll(projectId: string): Observable<Connector[]> {
        return this.connectorApi.getList(projectId);
    }

    upload(payload: UploadFileAttemptPayload): Observable<Partial<Connector>> {
        return this.connectorApi.import(payload.file, payload.projectId);
    }

    download(connectorName: string, connectorData: string) {
        const blob = new Blob([connectorData], { type: 'octet/stream' });
        this.downloadService.downloadResource(connectorName, blob, CONNECTOR_FILE_FORMAT);
    }

    validate(id: string, content: ConnectorContent) {
        return this.connectorApi.validate(id, content);
    }
}
