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

import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LogMessage } from '../store/app.state';

export interface EditorFooterService {
    userMessage$: Observable<string>;
    inProgress$: Observable<boolean>;
    logs$: Observable<LogMessage[]>;
    newErrorNumber$: Observable<number>;
    isNewError$: Observable<boolean>;

    setHistoryVisibility(visibility: boolean): void;
    clearLogs(): void;
}

export const EDITOR_FOOTER_SERVICE_TOKEN = new InjectionToken<EditorFooterService>('editor-footer-service');
