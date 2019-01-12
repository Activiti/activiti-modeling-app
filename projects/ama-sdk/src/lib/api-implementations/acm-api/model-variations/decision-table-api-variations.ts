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

import { Injectable, InjectionToken } from '@angular/core';
import { DecisionTableContent, DecisionTable } from '../../../api/types';
import { ContentType } from '../content-types';
import { formatUuid } from '../../../helpers/create-entries-names';
import { ModelApiVariation, ModelApi } from '../model-api';

export const DECISION_TABLE_API = new InjectionToken<ModelApi<DecisionTable, DecisionTableContent>>('connector-api');

@Injectable()
export class DecisionTableApiVariation<M extends DecisionTable, C extends DecisionTableContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.DecisionTable;
    readonly fileType = 'application/json';

    public serialize(content: C): string {
        return JSON.stringify(content);
    }

    public createInitialContent(model: M): C {
        return <C>{
            id: formatUuid(this.contentType, model.id),
            name: model.name,
            description: model.description
        };
    }

    public createSummaryPatch(model: Partial<M>, modelContent: C) {
        const { name, description } = modelContent;
        return {
            name,
            description,
            type: this.contentType
        };
    }

    public patchModel(model: Partial<M>): M {
        return <M>model;
    }
}
