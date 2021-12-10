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

import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JSONSchemaInfoBasics } from '../api/types';
import { InputTypeItem, INPUT_TYPE_ITEM_HANDLER } from '../variables/properties-viewer/value-type-inputs/value-type-inputs';
import { ModelingJsonSchema, ModelingJsonSchemaProvider, ModelsWithJsonSchemaMap } from './modeling-json-schema-provider.service';

@Injectable({
    providedIn: 'root'
})
export class RegisteredInputsModelingJsonSchemaProvider extends ModelingJsonSchemaProvider<JSONSchemaInfoBasics> {

    constructor(@Inject(INPUT_TYPE_ITEM_HANDLER) private inputTypeItemHandler: InputTypeItem[]) {
        super();
    }

    getProviderName(): string {
        return 'registered-inputs';
    }

    isGlobalProvider() {
        return true;
    }

    protected retrieveModels(projectId: string): Observable<ModelsWithJsonSchemaMap<JSONSchemaInfoBasics>> {
        const result: ModelsWithJsonSchemaMap<JSONSchemaInfoBasics> = {};
        const handlersWithModel = this.inputTypeItemHandler.filter(handler => !!handler.model);
        handlersWithModel.forEach(handler => result[handler.type] = handler.model);

        return of(result);
    }

    protected transformModelToJsonSchemas(projectId: string, handlerId: string, handlerModel: JSONSchemaInfoBasics): ModelingJsonSchema[] {
        return [
            {
                projectId,
                schema: handlerModel,
                typeId: [handlerId]
            }
        ];
    }
}
