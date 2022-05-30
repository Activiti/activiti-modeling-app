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
import { Observable } from 'rxjs';
import { EntityProperty, JSONSchemaInfoBasics } from '../api/types';
import { ModelingJsonSchema } from './modeling-json-schema-provider.service';
import { ModelingJSONSchemaService } from './modeling-json-schema.service';

@Injectable({
    providedIn: 'root'
})
export class JSONSchemaToEntityPropertyService {

    public schemasChanged$: Observable<ModelingJsonSchema[]>;

    constructor(private modelingJSONSchemaService: ModelingJSONSchemaService) {
        this.schemasChanged$ = this.modelingJSONSchemaService.schemasChanged$;
    }

    getPrimitiveTypes(schema: JSONSchemaInfoBasics): string[] {
        return this.modelingJSONSchemaService.getPrimitiveTypes(schema);
    }

    getEntityPropertiesFromJSONSchema(
        providedSchema: JSONSchemaInfoBasics,
        name?: string,
        prefix = ''
    ): EntityProperty[] {
        const entityProperties: EntityProperty[] = [];
        const jsonSchema = this.modelingJSONSchemaService.flatSchemaReference(providedSchema);

        if (jsonSchema.anyOf) {
            const hasBasicProperties = jsonSchema.anyOf.some(element => this.isBasicProperty(element));
            if (!hasBasicProperties || jsonSchema.anyOf.length === 1) {
                jsonSchema.anyOf.forEach(schema => this.getEntityPropertiesFromJSONSchema(schema, name, prefix).forEach(property => entityProperties.push(property)));
            } else {
                entityProperties.push(this.getAggregatedEntityProperty(jsonSchema.anyOf, name, prefix));
            }
        }

        if (jsonSchema.allOf) {
            const hasBasicProperties = jsonSchema.allOf.some(element => this.isBasicProperty(element));
            if (!hasBasicProperties || jsonSchema.allOf.length === 1) {
                jsonSchema.allOf.forEach(schema => this.getEntityPropertiesFromJSONSchema(schema, name, prefix).forEach(property => entityProperties.push(property)));
            } else {
                entityProperties.push(this.getAggregatedEntityProperty(jsonSchema.allOf, name, prefix));
            }
        }

        if (jsonSchema.oneOf) {
            const hasBasicProperties = jsonSchema.oneOf.some(element => this.isBasicProperty(element));
            if (!hasBasicProperties || jsonSchema.oneOf.length === 1) {
                jsonSchema.oneOf.forEach(schema => this.getEntityPropertiesFromJSONSchema(schema, name, prefix).forEach(property => entityProperties.push(property)));
            } else {
                entityProperties.push(this.getAggregatedEntityProperty(jsonSchema.oneOf, name, prefix));
            }
        }

        if (jsonSchema.type) {
            if (Array.isArray(jsonSchema.type)) {
                const entityProperty = this.getAggregatedEntityProperty(jsonSchema.type, name, prefix);
                entityProperties.push(entityProperty);
            } else {
                switch (jsonSchema.type) {
                case 'object':
                    if (jsonSchema.properties && Object.keys(jsonSchema.properties).length > 0) {
                        Object.keys(jsonSchema.properties).forEach(property => {
                            entityProperties.push(this.getPrimitiveEntityProperty(jsonSchema.properties[property], property, prefix));
                        });
                        if (jsonSchema.required) {
                            jsonSchema.required.forEach(requiredProperty => {
                                const index = entityProperties.filter(property => !!property).findIndex(property => property.name === requiredProperty);
                                if (index >= 0) {
                                    entityProperties[index].required = true;
                                }
                            });
                        }
                    }
                    break;
                default: {
                    const entityProperty = this.getPrimitiveEntityProperty(jsonSchema, name, prefix);
                    if (entityProperty) {
                        entityProperties.push(entityProperty);
                    }
                    break;
                }
                }
            }
        }

        if (jsonSchema.enum || jsonSchema.const) {
            entityProperties.push(this.getPrimitiveEntityProperty(jsonSchema, name, prefix));
        }

        if (jsonSchema.$ref) {
            if (!jsonSchema.$ref.startsWith(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH + '/')) {
                entityProperties.push(this.getPrimitiveEntityProperty(
                    this.modelingJSONSchemaService.getSchemaFromReference(jsonSchema.$ref, jsonSchema),
                    name,
                    prefix)
                );
            } else {
                const type = jsonSchema.$ref.substring(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH.length + 1);
                const entityProperty = this.getPrimitiveEntityProperty({ type }, name, prefix);
                entityProperty.model = type === 'json' ? null : { $ref: jsonSchema.$ref };
                entityProperties.push(entityProperty);
            }
        }

        return entityProperties.filter(properties => !!properties?.type);
    }

    private isBasicProperty(element: JSONSchemaInfoBasics): boolean {
        return element.type !== 'object' && element.type !== 'array' && !element.enum && !element.const;
    }

