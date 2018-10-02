import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Data, DataContent } from '../../api/types';
import { DataApi } from '../../api/data-api.interface';

@Injectable()
export class APSDataApi implements DataApi {
    constructor() {}

    public getForApplication(applicationId: string): Observable<Data[]> {
        return of([]);
    }

    public create(datum: Partial<Data>, datumId: string): Observable<Data> {
        return <Observable<Data>>{};
    }

    public retrieve(datumId: string): Observable<Data> {
        return <Observable<Data>>{};
    }

    public update(datumId: string, content: DataContent): Observable<Data> {
        return <Observable<Data>>{};
    }

    public delete(datumId: string): Observable<void> {
        return <Observable<void>>{};
    }

    public getContent(datumId: string): Observable<DataContent> {
        return <Observable<DataContent>>{};
    }

    public upload(file: File, applicationId: string): Observable<Data> {
        return <Observable<Data>>{};
    }
}
