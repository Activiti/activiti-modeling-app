import { Injectable } from '@angular/core';
import { ProcessApi } from '../../api/process-api.interface';
import { Observable } from 'rxjs';
import { Process, ProcessDiagramData } from '../../api/types';
import { EntityFactory } from './entity.factory';
import { map } from 'rxjs/operators';
import { RequestApiHelper, RequestApiHelperOptions } from '../../api-implementations/aps-api/request-api.helper';
import { BackendProcess } from './backend-types';

@Injectable()
export class APSProcessApi implements ProcessApi {
    constructor(
        private entityFactory: EntityFactory,
        private requestApiHelper: RequestApiHelper
    ) {}

    public create(process: Partial<Process>, applicationId: string): Observable<Process> {
        return this.requestApiHelper
            .post(`/v1/applications/${applicationId}/models`, { bodyParam: { ...process, type: 'PROCESS' }})
            .pipe(
                map((response: { entry: BackendProcess }) => response.entry),
                map(this.entityFactory.createProcess.bind(this))
            );
    }

    public update(processId: string, process: Partial<Process>): Observable<Process> {
        return this.requestApiHelper
            .put(`/v1/models/${processId}`, { bodyParam: { ...process, type: 'PROCESS' }})
            .pipe(
                map((response: { entry: BackendProcess }) => response.entry),
                map(this.entityFactory.createProcess.bind(this))
            );
    }

    public delete(processId: string): Observable<void> {
        return this.requestApiHelper.delete(`/v1/models/${processId}`);
    }

    public retrieve(processId: string, extensions: boolean): Observable<Process> {
        return this.requestApiHelper.get(`/v1/models/${processId}`, { queryParams: { extensions } }).pipe(
            map((response: { entry: BackendProcess }) => response.entry),
            map(this.entityFactory.createProcess.bind(this))
        );
    }

    public getDiagram(processId: string): Observable<ProcessDiagramData> {
        return this.requestApiHelper.get(`/v1/models/${processId}/content`, { returnType: 'text' }).pipe(
            map((response: any) => <ProcessDiagramData>response),
        );
    }

    public saveDiagram(processId: string, diagramData: ProcessDiagramData): Observable<void> {
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file: new Blob([diagramData], { type: 'text/plain' }) },
            contentTypes: [ 'multipart/form-data' ]
        };

        return this.requestApiHelper.put(`/v1/models/${processId}/content`, requestOptions);
    }

    public upload(file: File, applicationId: string): Observable<Process> {
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file },
            queryParams: { type: 'PROCESS' },
            contentTypes: ['multipart/form-data']
        };

        return this.requestApiHelper.post(`/v1/applications/${applicationId}/models/import`, requestOptions).pipe(
            map((response: { entry: BackendProcess }) => response.entry),
            map(this.entityFactory.createProcess.bind(this))
        );
    }

    public getForApplication(applicationId: string): Observable<Process[]> {
        return this.requestApiHelper.get(`/v1/applications/${applicationId}/models`, { queryParams: { type: 'PROCESS' } }).pipe(
            map((nodePaging: any) => {
                return nodePaging.list.entries
                    .map(entry => entry.entry)
                    .map(this.entityFactory.createProcess.bind(this));
            })
        );
    }
}
