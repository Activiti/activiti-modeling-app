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
import { Observable, of } from 'rxjs';
import { arrayModelType } from './expression-language/array.model.type';
import { contentMetadataModelType } from './expression-language/content-metadata.model.type';
import { contentModelType } from './expression-language/content.model.type';
import { dateModelType } from './expression-language/date.model.type';
import { fileModelType } from './expression-language/file.model.type';
import { folderModelType } from './expression-language/folder.model.type';
import { jsonModelType } from './expression-language/json.model.type';
import { stringModelType } from './expression-language/string.model.type';
import { ModelingTypeProvider, ModelingTypeMap } from './modeling-type-provider.service';

@Injectable({
    providedIn: 'root'
})
export class PrimitiveModelingTypesService extends ModelingTypeProvider {

    getProviderName(): string {
        return 'primitiveTypes';
    }

    protected transformModelsToModelingTypeMap(models$: Observable<ModelingTypeMap>): Observable<ModelingTypeMap> {
        return models$;
    }

    protected retrieveModelingTypesMap(): Observable<ModelingTypeMap> {
        return of(this.getPrimitiveTypes());
    }

    private getPrimitiveTypes(): ModelingTypeMap {
        const types: ModelingTypeMap = {};

        types.boolean = {
            id: 'boolean'
        };
        types.integer = {
            id: 'integer'
        };
        types.string = stringModelType;
        types.json = jsonModelType;
        types.date = dateModelType;
        types.datetime = { ...dateModelType, id: 'datetime' };
        types.array = arrayModelType;
        types.file = fileModelType;
        types.folder = folderModelType;

        types.content = contentModelType;
        types['content-metadata'] = contentMetadataModelType;

        types['array-string'] = {
            id: 'array-string',
            methods: arrayModelType.methods,
            properties: arrayModelType.properties,
            collectionOf: 'string',
            hidden: true
        };

        return types;
    }
}
