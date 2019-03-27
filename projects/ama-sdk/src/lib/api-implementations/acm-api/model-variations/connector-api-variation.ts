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
import { Connector, ConnectorContent } from '../../../api/types';
import { ContentType } from '../content-types';
import { ModelApiVariation } from '../model-api';

@Injectable()
export class ConnectorApiVariation<M extends Connector, C extends ConnectorContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.Connector;
    readonly fileType = 'application/json';

    public serialize(content: C): string {
        return JSON.stringify(content);
    }

    public createInitialContent(model: M): C {
        return <C>{
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
