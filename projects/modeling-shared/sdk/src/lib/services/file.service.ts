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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AmaApi } from '../api/api.interface';
import { ActivitiFile, ActivitiFileContent } from '../api/types';
import { EntityDialogForm, UploadFileAttemptPayload } from '../helpers/common';
import { DownloadResourceService } from './download-resource.service';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    constructor(
        private amaApi: AmaApi,
        private downloadService: DownloadResourceService
    ) {}

    create(file: Partial<EntityDialogForm>, projectId: string): Observable<ActivitiFile> {
        return this.amaApi.File.create(file, projectId);
    }

    update(id: string, file: Partial<ActivitiFile>, content: ActivitiFileContent, projectId: string): Observable<ActivitiFile> {
        return this.amaApi.File.update(id, file, content, projectId, true);
    }

    updateContentFile(id: string, file: File): Observable<[ActivitiFile, ActivitiFileContent]> {
        return this.amaApi.File.updateContentFile(id, file, 'blob');
    }

    getDetails(fileId: string): Observable<ActivitiFile> {
        return this.amaApi.File.retrieve(fileId);
    }

    getContent(fileId: string): Observable<File> {
        return this.amaApi.File.export(fileId, 'blob');
    }

    delete(fileId: string) {
        return this.amaApi.File.delete(fileId);
    }

    getForProject(projectId: string): Observable<ActivitiFile[]> {
        return this.amaApi.File.getList(projectId);
    }

    upload(payload: UploadFileAttemptPayload): Observable<Partial<ActivitiFile>> {
        return this.amaApi.File.import(payload.file, payload.projectId);
    }

    download(filename: string, blob: Blob) {
        this.downloadService.downloadResourceWithFilename(filename, blob);
    }

    validate(fileId: string, fileContent: ActivitiFileContent, projectId: string, metadata: string): Observable<any> {
        return this.amaApi.File.validate(fileId, fileContent, projectId, metadata);
    }

    getFileList(projectId: string): Observable<ActivitiFile[]> {
        return this.amaApi.File.getList(projectId);
    }
}
