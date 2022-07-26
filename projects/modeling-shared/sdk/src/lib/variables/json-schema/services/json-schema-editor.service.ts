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
    DATETIME_TYPE_REFERENCE,
    DATE_TYPE_REFERENCE,
    FILE_TYPE_REFERENCE,
    FOLDER_TYPE_REFERENCE,
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

    getTypes(value: JSONSchemaInfoBasics): string[] {
        let types: string[] = [];
        if (Array.isArray(value.type)) {
            value.type.forEach(element => {
                if (typeof element === 'string') {
                    types = types.concat(this.getTypes({ type: element }));
                } else {
                    types = types.concat(this.getTypes(element));
                }
            });
        } else {
            if (value.type) {
                types.push(value.type as string);
            }
        }

        if (value.$ref) {
            if (value.$ref === DATE_TYPE_REFERENCE) {
                types.push('date');
            } else if (value.$ref === DATETIME_TYPE_REFERENCE) {
                types.push('datetime');
            } else if (value.$ref === FILE_TYPE_REFERENCE) {
                types.push('file');
            } else if (value.$ref === FOLDER_TYPE_REFERENCE) {
                types.push('folder');
            } else {
                types.push('ref');
            }

        } if (value.enum) {
            types.push('enum');
        }

        if (value.anyOf) {
            types.push('anyOf');
        }

        if (value.allOf) {
            types.push('allOf');
        }

        if (value.oneOf) {
            types.push('oneOf');
        }

        return types;
    }

    setType(type: string, added: boolean, value: JSONSchemaInfoBasics, dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[]) {
        switch (type) {
            case 'date':
                if (added) {
                    value.$ref = DATE_TYPE_REFERENCE;
                } else {
                    delete value.$ref;
                }
                break;
            case 'datetime':
                if (added) {
                    value.$ref = DATETIME_TYPE_REFERENCE;
                } else {
                    delete value.$ref;
                }
                break;
            case 'file':
                if (added) {
                    value.$ref = FILE_TYPE_REFERENCE;
                } else {
                    delete value.$ref;
                }
                break;
            case 'folder':
                if (added) {
                    value.$ref = FOLDER_TYPE_REFERENCE;
                } else {
                    delete value.$ref;
                }
                break;
            case 'enum':
                if (added) {
                    value.enum = [];
                } else {
                    delete value.enum;
                }
                break;
            case 'ref':
                if (added) {
                    value.$ref = '#/$defs';
                } else {
                    delete value.$ref;
                }
                break;
            case 'allOf':
                if (added) {
                    value.allOf = [];
                } else {
                    delete value.allOf;
                }
                break;
            case 'anyOf':
                if (added) {
                    value.anyOf = [];
                } else {
                    delete value.anyOf;
                }
                break;
            case 'oneOf':
                if (added) {
                    value.oneOf = [];
                } else {
                    delete value.oneOf;
                }
                break;
            default:
                if (added) {
                    this.addType(type, value);
                    if (type === 'array') {
                        value.items = this.addItemForDataModelType(dataModelType, schema, accessor);
                    }
                    if (type === 'object') {
                        value.properties = this.addPropertyForDataModelType(dataModelType, schema, accessor);
                    }
                } else {
                    this.removeType(type, value);
                    if (type === 'array') {
                        delete value.items;
                    }
                    if (type === 'object') {
                        delete value.properties;
                    }
                }
                break;
        }
    }

    private addType(type: string, value: JSONSchemaInfoBasics) {
        if (value.type) {
            if (Array.isArray(value.type)) {
                (value.type as string[]).push(type);
            } else {
                const newType: string[] = [];
                newType.push(value.type);
                newType.push(type);
                value.type = newType;
            }
        } else {
            value.type = type;
        }
    }

    private removeType(type: string, value: JSONSchemaInfoBasics) {
        if (Array.isArray(value.type)) {
            const index = (value.type as string[]).indexOf(type);
            if (index > -1) {
                value.type.splice(index, 1);
            }
            if (value.type.length === 1 && typeof value.type[0] === 'string') {
                value.type = value.type[0];
            }
        } else {
            delete value.type;
        }
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
        const types = this.getTypes(this.getNodeFromSchemaAndAccessor(schema, accessor));

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
        const types = this.getTypes(this.getNodeFromSchemaAndAccessor(schema, accessor));

        let attributes: string[] = [];
        types.forEach(type => {
            const protectedAttributes = this.findCustomizer(dataModelType).getProtectedAttributesByType(schema, accessor, type);
            attributes = attributes.concat(protectedAttributes);
        });

        return [...new Set(attributes)];
    }

    getNodeCustomizationsForDataModelType(dataModelType: string, schema: JSONSchemaInfoBasics, accessor: string[]): JsonNodeCustomization {
        return this.findCustomizer(dataModelType).getNodeCustomization(schema, accessor);
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
