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
    PROCESS_FILE_FORMAT,
    PROCESS_SVG_FILE_FORMAT,
    DownloadResourceService,
    Process,
    ProcessContent,
    EntityDialogForm,
    UploadFileAttemptPayload,
    PROCESS_API_TOKEN,
    ModelApiInterface,
    formatUuid,
    ContentType,
    ModelExtensions
} from '@alfresco-dbp/modeling-shared/sdk';

@Injectable()
export class ProcessEditorService {
    constructor(
        @Inject(PROCESS_API_TOKEN) private processApi: ModelApiInterface<Process, ProcessContent>,
        private downloadService: DownloadResourceService) {}

    getAll(projectId: string): Observable<Process[]> {
        return this.processApi.getList(projectId);
    }

    create(form: Partial<EntityDialogForm>, projectId: string): Observable<Process> {
        return this.processApi.create(form, projectId);
    }

    delete(processId: string): Observable<any> {
        return this.processApi.delete(processId);
    }

    upload(payload: UploadFileAttemptPayload): Observable<Process> {
        return this.processApi.import(payload.file, payload.projectId);
    }

    update(processId: string, process: Process, processData: ProcessContent, projectId: string): Observable<Partial<Process>> {
        return this.processApi.update(processId, process, processData, projectId);
    }

    validate(processId: string, diagramData: ProcessContent, projectId: string, extensionsContent: ModelExtensions): Observable<Partial<Process>> {
        const extensions = {
            id: formatUuid(ContentType.Process, processId),
            extensions: extensionsContent
        };

        return this.processApi.validate(processId, diagramData, projectId, extensions);
    }

    getDetails(processId: string, projectId: string) {
        return this.processApi.retrieve(processId, projectId);
    }

    getDiagram(processId: string) {
        return this.processApi.export(processId);
    }

    downloadDiagram(processName: string, processData: string) {
        const blob = new Blob([processData], { type: 'octet/stream' });
        this.downloadService.downloadResource(processName, blob, PROCESS_FILE_FORMAT);
    }

    downloadSVGImage(processName: string, processData: string) {
        const blob = new Blob([processData], { type: 'octet/stream' });
        this.downloadService.downloadResource(processName, blob, PROCESS_SVG_FILE_FORMAT);
    }
}
