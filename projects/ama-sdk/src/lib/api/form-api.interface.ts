import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Form, FormContent } from './types';

@Injectable()
export abstract class FormApi {
    public abstract getForApplication(appId: string): Observable<Form[]>;
    public abstract create(form: Partial<Form>, applicationId: string): Observable<Form>;
    public abstract retrieve(formId: string): Observable<Form>;
    public abstract update(formId: string, content: FormContent): Observable<Form>;
    public abstract delete(formId: string): Observable<void>;
    public abstract getContent(formId: string): Observable<FormContent>;
    public abstract upload(file: File, applicationId: string): Observable<Form>;
}
