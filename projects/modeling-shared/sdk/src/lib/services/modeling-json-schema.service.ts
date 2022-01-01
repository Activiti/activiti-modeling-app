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
import { forkJoin, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { JSONSchemaInfoBasics, JSONSchemaPropertyBasics } from '../api/types';
import { getFileUriPattern } from '../code-editor/helpers/file-uri';
import { CodeEditorService } from '../code-editor/services/code-editor-service.service';
import { primitiveTypesSchema } from '../code-editor/services/expression-language/primitive-types-schema';
import { primitive_types } from '../helpers/primitive-types';
import { PropertyTypeItem } from '../variables/properties-viewer/property-type-item/models';
import { ModelingJsonSchemaProvider, MODELING_JSON_SCHEMA_PROVIDERS } from './modeling-json-schema-provider.service';

@Injectable({
    providedIn: 'root'
})
export class ModelingJSONSchemaService {

    public static readonly DEFINITIONS_PATH = '#/$defs';
    public static readonly PRIMITIVE_DEFINITIONS_PATH = '#/$defs/primitive';

    private projectId: string;
    private projectSchema: JSONSchemaInfoBasics = { $defs: {} };
    private primitiveDefs = primitiveTypesSchema.$defs.primitive;

    constructor(
        private codeEditorService: CodeEditorService,
        @Inject(MODELING_JSON_SCHEMA_PROVIDERS) private providers: ModelingJsonSchemaProvider<any>[]
    ) {
        this.providers.filter(provider => !provider.isGlobalProvider()).forEach(provider => {
            provider.modelingJsonSchemasUpdated$.subscribe(modelingJsonSchemas => {
                if (modelingJsonSchemas && modelingJsonSchemas.length > 0) {
                    modelingJsonSchemas.forEach(modelingJsonSchema => {
                        this.registerTypeModel(modelingJsonSchema.typeId, modelingJsonSchema.schema, modelingJsonSchema.projectId);
                    });
                }
            });
        });

        this.providers.filter(provider => provider.isGlobalProvider()).forEach(provider => {
            provider.initializeModelingJsonSchemasForProject(null).pipe(take(1)).subscribe(jsonSchemas => {
                jsonSchemas.forEach(jsonSchema => this.registerGlobalTypeModel(jsonSchema.typeId, jsonSchema.schema));
            });
        });
    }

    getProjectSchemaUri(projectId?: string): string {
        if (projectId) {
            let projectSchema = this.codeEditorService.getSchema(getFileUriPattern(projectId, 'json'));
            if (!projectSchema) {
                projectSchema = {
                    $id: getFileUriPattern(projectId, 'json'),
                    $defs: {}
                };
                this.registerModelingSchema(projectId, projectSchema);
            }
            return projectSchema.$id;
        } else {
            return this.getProjectSchemaUri(this.projectId);
        }
    }

    getProjectSchema(projectId?: string): JSONSchemaInfoBasics {
        if (projectId) {
            let projectSchema = this.codeEditorService.getSchema(getFileUriPattern(projectId, 'json'));
            if (!projectSchema) {
                projectSchema = {
                    $id: getFileUriPattern(projectId, 'json'),
                    $defs: {}
                };
                this.registerModelingSchema(projectId, projectSchema);
            }
            return projectSchema;
        } else {
            return this.getProjectSchema(this.projectId);
        }
    }

    flatSchemaReference(schema: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        return this.flatSchemaReferenceWithOriginalSchema(schema, schema);
    }

    private flatSchemaReferenceWithOriginalSchema(schema: JSONSchemaInfoBasics, originalSchema: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        let result = { ...schema };

        if (schema?.$ref) {
            result = this.getSchemaFromReference(schema.$ref, originalSchema);
            return this.flatSchemaReferenceWithOriginalSchema(result, originalSchema);
        }

        if (schema?.properties) {
            Object.keys(schema.properties).forEach(propertyName => {
                result.properties[propertyName] = this.flatSchemaReferenceWithOriginalSchema(schema.properties[propertyName], originalSchema);
            });
        }

        if (schema?.type === 'array') {
            result.items = this.flatSchemaReferenceWithOriginalSchema(schema.items, originalSchema);
        }

        if (schema?.type && Array.isArray(schema.type)) {
            for (let index = 0; index < schema.type.length; index++) {
                const element = schema.type[index];
                if (typeof element !== 'string') {
                    (result.type as JSONSchemaInfoBasics)[index] = this.flatSchemaReferenceWithOriginalSchema(element, originalSchema);
                }
            }
        }

        if (schema?.allOf) {
            for (let index = 0; index < schema.allOf.length; index++) {
                const element = schema.allOf[index];
                result.allOf[index] = this.flatSchemaReferenceWithOriginalSchema(element, originalSchema);

            }
        }

        if (schema?.anyOf) {
            for (let index = 0; index < schema.anyOf.length; index++) {
                const element = schema.anyOf[index];
                result.anyOf[index] = this.flatSchemaReferenceWithOriginalSchema(element, originalSchema);

            }
        }

        return result || {};
    }

    getSchemaFromReference(ref: string, schema?: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        if (ref) {
            const accessor = ref.substr(ref.lastIndexOf('#') + 2).split('/');

            if (ref.startsWith(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH)) {
                return this.getTypeDefinition(this.projectSchema, accessor);
            } else {
                if (schema) {
                    const inSchema = this.getTypeDefinition(schema, accessor);
                    if (inSchema) {
                        return inSchema;
                    }
                }
                return this.getTypeDefinition(this.projectSchema, accessor);
            }
        }
        return null;
    }

    getPrimitiveTypeFromModel(model: JSONSchemaInfoBasics, defaultType: string): string {
        return primitive_types.find(type => {
            const primitiveSchema = this.getSchemaFromReference(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH + '/' + type);
            return JSON.stringify(primitiveSchema) === JSON.stringify(model);
        }) || defaultType;
    }

    initializeProjectSchema(projectId: string) {
        this.projectId = projectId;
        this.projectSchema = {
            $id: getFileUriPattern(projectId, 'json'),
            $defs: {
                primitive: this.primitiveDefs
            }
        };

        this.registerModelingSchema(projectId);

        this.providers.forEach(provider => provider.initializeModelingJsonSchemasForProject(projectId));
    }

    registerTypeModel(typeId: string[], schema: JSONSchemaInfoBasics, projectId?: string, enableReplacement = true) {
        if (typeId && schema) {
            if (projectId) {
                let projectSchema = this.codeEditorService.getSchema(getFileUriPattern(projectId, 'json'));
                if (!projectSchema) {
                    projectSchema = {
                        $id: getFileUriPattern(projectId, 'json'),
                        $defs: {}
                    };
                }
                if (!enableReplacement && this.getTypeDefinition(projectSchema, typeId)) {
                    throw new Error(`The ${typeId} model has already been registered for the project ${projectId}`);
                }
                this.createTypeDefinition(projectSchema.$defs, typeId, schema, typeId);
                this.registerModelingSchema(projectId, projectSchema);
            } else {
                this.createTypeDefinition(this.projectSchema.$defs, typeId, schema, typeId);
                this.registerModelingSchema(this.projectId);
            }
        }
    }

    getPrimitiveType(schema: JSONSchemaPropertyBasics[] | JSONSchemaInfoBasics): string | string[] {
        let primitiveType;
        if (!Array.isArray(schema)) {
            if (schema.$ref && schema.$ref.startsWith(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH)) {
                const accessor = schema.$ref.substr(schema.$ref.lastIndexOf('#') + 2).split('/');
                primitiveType = accessor[accessor.length - 1];
            } else if (schema.type && schema.type !== 'object') {
                if (!Array.isArray(schema.type)) {
                    primitiveType = schema.type === 'number' ? 'string' : this.getPrimitiveTypeFromModel(schema, schema.type);
                } else {
                    primitiveType = (schema.type as any[]).map(type => {
                        if (typeof type === 'string') {
                            return type === 'number' ? 'string' : type;
                        } else {
                            return this.getPrimitiveType(type);
                        }
                    });
                }
            } else if (schema.enum) {
                primitiveType = 'enum';
            }
        } else {
            primitiveType = 'array';
        }
        return primitiveType || 'json';
    }

    private registerGlobalTypeModel(typeId: string[], schema: JSONSchemaInfoBasics) {
        if (typeId && schema) {
            this.createTypeDefinition(this.primitiveDefs, typeId, schema, typeId, true);
        }
    }

    private getTypeDefinition(definitions: JSONSchemaInfoBasics, typeId: string[]): JSONSchemaInfoBasics {
        if (typeId && typeId[0]) {
            if (definitions[typeId[0]]) {
                return this.getTypeDefinition(definitions[typeId[0]], typeId.slice(1));
            } else {
                return null;
            }
        } else {
            return definitions;
        }

    }

    private createTypeDefinition(definitions: any, typeId: string[], schema: JSONSchemaInfoBasics, typeIdPath: string[], isPrimitive = false) {
        if (typeId) {
            const path = typeId[0];
            if (typeId.length > 1) {
                if (!definitions[path]) {
                    definitions[path] = {};
                }
                this.createTypeDefinition(definitions[path], typeId.slice(1), schema, typeIdPath, isPrimitive);
            } else if (!isPrimitive) {
                definitions[path] = this.fixReferences(schema, typeIdPath, schema);
            } else {
                definitions[path] = schema;
            }
        }
    }

    private fixReferences(
        schema: JSONSchemaInfoBasics | JSONSchemaInfoBasics[],
        typeIdPath: string[], originalSchema: JSONSchemaInfoBasics
    ): JSONSchemaInfoBasics | JSONSchemaInfoBasics[] {
        if (Array.isArray(schema)) {
            const result: JSONSchemaInfoBasics[] = [];
            schema.forEach(subSchema => result.push(<JSONSchemaInfoBasics> this.fixReferences(subSchema, typeIdPath, originalSchema)));
            return result;
        } else {
            const result: JSONSchemaInfoBasics = {};
            Object.keys(schema).forEach(key => {
                if (key === '$ref' && !!this.getSchemaFromReference(schema[key], originalSchema)) {
                    result[key] = schema[key].replace(/\#/g, ModelingJSONSchemaService.DEFINITIONS_PATH + '/' + typeIdPath.join('/'));
                } else if (typeof schema[key] === 'object') {
                    result[key] = this.fixReferences(schema[key], typeIdPath, originalSchema);
                } else {
                    result[key] = schema[key];
                }
            });
            return result;
        }
    }

    private registerModelingSchema(projectId: string, schema?: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        if (schema) {
            this.codeEditorService.addSchema(projectId, getFileUriPattern(projectId, 'json'), schema);
            return schema;
        } else {
            this.codeEditorService.addSchema(projectId, getFileUriPattern(projectId, 'json'), { ...this.projectSchema });
            return this.projectSchema;
        }
    }

    getPropertyTypeItems(): Observable<PropertyTypeItem[]> {
        const observables: Observable<PropertyTypeItem>[] = [];
        this.providers.forEach(provider => {
            observables.push(this.getPropertyTypeItemsFromProvider(provider, this.projectId));
        });
        return forkJoin(observables).pipe(map(items => items.filter(item => item.children?.length > 0)));
    }

    private getPropertyTypeItemsFromProvider(provider: ModelingJsonSchemaProvider<any>, projectId: string): Observable<PropertyTypeItem> {
        return provider.getPropertyTypeItems(projectId).pipe(map(rootItem => {
            this.setPropertyTypeItemValue(provider, rootItem);
            return rootItem;
        }));
    }

    private setPropertyTypeItemValue(provider: ModelingJsonSchemaProvider<any>, item: PropertyTypeItem) {
        if (item.children?.length > 0) {
            item.children.forEach(child => this.setPropertyTypeItemValue(provider, child));
        }

        if (item.typeId) {
            const prefix = provider.isGlobalProvider() ? ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH : ModelingJSONSchemaService.DEFINITIONS_PATH;
            item.value = { $ref: prefix + '/' + item.typeId.join('/') };
        }
    }
}