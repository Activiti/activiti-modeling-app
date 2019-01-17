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
import { ApplicationApi } from '../../api/application-api.interface';
import { Observable } from 'rxjs';
import { Application, APPLICATION } from '../../api/types';
import { map } from 'rxjs/operators';
import { RequestApiHelper } from './request-api.helper';

export interface BackendApplication {
    id: string;
    name: string;
    creationDate: Date;
    createdBy: string;
    lastModifiedDate: Date;
    lastModifiedBy: string;
}

@Injectable()
export class ACMApplicationApi implements ApplicationApi {
    constructor(
        private requestApiHelper: RequestApiHelper
    ) {}

    public get(applicationId: string): Observable<Application> {
        return this.requestApiHelper
            .get(`/v1/projects/${applicationId}`)
                .pipe(
                    map((response: any) => response.entry),
                    map(this.createApplication.bind(this))
                );
    }

    public create(application: Partial<Application>): Observable<Application> {
        return this.requestApiHelper
        .post('/v1/projects/', {bodyParam: application})
            .pipe(
                map((response: any) => response.entry),
                map(this.createApplication.bind(this))
            );
    }

    public update(applicationId: string, application: Partial<Application>): Observable<Application> {
        return this.requestApiHelper
        .put(`/v1/projects/${applicationId}`, {bodyParam: application})
            .pipe(
                map((response: any) => response.entry),
                map(this.createApplication.bind(this))
            );
    }

    public delete(applicationId: string): Observable<void> {
        return this.requestApiHelper.delete(`/v1/projects/${applicationId}`);
    }

    public import(file: File ): Observable<Partial<Application>> {
        return this.requestApiHelper
            .post(`/v1/projects/import`, {formParams: {'file': file}, contentTypes: ['multipart/form-data']})
                .pipe(
                    map((response: any) => response.entry),
                    map(this.createApplication.bind(this))
                );
    }

    public export(applicationId: string): Observable<Blob>  {
        return this.requestApiHelper.get(
            `/v1/projects/${applicationId}/export`,
            { queryParams: { 'attachment': false }, returnType: 'Blob' }
        );
    }

    public getAll(): Observable<Application[]> {
        return this.requestApiHelper
            .get('/v1/projects')
            .pipe(
                map((nodePaging: any) => {
                    return nodePaging.list.entries
                        .map(entry => entry.entry)
                        .map(this.createApplication.bind(this));
                })
            );
    }

    private createApplication(backendApplication: BackendApplication): Application {
        const type = APPLICATION,
            description = '',
            version = '0.0.1';

        return {
            type,
            ...backendApplication,
            description,
            version
        };
    }
}
