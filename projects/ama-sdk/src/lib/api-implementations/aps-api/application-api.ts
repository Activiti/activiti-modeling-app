import { Injectable } from '@angular/core';
import { ApplicationApi } from '../../api/application-api.interface';
import { Observable } from 'rxjs';
import { Application } from '../../api/types';
import { EntityFactory } from './entity.factory';
import { map } from 'rxjs/operators';
import { RequestApiHelper } from './request-api.helper';

@Injectable()
export class APSApplicationApi implements ApplicationApi {
    constructor(
        private entityFactory: EntityFactory,
        private requestApiHelper: RequestApiHelper
    ) {}

    public get(applicationId: string): Observable<Application> {
        return this.requestApiHelper
            .get(`/v1/applications/${applicationId}`)
                .pipe(
                    map((response: any) => response.entry),
                    map(this.entityFactory.createApplication.bind(this))
                );
    }

    public create(application: Partial<Application>): Observable<Application> {
        return this.requestApiHelper
        .post('/v1/applications/', {bodyParam: application})
            .pipe(
                map((response: any) => response.entry),
                map(this.entityFactory.createApplication.bind(this))
            );
    }

    public update(applicationId: string, application: Partial<Application>): Observable<Application> {
        return this.requestApiHelper
        .put(`/v1/applications/${applicationId}`, {bodyParam: application})
            .pipe(
                map((response: any) => response.entry),
                map(this.entityFactory.createApplication.bind(this))
            );
    }

    public delete(applicationId: string): Observable<void> {
        return this.requestApiHelper.delete(`/v1/applications/${applicationId}`);
    }

    public import(file: File ): Observable<Partial<Application>> {
        return this.requestApiHelper
            .post(`/v1/applications/import`, {formParams: {'file': file}, contentTypes: ['multipart/form-data']})
                .pipe(
                    map((response: any) => response.entry),
                    map(this.entityFactory.createApplication.bind(this))
                );
    }

    public export(applicationId: string): Observable<Blob>  {
        return this.requestApiHelper.get(
            `/v1/applications/${applicationId}/export`,
            { queryParams: { 'attachement': false }, returnType: 'Blob' }
        );
    }

    public getAll(): Observable<Application[]> {
        return this.requestApiHelper
            .get('/v1/applications')
            .pipe(
                map((nodePaging: any) => {
                    return nodePaging.list.entries
                        .map(entry => entry.entry)
                        .map(this.entityFactory.createApplication.bind(this));
                })
            );
    }
}
