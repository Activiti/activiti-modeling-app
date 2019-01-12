 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

 import { Process, ProcessContent } from 'ama-sdk';

export interface SelectedProcessElement {
    id: string;
    type: string;
    name?: string;
}

export interface ProcessEditorState {
    loading: boolean;
    process: Process;
    diagram: ProcessContent;
    selectedElement: SelectedProcessElement;
    dirty: boolean;
}

export const INITIAL_PROCESS_EDITOR_STATE: ProcessEditorState = {
    loading: false,
    process: null,
    diagram: null,
    selectedElement: null,
    dirty: false
};
