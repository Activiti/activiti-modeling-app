import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Process, ProcessDiagramData } from './types';

@Injectable()
export abstract class ProcessApi {
    public abstract create(process: Partial<Process>, applicationId: string): Observable<Process>;
    public abstract retrieve(processId: string, extenstions: boolean): Observable<Process>;
    public abstract update(processId: string, process: Partial<Process>): Observable<Process>;
    public abstract delete(processId: string): Observable<void>;
    public abstract upload(file: File, applicationId: string): Observable<Process>;

    public abstract getDiagram(processId: string): Observable<ProcessDiagramData>;
    public abstract saveDiagram(processId: string, data: ProcessDiagramData): Observable<void>;
    public abstract getForApplication(applicationId: string): Observable<Process[]>;
}
