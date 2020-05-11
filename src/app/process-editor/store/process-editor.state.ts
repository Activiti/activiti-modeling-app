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

import { createEntityAdapter } from '@ngrx/entity';
import { Process, LogMessage, GeneralError, BpmnElement } from '@alfresco-dbp/modeling-shared/sdk';

export function createSelectedElement(element): SelectedProcessElement {
    return {
        id: element.id,
        type: element.type,
        name: element.businessObject && element.businessObject.name || '',
        get processId() {
            if (element.businessObject && element.businessObject.$parent) {
                if (element.businessObject.$parent.$type === BpmnElement.SubProcess) {
                    return element.businessObject.$parent.$parent.id;
                } else if (element.type === BpmnElement.Participant) {
                    return getProcessRefId(element);
                }
                return element.businessObject.$parent.id;
            }
        }
    };
}

export function getProcessRefId(element: any) {
    return element.businessObject.processRef ? element.businessObject.processRef.id : null;
}

export interface SelectedProcessElement {
    id: string;
    type: string;
    name?: string;
    processId?: string;
}

export interface ToolbarState {
    inProgress: boolean;
    userMessage: string;
    logHistoryVisible: boolean;
    logs: LogMessage[];
}

export interface ProcessEditorState {
    loading: boolean;
    selectedElement: SelectedProcessElement;
    toolbar: ToolbarState;
    modelContext: ProcessModelContext;
}

export interface ProcessValidationResponse {
    error: string;
    errors: GeneralError[];
    message: string;
    path: string;
    status: number;
    timestamp: string;
}

export enum ProcessModelContext {
    diagram = 'model-diagram',
    bpmn = 'model-bpmn',
    extension = 'model-extension'
}

export const processAdapter = createEntityAdapter<Process>();

export function getInitialProcessEditorState(): ProcessEditorState {
    return {
        loading: false,
        selectedElement: null,
        toolbar: {
            inProgress: false,
            userMessage: '',
            logHistoryVisible: false,
            logs: []
        },
        modelContext: ProcessModelContext.diagram
    };
}
