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
    AmaState,
    BpmnProperty,
    ElementVariable,
    EntityProperty,
    ProcessEditorElementVariablesProvider,
    ProcessEditorElementWithVariables,
    ProcessExtensionsModel,
    selectProcessesArray
} from '@alfresco-dbp/modeling-shared/sdk';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CalledElementVariablesProviderService implements ProcessEditorElementVariablesProvider {

    constructor(private store: Store<AmaState>) { }

    getHandledTypes(): ProcessEditorElementWithVariables[] {
        return [ProcessEditorElementWithVariables.CalledElement];
    }

    getOutputVariables(element: Bpmn.DiagramElement): Observable<ElementVariable[]> {
        return this.getVariablesFromElement(element);
    }

    getInputVariables(element: Bpmn.DiagramElement): Observable<ElementVariable[]> {
        return this.getVariablesFromElement(element);
    }

    getVariablesFromElement(element: Bpmn.DiagramElement): Observable<ElementVariable[]> {
        const processDefinitionId = element.businessObject[BpmnProperty.calledElement];
        if (!processDefinitionId) {
            return of([]);
        }

        return this.store.select(selectProcessesArray).pipe(
            map(processes => {
                const selectedExternalProcess = processes.find((process) => !!process.extensions[processDefinitionId]);
                let variables: EntityProperty[] = [];
                if (selectedExternalProcess) {
                    variables = Object.values(new ProcessExtensionsModel(selectedExternalProcess.extensions).getProperties(processDefinitionId));
                }
                return variables;
            })
        );
    }
}
