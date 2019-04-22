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
import { ProjectApi } from '../../api/project-api.interface';
import { Observable } from 'rxjs';
import { Project, PROJECT, Release } from '../../api/types';
import { map } from 'rxjs/operators';
import { RequestApiHelper } from './request-api.helper';

export interface BackendProject {
    id: string;
    name: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    version: string;
}

@Injectable()
export class ACMProjectApi implements ProjectApi {
    constructor(
        private requestApiHelper: RequestApiHelper
    ) {}

    public get(projectId: string): Observable<Project> {
        return this.requestApiHelper
            .get(`/v1/projects/${projectId}`)
                .pipe(
                    map((response: any) => response.entry),
                    map(this.createProject.bind(this))
                );
    }

    public create(project: Partial<Project>): Observable<Project> {
        return this.requestApiHelper
        .post('/v1/projects/', {bodyParam: project})
            .pipe(
                map((response: any) => response.entry),
                map(this.createProject.bind(this))
            );
    }

    public update(projectId: string, project: Partial<Project>): Observable<Project> {
        return this.requestApiHelper
        .put(`/v1/projects/${projectId}`, {bodyParam: project})
            .pipe(
                map((response: any) => response.entry),
                map(this.createProject.bind(this))
            );
    }

    public delete(projectId: string): Observable<void> {
        return this.requestApiHelper.delete(`/v1/projects/${projectId}`);
    }

    public import(file: File ): Observable<Partial<Project>> {
        return this.requestApiHelper
            .post(`/v1/projects/import`, {formParams: {'file': file}, contentTypes: ['multipart/form-data']})
                .pipe(
                    map((response: any) => response.entry),
                    map(this.createProject.bind(this))
                );
    }

    public export(projectId: string): Observable<Blob>  {
        return this.requestApiHelper.get(
            `/v1/projects/${projectId}/export`,
            { queryParams: { 'attachment': false }, responseType: 'blob' }
        );
    }

    public getAll(): Observable<Project[]> {
        return this.requestApiHelper
            .get('/v1/projects')
            .pipe(
                map((nodePaging: any) => {
                    return nodePaging.list.entries
                        .map(entry => entry.entry)
                        .map(this.createProject.bind(this));
                })
            );
    }

    private createProject(backendProject: BackendProject): Project {
        const type = PROJECT,
            description = '';

        return {
            type,
            ...backendProject,
            description
        };
    }

    public release(projectId: string): Observable<Release> {
        return this.requestApiHelper
        .post(`/v1/projects/${projectId}/releases`)
            .pipe(
                map((response: any) => response.entry)
            );
    }
}
