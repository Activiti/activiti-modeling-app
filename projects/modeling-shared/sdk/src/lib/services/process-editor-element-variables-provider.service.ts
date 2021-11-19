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

import { InjectionToken, Provider, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { ElementVariable, ProcessEditorElementWithVariables } from '../api/types';

export const PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS = new InjectionToken<ProcessEditorElementVariablesProvider[]>('process-editor-element-variables-providers');

export interface ProcessEditorElementVariablesProvider {
    getHandledTypes(): ProcessEditorElementWithVariables[];
    getOutputVariables(element: Bpmn.DiagramElement): Observable<ElementVariable[]>;
    getInputVariables(element: Bpmn.DiagramElement): Observable<ElementVariable[]>;
}

export function provideProcessEditorElementVariablesProvider(implementationClass: Type<ProcessEditorElementVariablesProvider>): Provider {
    return {
        provide: PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS,
        useClass: implementationClass,
        multi: true
    };
}
