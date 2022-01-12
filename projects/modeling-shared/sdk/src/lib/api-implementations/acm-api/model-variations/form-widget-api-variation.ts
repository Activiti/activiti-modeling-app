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
import { FORM_WIDGET, Widget, WidgetContent } from '../../../api/types';
import { FORM_WIDGET_FILE_FORMAT } from '../../../helpers/utils/create-entries-names';
import { ContentType } from '../content-types';
import { ModelApiVariation } from '../model-api';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';
import { extractDataFromContent } from './model-data-extractors/extract-data-from-content';

@Injectable()
export class FormWidgetApiVariation<M extends Widget, C extends WidgetContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.CustomFormWidget;
    readonly retrieveModelAfterUpdate = false;

    constructor(
        private serializer: ModelContentSerializer<WidgetContent>,
        private dataExtractor: ModelDataExtractor<WidgetContent, Widget>
    ) {
        serializer.register({ type: this.contentType, serialize: JSON.stringify, deserialize: JSON.parse });
        this.dataExtractor.register({ type: FORM_WIDGET, get: extractDataFromContent });
    }

    public serialize(content: C): string {
        return this.serializer.serialize(content, this.contentType);
    }

    createInitialMetadata(model: Partial<M>): Partial<M> {
        return {
            ...model,
            extensions: this.getInitialContent(model)
        } as Partial<M>;
    }

    public createInitialContent(model: M): C {
        return <C> { id: model.id, ...this.getInitialContent(model) };
    }

    public createSummaryPatch(model: Partial<M>, modelContent: C) {
        const { name, description } = modelContent;
        return {
            name,
            description,
            extensions: modelContent
        };
    }

    public patchModel(model: Partial<M>): M {
        return <M>model;
    }

    public getModelMimeType(model: Partial<M>): string {
        return 'application/json';
    }

    public getModelFileName(model: Partial<M>): string {
        return model.name + FORM_WIDGET_FILE_FORMAT;
    }

    public getFileToUpload(model: Partial<M>, content: C): Blob {
        return new Blob([this.serialize(content)], { type: this.getModelMimeType(model) });
    }

    private getInitialContent(model: Partial<M>) {
        return {
            name: model.name,
            description: model.description,
            type:  model.extensions?.type || model.name,
            isCustomType: true,
            valueType: 'string',
            icon: model.extensions?.icon,
            className: ''
        };
    }
}
