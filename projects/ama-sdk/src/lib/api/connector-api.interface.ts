import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Connector, ConnectorContent } from './types';

@Injectable()
export abstract class ConnectorApi {
    public abstract create(connector: Partial<Connector>, applicationId: string): Observable<Connector>;
    public abstract retrieve(connectorId: string): Observable<Connector>;
    public abstract update(connectorId: string, content: ConnectorContent): Observable<Connector>;
    public abstract delete(connectorId: string): Observable<void>;
    public abstract upload(file: File, applicationId: string): Observable<Connector>;
    public abstract getContent(connectorId: string): Observable<ConnectorContent>;
    public abstract getForApplication(applicationId: string): Observable<Connector[]>;
}
