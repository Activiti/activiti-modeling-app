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
import { Widget, WidgetContent } from '../../../api/types';
import { FORM_WIDGET_FILE_FORMAT } from '../../../helpers/utils/create-entries-names';
import { ContentType } from '../content-types';
import { ModelApiVariation } from '../model-api';

@Injectable()
export class FormWidgetApiVariation<M extends Widget, C extends WidgetContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.CustomFormWidget;
    readonly retrieveModelAfterUpdate = false;

    public serialize(content: C): string {
        return JSON.stringify(content);
    }

    createInitialMetadata(model: Partial<M>): Partial<M> {
        return {
            ...model,
            extensions: {
                name: model.name,
                description: model.description,
                type:  model.extensions?.type || model.name,
                isCustomType: true,
                valueType: 'string',
                icon: model.extensions?.icon,
                className: ''
            }
        } as Partial<M>;
    }

    public createInitialContent(model: M): C {
        return <C> {
                name: model.name,
                description: model.description,
                type: model.type,
                isCustomType: true
        };
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
}
