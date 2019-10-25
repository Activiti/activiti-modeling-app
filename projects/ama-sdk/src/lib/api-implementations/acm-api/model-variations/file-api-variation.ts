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
import { ActivitiFileContent, ActivitiFile } from '../../../api/types';
import { ModelApiVariation } from '../model-api';
import { ContentType } from '../content-types';

@Injectable()
export class FileApiVariation<M extends ActivitiFile, C extends ActivitiFileContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.File;
    readonly fileType = 'application/octet-stream';

    public serialize(content: C): string {
        return content;
    }

    public createInitialContent(model: M): C {
        return <C>'';
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
}

