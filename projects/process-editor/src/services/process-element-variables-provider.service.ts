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

import {
    AmaApi,
    ElementVariable,
    ProcessEditorElementVariablesProvider,
    ProcessEditorElementWithVariables,
    selectProcessPropertiesArrayFor
} from '@alfresco-dbp/modeling-shared/sdk';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProcessElementVariablesProviderService implements ProcessEditorElementVariablesProvider {

    constructor(private store: Store<AmaApi>) { }

    getHandledTypes(): ProcessEditorElementWithVariables[] {
        return [ProcessEditorElementWithVariables.Process];
    }

    getOutputVariables(element: Bpmn.DiagramElement): Observable<ElementVariable[]> {
        return this.getVariablesFromElement(element);
    }

    getInputVariables(element: Bpmn.DiagramElement): Observable<ElementVariable[]> {
        return this.getVariablesFromElement(element);
    }

    getVariablesFromElement(element: Bpmn.DiagramElement): Observable<ElementVariable[]> {
        if (!element.id) {
            return of([]);
        }
        const processDefinitionKey = element.id;
        return this.store.select(selectProcessPropertiesArrayFor(processDefinitionKey)).pipe(
            map(variables => {
                if (variables) {
                    return variables.map(variable => ({ id: variable.id, name: variable.name, description: variable.description, type: variable.type, model: variable.model }));
                }
                return [];
            })
        );
    }
}
