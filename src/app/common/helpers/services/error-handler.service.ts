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

import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';
import { Store } from '@ngrx/store';
import { SnackbarErrorAction } from '@alfresco-dbp/modeling-shared/sdk';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error: Error | HttpErrorResponse) {

        const errorService = this.injector.get(ErrorService);
        const store = this.injector.get(Store);

        let message;

        if (error instanceof HttpErrorResponse) {
            message = errorService.getServerMessage(error);
            store.dispatch(new SnackbarErrorAction(message));
        } else {
            if (!this.isFailedECMLogin(error)) {
                message = errorService.getClientMessage(error);
                store.dispatch(new SnackbarErrorAction(message));
            }
        }
        console.error(error);
    }

    private isFailedECMLogin(error: any): boolean {
        let isFailedECMLoginError = false;
        if ( error.rejection && error.rejection.error && error.rejection.error.url) {
            isFailedECMLoginError = error.rejection.error.url.includes('authentication/versions/1/tickets/-me-');
        }
        return isFailedECMLoginError;
    }
}
