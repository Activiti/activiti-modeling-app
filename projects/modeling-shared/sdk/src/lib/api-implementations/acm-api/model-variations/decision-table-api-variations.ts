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

import { Injectable } from '@angular/core';
import { DecisionTableContent, DecisionTable, MinimalModelSummary, DECISION_TABLE } from '../../../api/types';
import { ContentType } from '../content-types';
import { ModelApiVariation } from '../model-api';
import { DECISION_TABLE_FILE_FORMAT } from '../../../helpers/utils/create-entries-names';
import { getEmptyDecisionTable } from '../../../helpers/utils/empty-decision-table';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';
import { extractDataFromMetadata } from './model-data-extractors/extract-data-from-metadata';

@Injectable()
export class DecisionTableApiVariation<M extends DecisionTable, C extends DecisionTableContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.DecisionTable;
    readonly retrieveModelAfterUpdate = false;

    constructor(
        private serializer: ModelContentSerializer<DecisionTableContent>,
        private dataExtractor: ModelDataExtractor<DecisionTableContent, DecisionTable>
    ) {
        serializer.register({ type: this.contentType, serialize: x => x, deserialize: x => x });
        this.dataExtractor.register({ type: DECISION_TABLE, get: extractDataFromMetadata });
    }

    public serialize(content: C): string {
        return this.serializer.serialize(content, this.contentType);
    }

    createInitialMetadata(model: Partial<MinimalModelSummary>): Partial<M> {
        return model as Partial<M>;
    }

    public createInitialContent(model: M): C {
        return <C>getEmptyDecisionTable(model);
    }

    public createSummaryPatch(model: Partial<M>, modelContent: C) {
        const { name, description } = model;
        return {
            name,
            description,
            type: this.contentType
        };
    }

    public patchModel(model: Partial<M>): M {
        return <M>model;
    }

    public getModelMimeType(model: Partial<M>): string {
        return 'text/plain';
    }

    public getModelFileName(model: Partial<M>): string {
        return model.name + DECISION_TABLE_FILE_FORMAT;
    }

    public getFileToUpload(model: Partial<M>, content: C): Blob {
        return new Blob([this.serialize(content)], { type: this.getModelMimeType(model) });
    }
}
