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
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProcessModelerServiceToken, ProcessModelerService, logError, SnackbarErrorAction } from 'ama-sdk';
import { ProcessEntitiesState } from '../store/process-entities.state';
import { SelectModelerElementAction } from '../store/process-editor.actions';
import { getProcessLogInitiator } from './process-editor.constants';
import { TranslationService } from '@alfresco/adf-core';

@Injectable()
export class ProcessDiagramLoaderService {
    constructor(
        private store: Store<ProcessEntitiesState>,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
        private translation: TranslationService
    ) {}

    load(xmlContent: string) {
        return this.processModelerService.loadXml(xmlContent).pipe(
            tap(() => {
                const element = this.createSelectedElement({ element: this.processModelerService.getRootProcessElement() });
                this.store.dispatch(new SelectModelerElementAction(element));
            }),
            catchError(error => {
                const errorMessage = this.translation.instant('PROCESS_EDITOR.ERRORS.PARSE_BPMN');
                this.store.dispatch(logError(getProcessLogInitiator(), error.message));
                this.store.dispatch(new SnackbarErrorAction(errorMessage));
                return of();
            })
        );
    }

    private createSelectedElement(event) {
        return {
            id: event.element.id,
            type: event.element.type,
            name: event.element.businessObject.name || ''
        };
    }
}