    private getAggregatedEntityProperty(types: (JSONSchemaInfoBasics | string)[], name: string, prefix: string): EntityProperty {
        const entityProperty = this.getPrimitiveEntityProperty({ type: 'json' }, name, prefix);
        entityProperty.aggregatedTypes = [];
        types.forEach((receivedType: JSONSchemaInfoBasics | string) => {
            if (typeof receivedType === 'string') {
                const modelingType = this.modelingJSONSchemaService.getModelingTypeFromJSONSchemaType(receivedType);
                entityProperty.aggregatedTypes.push(modelingType);
            } else {
                entityProperty.aggregatedTypes = entityProperty.aggregatedTypes.concat(this.modelingJSONSchemaService.getPrimitiveTypes(receivedType));
            }
        });
        entityProperty.aggregatedTypes = [...new Set(entityProperty.aggregatedTypes)];
        delete entityProperty.model;
        return entityProperty;
    }

    private getPrimitiveEntityProperty(jsonSchema: JSONSchemaInfoBasics, name: string, prefix: string): EntityProperty {
        let entityProperty = this.getBasicEntityProperty(jsonSchema, name, prefix);
        if (jsonSchema) {
            const aggregatedModels = this.getAggregatedModels(jsonSchema);
            if (aggregatedModels.length > 1) {
                entityProperty = this.getAggregatedEntityProperty(aggregatedModels, name, prefix);
            } else {
                if (jsonSchema.type) {
                    switch (jsonSchema.type) {
                    case 'object':
                        entityProperty.type = 'json';
                        break;
                    case 'number':
                        entityProperty.type = 'string';
                        break;
                    case null:
                        return null;
                    default:
                        break;
                    }
                } else if (jsonSchema.const) {
                    entityProperty.value = jsonSchema.const;
                    entityProperty.readOnly = true;
                    entityProperty.type = 'json';
                    entityProperty.model = null;
                } else if (jsonSchema.allOf || jsonSchema.anyOf || jsonSchema.oneOf) {
                    entityProperty.type = 'json';
                } else if (jsonSchema.$ref && jsonSchema.$ref.startsWith(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH)) {
                    const type = jsonSchema.$ref.substring(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH.length + 1);
                    entityProperty.type = type;
                    entityProperty.model = type === 'json' ? null : { $ref: jsonSchema.$ref };
                } else if (!jsonSchema.enum) {
                    entityProperty = {
                        id: name,
                        name,
                        type: null
                    };
                }
            }
        }

        return entityProperty;
    }

    private getAggregatedModels(jsonSchema: JSONSchemaInfoBasics): (JSONSchemaInfoBasics | string)[] {
        let aggregatedModels: (JSONSchemaInfoBasics | string)[] = [];

        if (jsonSchema?.type) {
            if (Array.isArray(jsonSchema.type)) {
                aggregatedModels = jsonSchema.type;
            } else {
                aggregatedModels.push(jsonSchema.type);
            }
        }

        if (jsonSchema?.$ref) {
            aggregatedModels.push({ $ref: jsonSchema.$ref });
        }

        if (jsonSchema?.anyOf) {
            aggregatedModels = aggregatedModels.concat(jsonSchema.anyOf);
        }

        if (jsonSchema?.allOf) {
            aggregatedModels = aggregatedModels.concat(jsonSchema.allOf);
        }

        if (jsonSchema?.oneOf) {
            aggregatedModels = aggregatedModels.concat(jsonSchema.oneOf);
        }

        if (jsonSchema?.enum) {
            aggregatedModels.push({ enum: jsonSchema.enum });
        }

        if (jsonSchema?.const) {
            aggregatedModels.push({ const: jsonSchema.const });
        }

        return [...new Set(aggregatedModels)];
    }

    private getBasicEntityProperty(jsonSchema: JSONSchemaInfoBasics, name: string, prefix: string): EntityProperty {
        if (jsonSchema && Object.keys(jsonSchema).length > 0) {
            let typeString = 'json';
            let aggregatedTypes;
            if (!Array.isArray(jsonSchema.type)) {
                if (!jsonSchema.type) {
                    typeString = jsonSchema.enum ? 'enum' : 'const';
                } else {
                    typeString = this.modelingJSONSchemaService.getModelingTypeFromJSONSchemaType(jsonSchema.type);
                }
            } else {
                aggregatedTypes = [];
                jsonSchema.type.forEach((type: string | JSONSchemaInfoBasics) => {
                    if (typeof type === 'string') {
                        aggregatedTypes.push(this.modelingJSONSchemaService.getModelingTypeFromJSONSchemaType(type));
                    } else {
                        aggregatedTypes = aggregatedTypes.concat(this.modelingJSONSchemaService.getPrimitiveTypes(type));
                    }
                });

                aggregatedTypes = [...new Set(aggregatedTypes)];
            }

            return {
                id: name || typeString,
                name: prefix + (name || (typeString.charAt(0).toUpperCase() + typeString.toLowerCase().slice(1))),
                label: jsonSchema.title || name || (typeString.charAt(0).toUpperCase() + typeString.toLowerCase().slice(1)),
                type: typeString,
                description: jsonSchema.description,
                value: jsonSchema.default,
                readOnly: jsonSchema.readOnly ? true : false,
                required: false,
                placeholder: jsonSchema.$comment,
                model: jsonSchema,
                aggregatedTypes
            };
        } else {
            return null;
        }
    }
}
