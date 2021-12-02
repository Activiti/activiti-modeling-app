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
import { take } from 'rxjs/operators';
import { JSONRef, JSONSchemaInfoBasics, JSONSchemaPropertyBasics } from '../api/types';
import { getFileUriPattern } from '../code-editor/helpers/file-uri';
import { CodeEditorService } from '../code-editor/services/code-editor-service.service';
import { primitiveTypesSchema } from '../code-editor/services/expression-language/primitive-types-schema';
import { ModelingJsonSchemaProvider, MODELING_JSON_SCHEMA_PROVIDERS } from './modeling-json-schema-provider.service';

@Injectable({
    providedIn: 'root'
})
export class ModelingJSONSchemaService {

    public static readonly DEFINITIONS_PATH = '#/$defs';
    public static readonly PRIMITIVE_DEFINITIONS_PATH = '#/$defs/primitive';

    private projectId: string;
    private projectSchema: JSONSchemaInfoBasics = { $defs: {} };
    private primitiveDefs = primitiveTypesSchema.$defs;

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

    getPrimitiveType(schema: JSONRef[] | JSONSchemaPropertyBasics[] | JSONSchemaInfoBasics): string {
        let primitiveType = null;
        if (!Array.isArray(schema)) {
            if (schema.$ref && schema.$ref.startsWith(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH)) {
                const accessor = schema.$ref.substr(schema.$ref.lastIndexOf('#') + 2).split('/');
                primitiveType = accessor[accessor.length - 1];
            } else if (schema.type && schema.type !== 'object') {
                primitiveType = schema.type === 'number' ? 'string' : schema.type;
            } else if (schema.enum) {
                primitiveType = 'enum';
            }
        } else {
            primitiveType = 'array';
        }
        return primitiveType;
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
                definitions[path] = this.fixReferences(schema, typeIdPath);
            } else {
                definitions[path] = schema;
            }
        }
    }

    private fixReferences(schema: JSONSchemaInfoBasics, typeIdPath: string[]): JSONSchemaInfoBasics {
        const result: JSONSchemaInfoBasics = {};
        Object.keys(schema).forEach(key => {
            if (key === '$ref') {
                result[key] = schema[key].replace(/\#/g, ModelingJSONSchemaService.DEFINITIONS_PATH + '/' + typeIdPath.join('/'));
            } else if (typeof schema[key] === 'object') {
                result[key] = this.fixReferences(schema[key], typeIdPath);
            } else {
                result[key] = schema[key];
            }
        });
        return result;
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
}
