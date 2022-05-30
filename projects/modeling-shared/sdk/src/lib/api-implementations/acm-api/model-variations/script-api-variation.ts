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
import { ActivitiScriptContent, ActivitiScript, MinimalModelSummary, SCRIPT } from '../../../api/types';
import { ModelApiVariation } from '../model-api';
import { ContentType } from '../content-types';
import { SCRIPT_FILE_FORMAT } from '../../../helpers/utils/create-entries-names';
import { getEmptyScript } from '../../../helpers/utils/empty-script';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';
import { extractDataFromMetadata } from './model-data-extractors/extract-data-from-metadata';

@Injectable()
export class ScriptApiVariation<M extends ActivitiScript, C extends ActivitiScriptContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.Script;
    readonly retrieveModelAfterUpdate = true;

    constructor(
        private serializer: ModelContentSerializer<ActivitiScriptContent>,
        private dataExtractor: ModelDataExtractor<ActivitiScriptContent, ActivitiScript>
    ) {
        serializer.register({ type: this.contentType, serialize: x => x, deserialize: x => x });
        this.dataExtractor.register({ type: SCRIPT, get: extractDataFromMetadata });
    }

    public serialize(content: C): string {
        return this.serializer.serialize(content, this.contentType);
    }

    createInitialMetadata(model: Partial<MinimalModelSummary>): Partial<M> {
        return model as Partial<M>;
    }

    public createInitialContent(model: M): C {
        return <C>getEmptyScript(model);
    }

    public createSummaryPatch(model: Partial<M>) {
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
        let mimeType = 'application/octet-stream';
        if (model.extensions && model.extensions.content && model.extensions.content.mimeType) {
            mimeType = model.extensions.content.mimeType;
        }
        return mimeType;
    }

    public getModelFileName(model: Partial<M>): string {
        let filename = model.name + SCRIPT_FILE_FORMAT;
        if (model.extensions && model.extensions.name) {
            filename = model.extensions.name;
        }
        return filename;
    }

    public getFileToUpload(model: Partial<M>, content: C): Blob {
        return new Blob([this.serialize(content)], { type: this.getModelMimeType(model) });
    }
}
