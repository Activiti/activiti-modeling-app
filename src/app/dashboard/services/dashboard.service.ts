import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application} from 'ama-sdk';
import { AmaApi } from 'ama-sdk';
import { EntityDialogForm } from '../../store/actions';

@Injectable()
export class DashboardService {
    constructor(private amaApi: AmaApi) {}

    fetchApplications(): Observable<Partial<Application>[]> {
        return this.amaApi.Application.getAll();
    }

    createApplication(form: Partial<EntityDialogForm>): Observable<Partial<Application>> {
        return this.amaApi.Application.create(form);
    }

    updateApplication(applicationId: string, form: Partial<EntityDialogForm>): Observable<Partial<Application>> {
        return this.amaApi.Application.update(applicationId, form);

    }

    deleteApplication(applicationId: string): Observable<void> {
        return this.amaApi.Application.delete(applicationId);
    }

    importApplication(file: File): Observable<Partial<Application>> {
        return this.amaApi.Application.import(file);
    }
}
