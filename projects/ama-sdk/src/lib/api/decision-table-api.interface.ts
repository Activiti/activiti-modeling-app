import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DecisionTable, DecisionTableContent } from './types';

@Injectable()
export abstract class DecisionTableApi {
    public abstract getForApplication(appId: string): Observable<DecisionTable[]>;
    public abstract create(form: Partial<DecisionTable>, applicationId: string): Observable<DecisionTable>;
    public abstract retrieve(formId: string): Observable<DecisionTable>;
    public abstract update(formId: string, content: DecisionTableContent): Observable<DecisionTable>;
    public abstract delete(formId: string): Observable<void>;
    public abstract getContent(formId: string): Observable<DecisionTableContent>;
    public abstract upload(file: File, applicationId: string): Observable<DecisionTable>;
}
