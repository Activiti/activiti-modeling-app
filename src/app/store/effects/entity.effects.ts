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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, zip } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import {
    BaseEffects,
    GetModelsAttemptAction,
    GET_MODELS_ATTEMPT,
    GetModelsSuccessAction,
    SnackbarErrorAction,
    MODEL_TYPE,
    SHOW_MODELS,
    ShowModelsAction,
    AmaState,
    selectModelsLoaded
} from 'ama-sdk';
import { LogService } from '@alfresco/adf-core';
import { ModelStorageService } from '../../common/services/model-storage.service';
import { Store } from '@ngrx/store';

@Injectable()
export class EntityEffects extends BaseEffects {
    constructor(
        private actions$: Actions,
        private modelStorageService: ModelStorageService,
        private store: Store<AmaState>,
        logService: LogService,
        router: Router
    ) {
        super(router, logService);
    }

    @Effect()
    showModelsEffect = this.actions$.pipe(
        ofType<ShowModelsAction>(SHOW_MODELS),
        mergeMap(action => zip(
            of(action),
            this.store.select(selectModelsLoaded(this.modelStorageService.getStorageKey(action.modelType)))
        )),
        mergeMap(([action, loaded]) => {
            if (!loaded) {
                return of(new GetModelsAttemptAction(action.projectId, action.modelType));
            } else {
                return of();
            }
        })
    );

    @Effect()
    getModelsEffect = this.actions$.pipe(
        ofType<GetModelsAttemptAction>(GET_MODELS_ATTEMPT),
        mergeMap(action => this.getModels(action.projectId, action.modelType))
    );

    private getModels(projectId: string, modelType: MODEL_TYPE): Observable<{} | GetModelsSuccessAction> {
        return this.modelStorageService.fetchAll(projectId, modelType).pipe(
            mergeMap(models => of(new GetModelsSuccessAction(models, modelType))),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROJECT.ERROR.LOAD_MODELS'), e)
            )
        );
    }

    private handleError(userMessage): Observable<SnackbarErrorAction> {
        return of(new SnackbarErrorAction(userMessage));
    }
}
