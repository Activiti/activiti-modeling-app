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
import { formatUuid, FORM_FILE_FORMAT } from '../../../helpers/utils/create-entries-names';
import { ModelApiVariation } from '../model-api';
import { FORM, Form, FormContent, MinimalModelSummary } from '../../../api/types';
import { createEmptyForm } from '../form-definition';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';
import { extractFormData } from './model-data-extractors/form-data-extractor';

@Injectable()
export class FormApiVariation<M extends Form, C extends FormContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.Form;
    readonly retrieveModelAfterUpdate = true;

    constructor(
        private serializer: ModelContentSerializer<FormContent>,
        private dataExtractor: ModelDataExtractor<FormContent, Form>
    ) {
        serializer.register({ type: this.contentType, serialize: JSON.stringify, deserialize: JSON.parse });
        this.dataExtractor.register({ type: FORM, get: extractFormData });
    }

    public serialize(content: C): string {
        return this.serializer.serialize(content, this.contentType);
    }

    createInitialMetadata(model: Partial<MinimalModelSummary>): Partial<M> {
        return model as Partial<M>;
    }

    public createInitialContent(model: M): C {
        return <C>createEmptyForm(formatUuid(ContentType.Form, model.id), model.name, model.description);
    }

    public createSummaryPatch(_model: Partial<M>, { formRepresentation }: C) {
        const { name, description } = formRepresentation;
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
        return 'application/json';
    }

    public getModelFileName(model: Partial<M>): string {
        return model.name + FORM_FILE_FORMAT;
    }

    public getFileToUpload(model: Partial<M>, content: C): Blob {
        return new Blob([this.serialize(content)], { type: this.getModelMimeType(model) });
    }
}
