import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from './types';

@Injectable()
export abstract class ApplicationApi {
    public abstract create(application: Partial<Application>): Observable<Application>;
    public abstract get(applicationId: string): Observable<Application>;
    public abstract update(applicationId: string, application: Partial<Application>): Observable<Application>;
    public abstract delete(applicationId: string): Observable<void>;

    public abstract import(file: File):  Observable<any>;
    public abstract export(applicationId: string): Observable<Blob>;
    public abstract getAll(): Observable<Application[]>;
}
