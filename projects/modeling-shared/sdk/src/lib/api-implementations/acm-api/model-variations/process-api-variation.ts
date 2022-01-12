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
import { ContentType } from '../content-types';
import { ModelApiVariation } from '../model-api';
import { Process, ProcessContent, MinimalModelSummary, PROCESS } from '../../../api/types';
import { getEmptyDiagram } from '../../../helpers/utils/empty-diagram';
import { PROCESS_FILE_FORMAT } from '../../../helpers/utils/create-entries-names';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';
import { extractProcessData } from './model-data-extractors/process-data-extractor';
const shortid = require('shortid');

@Injectable()
export class ProcessApiVariation<M extends Process, C extends ProcessContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.Process;
    readonly retrieveModelAfterUpdate = false;

    constructor(
        private serializer: ModelContentSerializer<ProcessContent>,
        private dataExtractor: ModelDataExtractor<ProcessContent, Process>
    ) {
        serializer.register({ type: this.contentType, serialize: x => x, deserialize: x => x });
        this.dataExtractor.register({ type: PROCESS, get: extractProcessData });
    }

    public serialize(content: C): string {
        return this.serializer.serialize(content, this.contentType);
    }

    public createInitialMetadata(model: Partial<MinimalModelSummary>): Partial<M> {
        const processId = 'Process_' + shortid();

        return {
            ...model,
            extensions: {
                [processId]: {
                    constants: {},
                    mappings: {},
                    properties: {},
                    assignments: {}
                }
            }
        } as Partial<M>;
    }

    public createInitialContent(model: M): C {
        return <C>getEmptyDiagram(model, Object.keys(model.extensions)[0]);
    }

    public createSummaryPatch(model: Partial<M>, modelContent: C) {
        const { name, description, extensions } = model;
        return {
            name,
            description,
            extensions,
            type: this.contentType
        };
    }

    public patchModel(model: Partial<M>): M {
        return {
            ...<M>model,
            extensions: {
                ...model.extensions
            }
        };
    }

    public getModelMimeType(model: Partial<M>): string {
        return 'text/plain';
    }

    public getModelFileName(model: Partial<M>): string {
        return model.name + PROCESS_FILE_FORMAT;
    }

    public getFileToUpload(model: Partial<M>, content: C): Blob {
        return new Blob([this.serialize(content)], { type: this.getModelMimeType(model) });
    }
}
