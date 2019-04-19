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
import { Project, AmaApi, EntityDialogForm, Release } from 'ama-sdk';

@Injectable()
export class DashboardService {
    constructor(private amaApi: AmaApi) {}

    fetchProjects(): Observable<Partial<Project>[]> {
        return this.amaApi.Project.getAll();
    }

    createProject(form: Partial<EntityDialogForm>): Observable<Partial<Project>> {
        return this.amaApi.Project.create(form);
    }

    updateProject(projectId: string, form: Partial<EntityDialogForm>): Observable<Partial<Project>> {
        return this.amaApi.Project.update(projectId, form);
    }

    deleteProject(projectId: string): Observable<void> {
        return this.amaApi.Project.delete(projectId);
    }

    importProject(file: File): Observable<Partial<Project>> {
        return this.amaApi.Project.import(file);
    }

    releaseProject(projectId: string): Observable<Release> {
        return this.amaApi.Project.release(projectId);
    }
}
