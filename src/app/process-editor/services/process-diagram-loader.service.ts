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

import { Injectable, Inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import {
    ProcessModelerServiceToken,
    ProcessModelerService,
    SnackbarErrorAction,
    SnackbarWarningAction,
    XmlParsingProblem,
    MESSAGE
} from 'ama-sdk';
import { ProcessEntitiesState } from '../store/process-entities.state';
import { getProcessLogInitiator } from './process-editor.constants';
import { of, Observable } from 'rxjs';
import { createSelectedElement } from '../store/process-editor.state';
import { SelectModelerElementAction } from '../store/process-editor.actions';
import { logError, logWarning } from 'ama-sdk';

@Injectable()
export class ProcessDiagramLoaderService {
    constructor(
        private store: Store<ProcessEntitiesState>,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService
    ) {}

    load(xmlContent: string): Observable<string> {
        return this.processModelerService.loadXml(xmlContent).pipe(
            tap(() => {
                const element = createSelectedElement(this.processModelerService.getRootProcessElement());
                this.store.dispatch(new SelectModelerElementAction(element));
            }),
            catchError(this.catchError.bind(this))
        );
    }

    private catchError(problem: XmlParsingProblem): Observable<void> {
        let actions: Action[] = [];

        if (problem.type === MESSAGE.ERROR) {
            actions = [
                logError(getProcessLogInitiator(), problem.messages),
                new SnackbarErrorAction('PROCESS_EDITOR.ERRORS.PARSE_BPMN')
            ];
        } else if (problem.type === MESSAGE.WARN) {
            actions = [
                logWarning(getProcessLogInitiator(), problem.messages),
                new SnackbarWarningAction('PROCESS_EDITOR.ERRORS.PARSE_BPMN')
            ];
        }

        actions.forEach(action => this.store.dispatch(action));
        return of();
    }
}
