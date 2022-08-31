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

import { TranslationService } from '@alfresco/adf-core';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { JSONSchemaInfoBasics } from '../api/types';
import { primitive_types } from '../helpers/primitive-types';
import { PropertyTypeItem } from '../variables/properties-viewer/property-type-item/models';
import { InputTypeItem, INPUT_TYPE_ITEM_HANDLER } from '../variables/properties-viewer/value-type-inputs/value-type-inputs';
import { ModelingJsonSchema, ModelingJsonSchemaProvider, ModelsWithJsonSchemaMap } from './modeling-json-schema-provider.service';

@Injectable({
    providedIn: 'root'
})
export class PrimitivesModelingJsonSchemaProvider extends ModelingJsonSchemaProvider<JSONSchemaInfoBasics> {
    constructor(@Inject(INPUT_TYPE_ITEM_HANDLER) private inputTypeItemHandler: InputTypeItem[], private translationService: TranslationService) {
        super();
    }

    public static readonly PROVIDER_NAME = 'primitives';

    getProviderName(): string {
        return PrimitivesModelingJsonSchemaProvider.PROVIDER_NAME;
    }

    isGlobalProvider() {
        return true;
    }

    getProviderIcon(): string {
        return 'assignment_turned_in';
    }

    getProviderTranslatedName(): string {
        return this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.PRIMITIVE_PROPERTIES_TYPES');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected retrieveModels(_projectId: string): Observable<ModelsWithJsonSchemaMap<JSONSchemaInfoBasics>> {
        const result: ModelsWithJsonSchemaMap<JSONSchemaInfoBasics> = {};
        const handlersWithModel = this.inputTypeItemHandler.filter(handler => primitive_types.some(type => type === handler.type));
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

    getPropertyTypeItems(projectId: string): Observable<PropertyTypeItem> {
        return this.getModelingSchemasForProvider(projectId).pipe(take(1), map(modelingSchemas => {
            const rootItem: PropertyTypeItem = {
                displayName: this.getProviderTranslatedName(),
                iconName: this.getProviderIcon(),
                isCustomIcon: this.isCustomIcon(),
                provider: this.getProviderName(),
                children: []
            };

            modelingSchemas.forEach(modelingSchema => {
                rootItem.children.push({
                    displayName: modelingSchema.typeId[modelingSchema.typeId.length - 1],
                    iconName: this.getProviderIcon(),
                    isCustomIcon: this.isCustomIcon(),
                    provider: this.getProviderName(),
                    typeId: modelingSchema.typeId
                });
            });

            rootItem.children.sort(this.sort);

            return rootItem;
        }));
    }
}
