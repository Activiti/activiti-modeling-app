import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { BaseEffects } from '../../../common/helpers/base.effects';
import {
    GetApplicationAttemptAction,
    GET_APPLICATION_ATTEMPT,
    GetApplicationSuccessAction,
    ExportApplicationAction,
    EXPORT_APPLICATION
} from '../actions/application';
import { SnackbarErrorAction } from '../../../store/actions';
import { ApplicationEditorService } from '../../services/application-editor.service';
import { DownloadResourceService } from '../../../common/services/download-resource';

@Injectable()
export class ApplicationEffects extends BaseEffects {
    constructor(
        private actions$: Actions,
        private applicationEditorService: ApplicationEditorService,
        protected logService: LogService,
        protected router: Router,
        protected downloadService: DownloadResourceService
    ) {
        super(router, logService);
    }

    @Effect()
    getApplicationEffect = this.actions$.pipe(
        ofType<GetApplicationAttemptAction>(GET_APPLICATION_ATTEMPT),
        map((action: GetApplicationAttemptAction) => action.payload),
        switchMap(applicationId => this.getApplication(applicationId))
    );

    @Effect({ dispatch: false })
    exportApplicatonEffect = this.actions$.pipe(
        ofType<ExportApplicationAction>(EXPORT_APPLICATION),
        map((action: ExportApplicationAction) => action.payload),
        switchMap(payload => this.exportApplication(payload.applicationId, payload.applicationName))
    );

    private getApplication(applicationId: string) {
        return this.applicationEditorService.fetchApplication(applicationId).pipe(
            switchMap(application => of(new GetApplicationSuccessAction(application))),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.APPLICATION.ERROR.GET_APPLICATION'), e)
            )
        );
    }

    private handleError(userMessage) {
        return of(new SnackbarErrorAction(userMessage));
    }

    private exportApplication(applicationId: string, name: string) {
        return this.applicationEditorService.exportApplication(applicationId).pipe(
            map((response => {
                this.downloadService.downloadResource(name, response, '.zip');
            })
        ));
    }
}
