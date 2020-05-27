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
import { ContentModel, ContentModelXML, MinimalModelSummary } from '../../../api/types';
import { ModelApiVariation } from '../model-api';
import { ContentType } from '../content-types';
import { CONTENT_MODEL_FILE_FORMAT } from '../../../helpers/utils/create-entries-names';
import { getEmptyContentModel } from '../../../helpers/utils/empty-content-model';
import { AuthenticationService } from '@alfresco/adf-core';

@Injectable()
export class ModelContentApiVariation<M extends ContentModel, C extends ContentModelXML> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.Model;
    readonly retrieveModelAfterUpdate = false;

    constructor(private authenticationService: AuthenticationService) {
    }

    public serialize(content: C): string {
        return content;
    }

    createInitialMetadata(model: Partial<MinimalModelSummary>): Partial<M> {
        return model as Partial<M>;
    }

    public createInitialContent(model: M): C {
        return <C>getEmptyContentModel(model, this.authenticationService.getBpmUsername());
    }

    public createSummaryPatch(model: Partial<M>, modelContent: C) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(modelContent, 'text/xml');

        return {
            name: this.getNameFromXML(xmlDoc),
            description: this.getDescriptionFromXML(xmlDoc),
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
        return model.name + CONTENT_MODEL_FILE_FORMAT;
    }

    public getFileToUpload(model: Partial<M>, content: C): Blob {
        return new Blob([this.serialize(content)], { type: this.getModelMimeType(model) });
    }

    private getNameFromXML(xmlDoc: Document): string {
        let name = '';
        const nodes = xmlDoc.getElementsByTagName('model');
        if (nodes.length > 0) {
            name = nodes[0].getAttribute('name');
            name = name.substr(name.indexOf(':') + 1);
        }
        return name;
    }

    private getDescriptionFromXML(xmlDoc: Document): string {
        let description = '';
        const nodes = xmlDoc.getElementsByTagName('description');
        if (nodes.length > 0) {
            description = nodes[0].textContent;
        }
        return description;
    }
}
