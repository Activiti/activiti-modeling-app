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
import { Project, AmaApi, ValidationErrors } from '@alfresco-dbp/modeling-shared/sdk';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectEditorService {
    constructor(private amaApi: AmaApi) {}

    fetchProject(projectId: string): Observable<Partial<Project>> {
        return this.amaApi.Project.get(projectId);
    }

    exportProject(projectId: string): Observable<Blob> {
        return this.amaApi.Project.export(projectId);
    }

    validateProject(projectId: string): Observable<void | ValidationErrors> {
        return this.amaApi.Project.validate(projectId);
    }
}
