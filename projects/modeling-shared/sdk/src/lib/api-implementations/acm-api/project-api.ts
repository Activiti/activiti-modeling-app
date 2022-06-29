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
import { Project, PROJECT, Release, Pagination, ReleaseEntry, ServerSideSorting, SearchQuery, CollaboratorEntry, FetchQueries, ReleaseInfo } from '../../api/types';
import { map } from 'rxjs/operators';
import { RequestApiHelper } from './request-api.helper';
import { ValidationErrors } from '../../interfaces/validation-errors.interface';
import { PaginatedEntries } from '@alfresco/js-api';
import { IdentityUserModel } from '@alfresco/adf-process-services-cloud';

export interface BackendProject {
    id: string;
    name: string;
    description: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    version: string;
    favorite: boolean;
}

@Injectable()
export class ACMProjectApi implements ProjectApi {

    constructor(
        private requestApiHelper: RequestApiHelper
    ) {}

    public get(projectId: string): Observable<Project> {
        return this.requestApiHelper
            .get(`/modeling-service/v1/projects/${projectId}`)
            .pipe(
                map((response: any) => response.entry),
                map(this.createProject.bind(this))
            );
    }

    public validate(projectId: string): Observable<void | ValidationErrors> {
        return this.requestApiHelper.get(`/modeling-service/v1/projects/${projectId}/validate`, { responseType: 'blob' });
    }

    public create(project: Partial<Project>): Observable<Project> {
        return this.requestApiHelper
            .post('/modeling-service/v1/projects/', { bodyParam: project })
            .pipe(
                map((response: any) => response.entry),
                map(this.createProject.bind(this))
            );
    }

    public update(projectId: string, project: Partial<Project>): Observable<Project> {
        return this.requestApiHelper
            .put(`/modeling-service/v1/projects/${projectId}`, { bodyParam: project })
            .pipe(
                map((response: any) => response.entry),
                map(this.createProject.bind(this))
            );
    }

    public copy(projectId: string, name: string): Observable<Project> {
        return this.requestApiHelper
            .post(`/modeling-service/v1/projects/${projectId}/copy`, { queryParams: { 'name': name } } )
            .pipe(
                map((response: any) => response.entry),
                map(this.createProject.bind(this))
            );
    }

    public delete(projectId: string): Observable<void> {
        return this.requestApiHelper.delete(`/modeling-service/v1/projects/${projectId}`);
    }

    public addToFavorites(projectId: string): Observable<void> {
        return this.requestApiHelper.put(`/modeling-service/v1/projects/${projectId}/favorites`);
    }

    public removeFromFavorites(projectId: string): Observable<void> {
        return this.requestApiHelper.delete(`/modeling-service/v1/projects/${projectId}/favorites`);
    }

    public import(file: File, name?: string): Observable<Partial<Project>> {
        const postData: any = { formParams: { 'file': file }, contentTypes: ['multipart/form-data'] };

        if (name) {
            postData.formParams.name = name;
        }

        return this.requestApiHelper
            .post(`/modeling-service/v1/projects/import`, postData)
            .pipe(
                map((response: any) => response.entry),
                map(this.createProject.bind(this))
            );
    }

    public export(projectId: string): Observable<Blob> {
        return this.requestApiHelper.get(
            `/modeling-service/v1/projects/${projectId}/export`,
            { queryParams: { 'attachment': false }, responseType: 'blob' }
        );
    }

    public getAll(
        fetchQueries: FetchQueries = {},
        sorting: ServerSideSorting = { key: 'name', direction: 'asc' },
        search: SearchQuery = { key: 'name', value: '' },
        fetchFavorites: boolean
    ): Observable<PaginatedEntries<Project>> {
        let queryParams;
        if (!fetchFavorites) {
            queryParams = {
                ...fetchQueries,
                sort: `${sorting.key},${sorting.direction}`,
                [search.key]: search.value
            };
        } else {
            queryParams = {
                ...fetchQueries,
                sort: `${sorting.key},${sorting.direction}`,
                [search.key]: search.value,
                filters: 'favorites'
            };
        }

        return this.requestApiHelper
            .get('/modeling-service/v1/projects', { queryParams })
            .pipe(
                map((nodePaging: any) => ({
                    pagination: nodePaging.list.pagination,
                    entries: nodePaging.list.entries.map(entry => this.createProject(entry.entry))
                }))
            );
    }

    private createProject(backendProject: BackendProject): Project {
        const type = PROJECT;

        return {
            type,
            ...backendProject
        };
    }

    public release(projectId: string, releaseInfo?: ReleaseInfo): Observable<Release> {
        return this.requestApiHelper
            .post(`/modeling-service/v1/projects/${projectId}/releases`, { bodyParam: releaseInfo })
            .pipe(
                map((response: any) => response.entry)
            );
    }

    public getProjectReleases(
        projectId: string,
        pagination: Partial<Pagination> = {},
        sorting: ServerSideSorting = { key: 'creationDate', direction: 'desc' },
        showAllVersions: boolean = true
    ): Observable<PaginatedEntries<ReleaseEntry>> {
        const queryParams = {
            showAllVersions: showAllVersions,
            ...pagination,
            sort: `${sorting.key},${sorting.direction}`
        };
        return this.requestApiHelper
            .get(`/modeling-service/v1/projects/${projectId}/releases`, { queryParams: queryParams })
            .pipe(
                map((nodePaging: any) => ({
                    pagination: nodePaging.list.pagination,
                    entries: nodePaging.list.entries
                }))
            );
    }

    public getCollaborators(projectId: string): Observable<PaginatedEntries<CollaboratorEntry>> {
        return this.requestApiHelper
            .get(`/modeling-service/v1/projects/${projectId}/collaborators`)
            .pipe(
                map((nodePaging: any) => ({
                    pagination: nodePaging.list.pagination,
                    entries: nodePaging.list.entries
                }))
            );
    }

    public addCollaborator(projectId: string, collaborator: IdentityUserModel): Observable<CollaboratorEntry> {
        return this.requestApiHelper
            .put(`/modeling-service/v1/projects/${projectId}/collaborators/${collaborator.username}`);
    }

    public removeCollaborator(projectId: string, collaborator: IdentityUserModel): Observable<void> {
        return this.requestApiHelper
            .delete(`/modeling-service/v1/projects/${projectId}/collaborators/${collaborator.username}`);
    }

    public downloadRelease(releaseId: string): Observable<Blob> {
        return this.requestApiHelper.get(
            `/modeling-service/v1/releases/${releaseId}/export`,
            { queryParams: { 'attachment': false }, responseType: 'blob' }
        );
    }

    public uploadRelease(projectId: string, file: File): Observable<Release> {
        const postData: any = { formParams: { 'file': file }, contentTypes: ['multipart/form-data'] };

        return this.requestApiHelper
            .post(`/modeling-service/v1/projects/${projectId}/releases/upload`, postData)
            .pipe(
                map((response: any) => response.entry)
            );
    }

    public restoreRelease(releaseId: string): Observable<Release> {
        return this.requestApiHelper
            .post(`/modeling-service/v1/releases/${releaseId}/restore`)
            .pipe(
                map((response: any) => response.entry)
            );
    }

    public updateRelease(release: Release): Observable<Release> {
        return this.requestApiHelper
            .put(`/modeling-service/v1/releases/${release.id}`, { bodyParam: release })
            .pipe(
                map((response: any) => response.entry)
            );
    }
}
