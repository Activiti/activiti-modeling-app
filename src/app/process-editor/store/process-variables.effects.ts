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

import { OpenProcessVariablesDialogAction, OPEN_PROCESS_VARIABLES_DIALOG, UpdateProcessVariablesAction, UPDATE_PROCESS_VARIABLES } from './process-variables.actions';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { switchMap, tap, take, map, mergeMap } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { LogService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import {
    AmaState,
    DialogService,
    BaseEffects,
    SetAppDirtyStateAction,
    EntityProperties,
    selectSelectedTheme,
    ProcessModelerServiceToken,
    ProcessModelerService,
    VariablesComponent,
    selectSelectedProcess,
    BpmnCompositeProperty
} from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { Subject, of, zip } from 'rxjs';

@Injectable()
export class ProcessVariablesEffects extends BaseEffects {

    constructor(
        private actions$: Actions,
        protected logService: LogService,
        protected router: Router,
        private dialogService: DialogService,
        @Inject(ProcessModelerServiceToken) private modelerService: ProcessModelerService,
        private store: Store<AmaState>
    ) {
        super(router, logService);
    }

    @Effect({ dispatch: false })
    openProcessVariablesDialogEffect = this.actions$.pipe(
        ofType<OpenProcessVariablesDialogAction>(OPEN_PROCESS_VARIABLES_DIALOG),
        switchMap((action) => zip(of(action), this.store.select(selectSelectedProcess).pipe(take(1)))),
        tap(([action, model]) => {
            const processExtension = model.extensions[action.processId];
            return this.openVariablesDialog(model.id, action.processId, processExtension ? processExtension.properties : {});
        })
    );

    @Effect()
    updateProcessVariablesEffect = this.actions$.pipe(
        ofType<UpdateProcessVariablesAction>(UPDATE_PROCESS_VARIABLES),
        map(action => {
            const shapeId = this.modelerService.getRootProcessElement().id;
            this.modelerService.updateElementProperty(shapeId, BpmnCompositeProperty.properties, action.payload.properties);
        }),
        mergeMap(() => of(new SetAppDirtyStateAction(true)))
    );

    private openVariablesDialog(modelId: string, processId: string, properties: EntityProperties) {
        const propertiesUpdate$ = new Subject<EntityProperties>();
        const title = 'PROCESS_EDITOR.ELEMENT_PROPERTIES.PROCESS_VARIABLES';
        const required = true;
        const columns = [ 'name', 'type', 'required', 'value', 'delete' ];

        const theme$ = this.store.select(selectSelectedTheme).pipe(
            map(theme => (theme.className === 'dark-theme' ? 'vs-dark' : 'vs-light'))
        );

        this.dialogService.openDialog(VariablesComponent, {
            disableClose: true,
            height: '530px',
            width: '1000px',
            data: { properties, title, columns, required, propertiesUpdate$, theme$ },
        });

        propertiesUpdate$.subscribe(data => {
            this.store.dispatch(new UpdateProcessVariablesAction({ modelId, processId, properties: data }));
        });
    }
}
