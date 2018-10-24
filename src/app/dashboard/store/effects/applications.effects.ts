import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { LogService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { switchMap, catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BaseEffects } from 'ama-sdk';
import {
    GetApplicationsAttemptAction,
    GET_APPLICATIONS_ATTEMPT,
    GetApplicationsSuccessAction,
    CreateApplicationSuccessAction,
    UpdateApplicationAttemptAction,
    UPDATE_APPLICATION_ATTEMPT,
    UpdateApplicationSuccessAction,
    DeleteApplicationAttemptAction,
    DELETE_APPLICATION_ATTEMPT,
    DeleteApplicationSuccessAction,
    ShowApplicationsAction,
    SHOW_APPLICATIONS,
    UploadApplicationAttemptAction,
    UPLOAD_APPLICATION_ATTEMPT,
    UploadApplicationSuccessAction
} from '../actions/applications';
import { Store, Action } from '@ngrx/store';
import { AmaState, CreateApplicationAttemptAction, CREATE_APPLICATION_ATTEMPT, } from 'ama-sdk';
import { Application, SnackbarErrorAction, SnackbarInfoAction } from 'ama-sdk';
import { selectApplicationsLoaded } from '../selectors/dashboard.selectors';
import { EntityDialogForm } from 'ama-sdk';

@Injectable()
export class ApplicationsEffects extends BaseEffects {
    constructor(
        private actions$: Actions,
        private dashboardService: DashboardService,
        private store: Store<AmaState>,
        logService: LogService,
        router: Router,
    ) {
        super(router, logService);
    }

    @Effect()
    showApplicationsEffect = this.actions$.pipe(
        ofType<ShowApplicationsAction>(SHOW_APPLICATIONS),
        withLatestFrom(this.store.select(selectApplicationsLoaded)),
        switchMap(([action, applicationsLoaded]) => {
            if (!applicationsLoaded) {
                return of(new GetApplicationsAttemptAction());
            } else {
                return of();
            }
        })
    );

    @Effect()
    uploadApplicationAttemptEffect = this.actions$.pipe(
        ofType<UploadApplicationAttemptAction>(UPLOAD_APPLICATION_ATTEMPT),
        map(action => action.file),
        switchMap(file => this.uploadApplication(file))
    );

    @Effect()
    createApplicationAttemptEffect = this.actions$.pipe(
        ofType<CreateApplicationAttemptAction>(CREATE_APPLICATION_ATTEMPT),
        map(action => action.payload),
        mergeMap(payload => this.createApplication(payload))
    );

    @Effect()
    updateApplicationAttemptEffect = this.actions$.pipe(
        ofType<UpdateApplicationAttemptAction>(UPDATE_APPLICATION_ATTEMPT),
        map(action => action.payload),
        mergeMap(payload => this.updateApplication(payload.id, payload.form))
    );

    @Effect()
    deleteApplicationAttemptEffect = this.actions$.pipe(
        ofType<DeleteApplicationAttemptAction>(DELETE_APPLICATION_ATTEMPT),
        map(action => action.payload),
        mergeMap(applicationId => this.deleteApplication(applicationId))
    );

    @Effect()
    getApplicationsAttemptEffect = this.actions$.pipe(
        ofType<GetApplicationsAttemptAction>(GET_APPLICATIONS_ATTEMPT),
        switchMap(() => this.getApplicationsAttempt())
    );

    private deleteApplication(applicationId: string): Observable<Partial<Application>> {
        return this.dashboardService.deleteApplication(applicationId).pipe(
            switchMap(() => [
                new DeleteApplicationSuccessAction(applicationId),
                new SnackbarInfoAction('APP.HOME.NEW_MENU.APP_DELETED')
            ]),
            catchError<any, SnackbarErrorAction>(e =>
                this.genericErrorHandler(
                    () => of(new SnackbarErrorAction('APP.APPLICATION.ERROR.DELETE_APPLICATION')),
                    e
                )
            )
        );
    }

    private updateApplication(applicationId: string, form: Partial<EntityDialogForm>): Observable<Partial<Application>> {
        return this.dashboardService.updateApplication(applicationId, form).pipe(
            switchMap(application => [
                new UpdateApplicationSuccessAction(application),
                new SnackbarInfoAction('APP.HOME.NEW_MENU.APP_UPDATED')
            ]),
            catchError<any, SnackbarErrorAction>(e =>
                this.genericErrorHandler(this.handleApplicationUpdateError.bind(this, e), e)
            )
        );
    }

    private createApplication(form: Partial<EntityDialogForm>): Observable<Partial<Application>> {
        return this.dashboardService.createApplication(form).pipe(
            switchMap(application => [
                new CreateApplicationSuccessAction(application),
                new SnackbarInfoAction('APP.HOME.NEW_MENU.APP_CREATED')
            ]),
            catchError<any, SnackbarErrorAction>(e =>
                this.genericErrorHandler(this.handleApplicationCreateError.bind(this, e), e)
            )
        );
    }

    private getApplicationsAttempt(): Observable<Action | Action[]> {
        return this.dashboardService.fetchApplications().pipe(
            switchMap(applications => [new GetApplicationsSuccessAction(applications)]),
            catchError<any, SnackbarErrorAction>(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.HOME.ERROR.LOAD_APPLICATIONS'), e)
            )
        );
    }

    private uploadApplication(file: File) {
        return this.dashboardService.importApplication(file).pipe(
            switchMap(application => [
                new UploadApplicationSuccessAction(application),
                new SnackbarInfoAction('APP.HOME.NEW_MENU.APP_UPLOADED')
            ]),
            catchError<any, SnackbarErrorAction>(e =>
                this.genericErrorHandler(this.handleApplicationUploadError.bind(this, e), e)
            )
        );
    }

    private handleApplicationCreateError(error): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'APP.APPLICATION.ERROR.CREATE_APPLICATION.DUPLICATION';
        } else {
            errorMessage = 'APP.APPLICATION.ERROR.CREATE_APPLICATION.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleApplicationUpdateError(error): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'APP.APPLICATION.ERROR.UPDATE_APPLICATION.DUPLICATION';
        } else {
            errorMessage = 'APP.APPLICATION.ERROR.UPDATE_APPLICATION.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleApplicationUploadError(error): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'APP.APPLICATION.ERROR.UPLOAD_APPLICATION.DUPLICATION';
        } else {
            errorMessage = 'APP.APPLICATION.ERROR.UPLOAD_APPLICATION.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleError(userMessage) {
        return of(new SnackbarErrorAction(userMessage));
    }
}
