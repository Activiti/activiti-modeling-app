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
import { JSONSchemaToModelingTypesService } from './json-schema-to-modeling-types.service';
import { ModelingTypeProvider, ModelingTypeMap } from './modeling-type-provider.service';
import * as primitiveTypesSchema from './expression-language/primitive-types-schema.json';

@Injectable({
    providedIn: 'root'
})
export class PrimitiveModelingTypesService extends ModelingTypeProvider {

    private primitiveModelingTypes: ModelingTypeMap = {};

    constructor(private serviceJSONSchemaToModelingTypes: JSONSchemaToModelingTypesService) {
        super(serviceJSONSchemaToModelingTypes);
    }

    getProviderName(): string {
        return 'primitiveTypes';
    }

    protected transformModelsToModelingTypeMap(models$: Observable<ModelingTypeMap>): Observable<ModelingTypeMap> {
        return models$;
    }

    protected retrieveModelingTypesMap(services: any[]): Observable<ModelingTypeMap> {
        if (!this.primitiveModelingTypes && services?.length > 0) {
            this.serviceJSONSchemaToModelingTypes = services[0] as JSONSchemaToModelingTypesService;
            this.primitiveModelingTypes = this.serviceJSONSchemaToModelingTypes
                .getPrimitiveModelingTypesFromJSONSchema(primitiveTypesSchema);
        }
        return of(this.primitiveModelingTypes);
    }

}
