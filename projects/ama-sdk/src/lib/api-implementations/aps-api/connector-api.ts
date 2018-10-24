import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Connector, ConnectorContent } from '../../api/types';
import { ConnectorApi } from '../../api/connector-api.interface';
import { RequestApiHelper, RequestApiHelperOptions } from '../../api-implementations/aps-api/request-api.helper';
import { EntityFactory } from './entity.factory';
import { ContentType } from './content-types';
import { map, concatMap } from 'rxjs/operators';
import { BackendConnector } from './backend-types';

@Injectable()
export class APSConnectorApi implements ConnectorApi {
    constructor(
        private entityFactory: EntityFactory,
        private requestApiHelper: RequestApiHelper
    ) {
    }

    public create(connector: Partial<Connector>, applicationId: string): Observable<Connector> {
        return this.requestApiHelper
            .post(`/v1/applications/${applicationId}/models`, { bodyParam: { ...connector, type: ContentType.Connector }})
            .pipe(
                map((response: { entry: BackendConnector }) => this.entityFactory.createConnector(response.entry, applicationId))
            );
    }

    public retrieve(connectorId: string, applicationId: string): Observable<Connector> {
        return this.requestApiHelper.get(`/v1/models/${connectorId}`).pipe(
            map((response: { entry: BackendConnector }) => this.entityFactory.createConnector(response.entry, applicationId))
        );
    }

    public update(connectorId: string, content: ConnectorContent, applicationId: string): Observable<Connector> {
        const file = new Blob([JSON.stringify(content)], {type: 'application/json'});
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file },
            queryParams: { type: ContentType.Connector },
            contentTypes: ['multipart/form-data']
        };
        return this.requestApiHelper
            .put(`/v1/models/${connectorId}`, { bodyParam: { ...content, type: 'CONNECTOR' }}).pipe(
                concatMap(() => this.requestApiHelper.put(`/v1/models/${connectorId}/content`, requestOptions))
            );

    }

    public delete(connectorId: string): Observable<void> {
        return this.requestApiHelper.delete(`/v1/models/${connectorId}`);
    }

    public getContent(connectorId: string): Observable<ConnectorContent> {
        return this.requestApiHelper.get(`/v1/models/${connectorId}/content`, { returnType: 'string' }).pipe(
            map( (response: string) => JSON.parse(response))
        );
    }

    public upload(file: File, applicationId: string): Observable<Connector> {
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file },
            queryParams: { type: ContentType.Connector },
            contentTypes: ['multipart/form-data']
        };

        return this.requestApiHelper.post(`/v1/applications/${applicationId}/models/import`, requestOptions).pipe(
            map((response: { entry: BackendConnector }) => {
                return this.entityFactory.createConnector(response.entry, applicationId);
            })
        );
    }

    public getForApplication(applicationId: string): Observable<Connector[]> {
        return this.requestApiHelper.get(`/v1/applications/${applicationId}/models`, { queryParams: { type: ContentType.Connector } }).pipe(
            map((nodePaging: any) => {
                return nodePaging.list.entries
                    .map(entry => entry.entry)
                    .map((entry) => this.entityFactory.createConnector(entry, applicationId));
            })
        );
    }
}
