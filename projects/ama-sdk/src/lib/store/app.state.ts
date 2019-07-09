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

import { ModelIdentifier } from './project.actions';

export interface AppTheme {
    name: string;
    className: string;
}
export interface AppState {
    menuOpened: boolean;
    selectedProjectId: string | null;
    openedModel: ModelIdentifier;
    selectedTheme: AppTheme;
    dirtyState: boolean;
    toolbar: ToolbarState;
    logs: LogMessage[];
}

export interface AmaState {
    app: AppState;
}

export interface ToolbarState {
    inProgress: boolean;
    userMessage: string;
    logHistoryVisible: boolean;
}

export interface LogMessage {
    type: MESSAGE;
    datetime: Date;
    initiator: LogMessageInitiator;
    messages: string[];
}

export enum MESSAGE {
    INFO = 'info',
    WARN = 'warning',
    ERROR = 'error'
}

export interface LogMessageInitiator {
    key: string | Symbol;
    displayName: string;
    extra?: any;
}

