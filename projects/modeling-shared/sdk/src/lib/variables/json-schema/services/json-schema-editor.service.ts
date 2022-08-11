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

/* eslint-disable max-lines */
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JSONSchemaInfoBasics } from '../../../api/types';
import { ModelingJSONSchemaService } from '../../../services/modeling-json-schema.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../services/registered-inputs-modeling-json-schema-provider.service';
import { PropertyTypeItem } from '../../properties-viewer/property-type-item/models';
import {
    JsonNodeCustomization,
    JSONSchemaDefinition,
    JSONTypePropertiesDefinition,
    TYPE
} from '../models/model';
import { DATA_MODEL_CUSTOMIZATION, DataModelCustomizer } from './data-model-customization';
import { DefaultDataModelCustomizationService } from './default-data-model.customization.service';

@Injectable({
    providedIn: 'root'
})
export class JsonSchemaEditorService {

    constructor(
        private modelingJSONSchemaService: ModelingJSONSchemaService,
        @Optional() @Inject(DATA_MODEL_CUSTOMIZATION) private dataModelCustomizers: DataModelCustomizer[],
        private defaultCustomizer: DefaultDataModelCustomizationService
    ) { }

    getTypes(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[]): string[] {
        return this.findCustomizer(dataModelType).getTypes(schema, accessor);
    }

    setType(type: string, dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[], added: boolean){
        this.findCustomizer(dataModelType).setType(type,schema, accessor, added);
    }

    getDefinitions(accessor: string, value: any): JSONSchemaDefinition[] {
        let definitions: JSONSchemaDefinition[] = [];
        if (value) {
            const keys = Object.keys(value);

            if (keys && keys.length > 0) {
                keys.forEach(key => {
                    const newAccessor = accessor + '/' + key;

                    if (this.instanceOfJSONSchemaInfoBasics(value[key])) {
                        definitions.push({ accessor: newAccessor, key, definition: value[key] });
                    } else {
                        definitions = definitions.concat(this.getDefinitions(newAccessor, value[key]));
                    }
                });
            }
        }
        return definitions;
    }

    private instanceOfJSONSchemaInfoBasics(object: any): object is JSONSchemaInfoBasics {
        return typeof object === 'object' && ('type' in object || 'enum' in object || 'allOf' in object || 'anyOf' in object || 'oneOf' in object);
    }

    advancedAttr(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[]): JSONTypePropertiesDefinition {
        const types = this.getTypes(dataModelType, schema, accessor);

        const attributes: JSONTypePropertiesDefinition = {};
        types.forEach(type => {
            const typeAttributes = this.findCustomizer(dataModelType).getPropertiesDefinitionForType(schema, accessor, type);
            Object.assign(attributes, typeAttributes);
        });
        return Object.assign(attributes, TYPE.description);
    }

    initHierarchy(definitions: JSONSchemaDefinition[], filteredReferences: string[]): Observable<PropertyTypeItem[]> {
        return this.modelingJSONSchemaService.getPropertyTypeItems().pipe(
            filter(items => !!items && items.length > 0),
            map((items: PropertyTypeItem[]) => {
                let hierarchy = items.slice().filter(item => item.provider !== RegisteredInputsModelingJsonSchemaProvider.PROVIDER_NAME);

                definitions.forEach(definition => {
                    hierarchy.push({
                        displayName: definition.accessor,
                        iconName: 'assignment_returned',
                        isCustomIcon: false,
                        provider: 'inline',
                        typeId: [definition.key],
                        value: {
                            $ref: definition.accessor
                        }
                    });
                });

                if (filteredReferences && filteredReferences.length > 0) {
                    this.removeFilteredReferences(hierarchy, filteredReferences);
                }

                hierarchy = hierarchy.filter(item => item.children?.length > 0 || item.value?.$ref);

                return hierarchy;
            }));
    }

    getProtectedAttributesForDataModelType(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[]): string[] {
        const types = this.getTypes(dataModelType, schema, accessor);

        let attributes: string[] = [];
        types.forEach(type => {
            const protectedAttributes = this.findCustomizer(dataModelType).getProtectedAttributesByType(schema, accessor, type);
            attributes = attributes.concat(protectedAttributes);
        });

        return [...new Set(attributes)];
    }

    updateNodeCustomization(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[], customization: JsonNodeCustomization) {
        return this.findCustomizer(dataModelType).updateNodeCustomization(schema, accessor, customization);
    }

    addPropertyForDataModelType(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaInfoBasics {
        return this.findCustomizer(dataModelType).addProperty(schema, accessor);
    }

    addItemForDataModelType(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaInfoBasics {
        return this.findCustomizer(dataModelType).addItem(schema, accessor);
    }

    addDefinitionForDataModelType(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaInfoBasics {
        return this.findCustomizer(dataModelType).addDefinition(schema, accessor);
    }

    addChildForDataModelType(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[], type: string): JSONSchemaInfoBasics {
        return this.findCustomizer(dataModelType).addChild(schema, accessor, type);
    }

    getNodeFromSchemaAndAccessor(schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaInfoBasics {
        let value = { ...schema };

        for (let index = 1; index < accessor.length; index++) {
            value = { ...value[accessor[index]] };
        }

        return value;
    }

    private findCustomizer(dataModelType: string) {
        if (this.dataModelCustomizers?.length > 0 && dataModelType) {
            const dataModelCustomizer = this.dataModelCustomizers.find(customizer => customizer.getDataModelType() === dataModelType);
            if (dataModelCustomizer) {
                return dataModelCustomizer;
            }

        }
        return this.defaultCustomizer;
    }

    private removeFilteredReferences(hierarchy: PropertyTypeItem[], filteredReferences: string[]) {
        hierarchy.forEach(item => {
            if (item.value && item.value.$ref) {
                const index = filteredReferences.indexOf(item.value.$ref);
                if (index >= 0) {
                    hierarchy.splice(hierarchy.findIndex(element => element.value.$ref === filteredReferences[index]), 1);
                }
            } else if (item.children && item.children.length > 0) {
                this.removeFilteredReferences(item.children, filteredReferences);
            }
        });
    }
}
