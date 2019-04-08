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
import { Ui, UiContent } from '../../../api/types';
import { ModelApiVariation } from '../model-api';
import { ContentType } from '../content-types';
import { formatUuid } from '../../../helpers/utils/create-entries-names';

@Injectable()
export class UiApiVariation<M extends Ui, C extends UiContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.Ui;
    readonly fileType = 'application/json';

    public serialize(content: C): string {
        return JSON.stringify(content);
    }

    public createInitialContent(model: M): C {
        return <C>{
            id: formatUuid(this.contentType, model.id),
            name: model.name,
            description: model.description,
            'adf-template': 'content',
            plugins: []
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
