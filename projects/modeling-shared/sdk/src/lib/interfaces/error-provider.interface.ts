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
import { MODEL_TYPE } from '../api/types';

export interface ExtensionError {
    name: string;
    code?: string;
}

export interface ExtensionErrorGroup {
    type: string;
    name: string;
    errors: ExtensionError[];
}

export type ExtensionErrorGroupsProvider = () => Observable<ExtensionErrorGroup[]>;
export type ExtensionErrorPrepareEntities = (projectId: string) => void;

export interface ExtensionErrorProviderInterface {
    modelType?: MODEL_TYPE;
    getErrors(): Observable<ExtensionErrorGroup[]>;
    prepareEntities(projectId: string): void;
}

export const ErrorProvidersToken = new InjectionToken<ExtensionErrorProviderInterface[]>('error-providers');

export function getExtensionErrorProvider(handler: Type<ExtensionErrorProviderInterface>): Provider[] {
    return [
        handler,
        { provide: ErrorProvidersToken, useValue: handler, multi: true }
    ];
}
