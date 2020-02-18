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
import { FilterDataAdapter, MODEL_FILTERS, ModelFilter } from '@alfresco-dbp/modeling-shared/sdk';
const orderBy = require('lodash/orderBy');

@Injectable()
export class ProjectTreeHelper {
    constructor(@Inject(MODEL_FILTERS) private filters: ModelFilter[]) {}

    getFilters(): ModelFilter[] {
        return orderBy(this.filters, ['order'], ['asc']);
    }

    getDataAdapter(filterType: string): FilterDataAdapter {
        const selectedFilter = this.filters.filter((filter => filter.type === filterType))[0];
        return selectedFilter.adapter;
    }
}
