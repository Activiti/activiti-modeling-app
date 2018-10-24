import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DecisionTable, DecisionTableContent } from '../../api/types';
import { DecisionTableApi } from '../../api/decision-table-api.interface';

@Injectable()
export class APSDecisionTableApi implements DecisionTableApi {
    constructor() {}

    public getForApplication(applicationId: string): Observable<DecisionTable[]> {
        return of([]);
    }

    public create(decisionTable: Partial<DecisionTable>, decisionTableId: string): Observable<DecisionTable> {
        return <Observable<DecisionTable>>{};
    }

    public retrieve(decisionTableId: string): Observable<DecisionTable> {
        return <Observable<DecisionTable>>{};
    }

    public update(decisionTableId: string, content: DecisionTableContent): Observable<DecisionTable> {
        return <Observable<DecisionTable>>{};
    }

    public delete(decisionTableId: string): Observable<void> {
        return <Observable<void>>{};
    }

    public getContent(decisionTableId: string): Observable<DecisionTableContent> {
        return <Observable<DecisionTableContent>>{};
    }

    public upload(file: File, applicationId: string): Observable<DecisionTable> {
        return <Observable<DecisionTable>>{};
    }
}
