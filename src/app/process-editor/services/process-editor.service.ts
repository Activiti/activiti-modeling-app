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
import { PROCESS_FILE_FORMAT, AmaApi, DownloadResourceService, Process, ProcessContent } from 'ama-sdk';

@Injectable()
export class ProcessEditorService {
    constructor(private amaApi: AmaApi, private downloadService: DownloadResourceService) {}

    updateProcess(processId: string, process: Process, processData: ProcessContent, applicationId: string): Observable<Partial<Process>> {
        return this.amaApi.Process.update(processId, process, processData, applicationId);
    }

    validateProcess(processId: string, diagramData: ProcessContent): Observable<any> {
        return this.amaApi.Process.validate(processId, diagramData);
    }

    getProcessDetails(processId: string, applicationId: string) {
        return this.amaApi.Process.retrieve(processId, applicationId);
    }

    getProcessDiagram(processId: string) {
        return this.amaApi.Process.export(processId);
    }

    downloadProcessDiagram(processName: string, processData: string) {
        const blob = new Blob([processData], { type: 'octet/stream' });
        this.downloadService.downloadResource(processName, blob, PROCESS_FILE_FORMAT);
    }
}
