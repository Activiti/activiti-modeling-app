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
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, of, zip } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import {
    GetModelsAttemptAction,
    GET_MODELS_ATTEMPT,
    GetModelsSuccessAction,
    SnackbarErrorAction,
    MODEL_TYPE,
    SHOW_MODELS,
    ShowModelsAction,
    AmaState,
    selectModelsLoaded
} from '@alfresco-dbp/modeling-shared/sdk';
import { ModelStorageService } from '../../common/services/model-storage.service';
import { Store } from '@ngrx/store';

/** @experimental  */
// TODO: Dead code at the moment, nothing uses it...
@Injectable()
export class EntityEffects {
    constructor(
        private actions$: Actions,
        private modelStorageService: ModelStorageService,
        private store: Store<AmaState>
    ) {}

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
                return EMPTY;
            }
        })
    );

    @Effect()
    getModelsEffect = this.actions$.pipe(
        ofType<GetModelsAttemptAction>(GET_MODELS_ATTEMPT),
        mergeMap(action => this.getModels(action.projectId, action.modelType))
    );

    private getModels(projectId: string, modelType: MODEL_TYPE): Observable<any | GetModelsSuccessAction> {
        return this.modelStorageService.fetchAll(projectId, modelType).pipe(
            mergeMap(models => of(new GetModelsSuccessAction(models, modelType))),
            catchError(() => this.handleError('PROJECT_EDITOR.ERROR.LOAD_MODELS')));
    }

    private handleError(userMessage: string): Observable<SnackbarErrorAction> {
        return of(new SnackbarErrorAction(userMessage));
    }
}
