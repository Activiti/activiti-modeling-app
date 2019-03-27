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
import { Process, ProcessContent } from '../../../api/types';
import { getEmptyDiagram } from '../../../helpers/utils/empty-diagram';

@Injectable()
export class ProcessApiVariation<M extends Process, C extends ProcessContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.Process;
    readonly fileType = 'text/plain';

    public serialize(content: C): string {
        return content;
    }

    public createInitialContent(model: M): C {
        return <C>getEmptyDiagram(model);
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
        return <M>{
            extensions: {},
            ...<object>model
        };
    }
}
