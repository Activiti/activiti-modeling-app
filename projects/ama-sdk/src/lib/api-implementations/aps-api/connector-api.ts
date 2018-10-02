import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Connector, ConnectorContent } from '../../api/types';
import { ConnectorApi } from '../../api/connector-api.interface';

@Injectable()
export class APSConnectorApi implements ConnectorApi {
    constructor() {}

    public create(connector: Partial<Connector>, applicationId: string): Observable<Connector> {
        return <Observable<Connector>>{};
    }

    public retrieve(connectorId: string): Observable<Connector> {
        return <Observable<Connector>>{};
    }

    public update(connectorId: string, content: ConnectorContent): Observable<Connector> {
        return <Observable<Connector>>{};
    }

    public delete(connectorId: string): Observable<void> {
        return <Observable<void>>{};
    }

    public getContent(connectorId: string): Observable<ConnectorContent> {
        return <Observable<ConnectorContent>>{};
    }

    public upload(file: File, applicationId: string): Observable<Connector> {
        return <Observable<Connector>>{};
    }

    public getForApplication(applicationId: string): Observable<Connector[]> {
        return of([]);
    }
}
