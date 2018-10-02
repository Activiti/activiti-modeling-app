import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Form, FormContent } from '../../api/types';
import { FormApi } from '../../api/form-api.interface';

@Injectable()
export class APSFormApi implements FormApi {
    constructor() {}

    public getForApplication(applicationId: string): Observable<Form[]> {
        return of([]);
    }

    public create(form: Partial<Form>, formId: string): Observable<Form> {
        return <Observable<Form>>{};
    }

    public retrieve(formId: string): Observable<Form> {
        return <Observable<Form>>{};
    }

    public update(formId: string, content: FormContent): Observable<Form> {
        return <Observable<Form>>{};
    }

    public delete(formId: string): Observable<void> {
        return <Observable<void>>{};
    }

    public getContent(formId: string): Observable<FormContent> {
        return <Observable<FormContent>>{};
    }

    public upload(file: File, applicationId: string): Observable<Form> {
        return <Observable<Form>>{};
    }
}
