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
import { PaginatedEntries } from '@alfresco/js-api';
import { Project, AmaApi, EntityDialogForm, ServerSideSorting, FetchQueries, SearchQuery, ProjectEntityDialogForm } from '@alfresco-dbp/modeling-shared/sdk';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor(private amaApi: AmaApi) {}

    fetchProjects(pagination?: FetchQueries, sorting?: ServerSideSorting, search?: SearchQuery, fetchFavorites?: boolean): Observable<PaginatedEntries<Project>> {
        return this.amaApi.Project.getAll(pagination, sorting, search, fetchFavorites);
    }

    createProject(form: Partial<ProjectEntityDialogForm>): Observable<Partial<Project>> {
        return this.amaApi.Project.create({...form, configuration: { enableCandidateStarters: form.enableCandidateStarters}});
    }

    updateProject(projectId: string, form: Partial<EntityDialogForm>, enableCandidateStarters?: boolean): Observable<Partial<Project>> {
        return this.amaApi.Project.update(projectId, {...form, configuration: { enableCandidateStarters }});
    }

    deleteProject(projectId: string): Observable<void> {
        return this.amaApi.Project.delete(projectId);
    }

    importProject(file: File, name?: string): Observable<Partial<Project>> {
        return this.amaApi.Project.import(file, name);
    }

    saveAsProject(projectId: string, name: string): Observable<Partial<Project>> {
        return this.amaApi.Project.copy(projectId, name);
    }
}
