/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
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

import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LogFactoryService } from '../../../services/log-factory.service';
import { SnackbarErrorAction } from '../../../store/app.actions';
import { AmaState } from '../../../store/app.state';

@Injectable({
    providedIn: 'root'
})
export class JuelExpressionSimulatorService {

    constructor(private alfrescoApiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private store: Store<AmaState>,
        private logFactory: LogFactoryService) {
    }

    private logInitiator = {
        key: 'JUEL expression simulator',
        displayName: 'SDK.EXPRESSION_CODE_EDITOR.JUEL_EXPRESSION_SIMULATOR'
    };

    private getHostName(): string {
        return this.appConfigService.get('bpmHost', '').match(/^(?:https?:)?(?:\/\/)?([^\/\?]+)/g)[0];
    }

    /**
    * Gets Simulated result for the requested payload
    * @param expression The JUEL expression to be evaluated
    * @param variables A key value map containing the variable values for the simulation
    * @return return `Observable of the evaluated expression`
    */
    getSimulationResult(expression: string, variables: { [key: string]: any }): Observable<any> {
        const url = `${this.getHostName()}/modeling-service/v1/juel`;
        const api = this.alfrescoApiService.getInstance().oauth2Auth;

        const apiCall = api.callCustomApi(url, 'POST', null, null, null, null, { expression, variables }, ['application/json'], ['application/json']);

        return from(apiCall).pipe(
            map((response: { result: any; }) => response.result),
            catchError((error: Error) => {
                const errorMessage = JSON.parse(error.message);
                if (Array.isArray(errorMessage)) {
                    this.logError(errorMessage.flatMap((e) => {
                        return e.severity ? (e.message + ' ' + e.severity) : e.error || JSON.stringify(e);
                    }).join('\n '), errorMessage);
                } else {
                    this.logError(errorMessage.error || JSON.stringify(errorMessage), errorMessage);
                }
                return throwError(error);
            })
        );
    }

    private logError(errorMessage: string, error: any) {
        this.store.dispatch(this.logFactory.logError(this.logInitiator, JSON.stringify(error, null, 4)));
        this.store.dispatch(new SnackbarErrorAction(errorMessage));
    }
}
