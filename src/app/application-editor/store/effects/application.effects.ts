 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { BaseEffects, OpenConfirmDialogAction, Blob2JsonService, SnackbarErrorAction, DownloadResourceService } from 'ama-sdk';
import { ApplicationEditorService } from '../../services/application-editor.service';
import {
    GetApplicationAttemptAction,
    GET_APPLICATION_ATTEMPT,
    GetApplicationSuccessAction,
    ExportApplicationAction,
    EXPORT_APPLICATION,
} from '../application-editor.actions';

@Injectable()
export class ApplicationEffects extends BaseEffects {
    constructor(
        private actions$: Actions,
        private applicationEditorService: ApplicationEditorService,
        protected logService: LogService,
        protected router: Router,
        protected downloadService: DownloadResourceService,
        protected blob2json: Blob2JsonService
    ) {
        super(router, logService);
    }

    @Effect()
    getApplicationEffect = this.actions$.pipe(
        ofType<GetApplicationAttemptAction>(GET_APPLICATION_ATTEMPT),
        map((action: GetApplicationAttemptAction) => action.payload),
        switchMap(applicationId => this.getApplication(applicationId))
    );

    @Effect()
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

    private exportApplication(applicationId: string, name: string) {
        return this.applicationEditorService.exportApplication(applicationId).pipe(
            switchMap(response => {
                this.downloadService.downloadResource(name, response, '.zip');
                return of();
            }),
            catchError(response => this.genericErrorHandler(this.handleValidationError.bind(this, response), response))
        );
    }

    private handleValidationError(response: any): Observable<OpenConfirmDialogAction> {
        return this.blob2json.convert(response.error.response.body).pipe(
            switchMap(body => of(new OpenConfirmDialogAction({
                dialogData: {
                    title: body.message,
                    subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                    errors: body.errors.map(error => error.description)
                }
            })))
        );
    }

    private handleError(userMessage: string) {
        return of(new SnackbarErrorAction(userMessage));
    }
}
