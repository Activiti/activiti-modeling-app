import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data, DataContent } from './types';

@Injectable()
export abstract class DataApi {
    public abstract getForApplication(appId: string): Observable<Data[]>;
    public abstract create(form: Partial<Data>, applicationId: string): Observable<Data>;
    public abstract retrieve(formId: string): Observable<Data>;
    public abstract update(formId: string, content: DataContent): Observable<Data>;
    public abstract delete(formId: string): Observable<void>;
    public abstract getContent(formId: string): Observable<DataContent>;
    public abstract upload(file: File, applicationId: string): Observable<Data>;
}
