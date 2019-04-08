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
import { formatUuid } from '../../../helpers/utils/create-entries-names';
import { ModelApiVariation } from '../model-api';
import { Form, FormContent } from '../../../api/types';
import { createEmptyForm } from '../form-definition';

@Injectable()
export class FormApiVariation<M extends Form, C extends FormContent> implements ModelApiVariation<M, C> {
    readonly contentType = ContentType.Form;
    readonly fileType = 'application/json';

    public serialize(content: C): string {
        return JSON.stringify(content);
    }

    public createInitialContent(model: M): C {
        return <C>createEmptyForm(formatUuid(ContentType.Form, model.id), model.name, model.description);
    }

    public createSummaryPatch(model: Partial<M>, {formRepresentation}: C) {
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
}
