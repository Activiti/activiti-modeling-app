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

import { Observable } from 'rxjs';
import { Filter, MODEL_TYPE } from '../api/types';
import { InjectionToken } from '@angular/core';

export interface FilterDataAdapter {
    expandedPredicate: (filters) => boolean;
    contents: Observable<Partial<Filter>[]>;
    loading: Observable<boolean>;
    load(projectId: string): void;
}

export type ModelFilterChildMenu = Omit<ModelFilter, 'order'> & {
    type: string;
};

export interface ModelFilter {
    type: MODEL_TYPE;
    name: string;
    icon: string;
    adapter: FilterDataAdapter;
    order: number;
    childMenus?: ModelFilterChildMenu[];
}

export const MODEL_FILTERS = new InjectionToken<ModelFilter[]>('model-filters');
