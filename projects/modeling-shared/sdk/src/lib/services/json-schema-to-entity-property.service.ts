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
import { EntityProperty, JSONSchemaInfoBasics, JSONSchemaPropertyBasics } from '../api/types';
import { ModelingJSONSchemaService } from './modeling-json-schema.service';

@Injectable({
    providedIn: 'root'
})
export class JSONSchemaToEntityPropertyService {

    constructor(private modelingJSONSchemaService: ModelingJSONSchemaService) {
    }

    getPrimitiveType(schema: JSONSchemaPropertyBasics[] | JSONSchemaInfoBasics): string | string[] {
        return this.modelingJSONSchemaService.getPrimitiveType(schema);
    }

    getEntityPropertiesFromJSONSchema(
        providedSchema: JSONSchemaInfoBasics,
        name?: string,
        prefix = ''
    ): EntityProperty[] {
        const entityProperties: EntityProperty[] = [];
        const jsonSchema = this.modelingJSONSchemaService.flatSchemaReference(providedSchema);

        if (typeof jsonSchema === 'object' && !('length' in jsonSchema)) {
            if (jsonSchema.anyOf) {
                jsonSchema.anyOf.forEach(schema => entityProperties.push(this.getPrimitiveEntityProperty(schema, jsonSchema, name, prefix)));
            }

            if (jsonSchema.allOf) {
                jsonSchema.allOf.forEach(schema => entityProperties.push(this.getPrimitiveEntityProperty(schema, jsonSchema, name, prefix)));
            }

            if (jsonSchema.type) {
                if (Array.isArray(jsonSchema.type)) {
                    jsonSchema.type.forEach(type => {
                        if (typeof type === 'string') {
                            this.getEntityPropertiesFromJSONSchema({ type }, name, prefix).forEach(property => entityProperties.push(property));
                        } else {
                            this.getEntityPropertiesFromJSONSchema(type, name, prefix).forEach(property => entityProperties.push(property));
                        }
                    });
                } else {
                    switch (jsonSchema.type) {
                        case 'object':
                            if (jsonSchema.properties) {
                                Object.keys(jsonSchema.properties).forEach(property => {
                                    entityProperties.push(this.getPrimitiveEntityProperty(jsonSchema.properties[property], jsonSchema, property, prefix));
                                });
                                if (jsonSchema.required) {
                                    jsonSchema.required.forEach(requiredProperty => {
                                        const index = entityProperties.findIndex(property => property.name === requiredProperty);
                                        if (index >= 0) {
                                            entityProperties[index].required = true;
                                        }
                                    });
                                }
                            }
                            break;
                        default:
                            const entityProperty = this.getPrimitiveEntityProperty(jsonSchema, jsonSchema, name, prefix);
                            if (entityProperty) {
                                entityProperties.push(entityProperty);
                            }
                            break;
                    }
                }
            }

            if (jsonSchema.enum || jsonSchema.const) {
                entityProperties.push(this.getPrimitiveEntityProperty(jsonSchema, jsonSchema, name, prefix));
            }

            if (jsonSchema.$ref) {
                entityProperties.push(this.getPrimitiveEntityProperty(
                    this.modelingJSONSchemaService.getSchemaFromReference(jsonSchema.$ref, jsonSchema),
                    jsonSchema,
                    name,
                    prefix)
                );
            }
        }
        return entityProperties;
    }

    private getPrimitiveEntityProperty(jsonSchema: JSONSchemaInfoBasics, originalJsonSchema: JSONSchemaInfoBasics, name: string, prefix: string): EntityProperty {
        let entityProperty = this.getBasicEntityProperty(jsonSchema, name, prefix);
        if (jsonSchema) {
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
            } else if (jsonSchema.$ref) {
                entityProperty = this.getPrimitiveEntityProperty(
                    this.modelingJSONSchemaService.getSchemaFromReference(jsonSchema.$ref, originalJsonSchema),
                    originalJsonSchema,
                    name,
                    prefix
                );
            } else if (jsonSchema.const) {
                entityProperty.value = jsonSchema.const;
                entityProperty.readOnly = true;
                entityProperty.type = 'json';
                entityProperty.model = null;
            }
        }

        this.fixPrimitiveType(entityProperty);

        return entityProperty;
    }

    private getBasicEntityProperty(jsonSchema: JSONSchemaInfoBasics, name: string, prefix: string): EntityProperty {
        if (jsonSchema && Object.keys(jsonSchema).length > 0) {
            const typeString = (jsonSchema.type || (jsonSchema.enum ? 'enum' : 'const')).toString();

            return {
                id: name || typeString,
                name: prefix + (name || (typeString.charAt(0).toUpperCase() + typeString.toLowerCase().slice(1))),
                label: name || (typeString.charAt(0).toUpperCase() + typeString.toLowerCase().slice(1)),
                type: typeString,
                description: jsonSchema.description,
                value: jsonSchema.default,
                readOnly: jsonSchema.readOnly ? true : false,
                required: false,
                placeholder: jsonSchema.$comment,
                model: jsonSchema
            };
        } else {
            return null;
        }
    }

    private fixPrimitiveType(entity: EntityProperty) {
        if (!!entity) {
            entity.type = this.modelingJSONSchemaService.getPrimitiveTypeFromModel(entity.model, entity.type);
        }
    }
}
