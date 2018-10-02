import { Injectable } from '@angular/core';
import { Application, Process } from 'ama-sdk';
import { Observable } from 'rxjs';
import { UploadFileAttemptPayload } from '../store/actions/processes';
import { AmaApi } from 'ama-sdk';
import { EntityDialogForm } from '../../store/actions';

@Injectable()
export class ApplicationEditorService {
    constructor(private amaApi: AmaApi) {}

    fetchApplication(applicationId: string): Observable<Partial<Application>> {
        return this.amaApi.Application.get(applicationId);
    }

    fetchProcesses(applicationId: string): Observable<Partial<Process>[]> {
        return this.amaApi.Process.getForApplication(applicationId);
    }

    createProcess(form: Partial<EntityDialogForm>, applicationId: string): Observable<Partial<Process>> {
        return this.amaApi.Process.create(form, applicationId);
    }

    deleteProcess(processId: string): Observable<any> {
        return this.amaApi.Process.delete(processId);
    }

    uploadProcess(payload: UploadFileAttemptPayload): Observable<Partial<Process>> {
        return this.amaApi.Process.upload(payload.file, payload.applicationId);
    }

    exportApplication(applicationId: string): Observable<Blob> {
        return this.amaApi.Application.export(applicationId);
    }
}
