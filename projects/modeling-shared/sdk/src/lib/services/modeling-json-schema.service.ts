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

import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { EntityProperty, JSONSchemaInfoBasics } from '../api/types';
import { getFileUriPattern } from '../code-editor/helpers/file-uri';
import { CodeEditorService } from '../code-editor/services/code-editor-service.service';
import { primitive_types } from '../helpers/primitive-types';
import { primitiveTypesSchema } from '../variables/expression-code-editor/services/expression-language/primitive-types-schema';
import { PropertyTypeItem } from '../variables/properties-viewer/property-type-item/models';
import { InputTypeItem, INPUT_TYPE_ITEM_HANDLER } from '../variables/properties-viewer/value-type-inputs/value-type-inputs';
import { ModelingJsonSchema, ModelingJsonSchemaProvider, MODELING_JSON_SCHEMA_PROVIDERS } from './modeling-json-schema-provider.service';

@Injectable({
    providedIn: 'root'
})
export class ModelingJSONSchemaService {

    public static readonly DEFINITIONS_PATH = '#/$defs';
    public static readonly PRIMITIVE_DEFINITIONS_PATH = '#/$defs/primitive';

    private projectId: string;
    private primitiveDefs = primitiveTypesSchema.$defs.primitive;

    protected schemasChanged: BehaviorSubject<ModelingJsonSchema[]> = new BehaviorSubject<ModelingJsonSchema[]>(null);

    public schemasChanged$ = this.schemasChanged.asObservable().pipe(filter(jsonSchemas => !!jsonSchemas));

    constructor(
        private codeEditorService: CodeEditorService,
        @Inject(MODELING_JSON_SCHEMA_PROVIDERS) private providers: ModelingJsonSchemaProvider<any>[],
        @Inject(INPUT_TYPE_ITEM_HANDLER) private inputTypeItemHandler: InputTypeItem[]
    ) {
        this.providers.filter(provider => !provider.isGlobalProvider()).forEach(provider => {
            provider.modelingJsonSchemasUpdated$.subscribe(modelingJsonSchemas => {
                if (modelingJsonSchemas && modelingJsonSchemas.length > 0) {
                    modelingJsonSchemas.forEach(modelingJsonSchema => {
                        this.registerTypeModel(modelingJsonSchema.typeId, modelingJsonSchema.schema, modelingJsonSchema.projectId);
                    });
                }
                this.schemasChanged.next(modelingJsonSchemas);
            });
        });

        this.providers.filter(provider => provider.isGlobalProvider()).forEach(provider => {
            provider.initializeModelingJsonSchemasForProject(null).pipe(take(1)).subscribe(jsonSchemas => {
                jsonSchemas.forEach(jsonSchema => this.registerGlobalTypeModel(jsonSchema.typeId, jsonSchema.schema));
                this.schemasChanged.next(jsonSchemas);
            });
        });
    }

    getProjectSchemaUri(projectId?: string): string {
        let projectSchema = this.codeEditorService.getSchema(getFileUriPattern(projectId || this.projectId, 'json'));
        if (!projectSchema) {
            projectSchema = {
                $id: getFileUriPattern(projectId, 'json'),
                $defs: {}
            };
            this.registerModelingSchema(projectId, projectSchema);
        }
        return projectSchema.$id;
    }

    getProjectSchema(projectId?: string): JSONSchemaInfoBasics {
        let projectSchema = this.codeEditorService.getSchema(getFileUriPattern(projectId || this.projectId, 'json'));
        if (!projectSchema) {
            projectSchema = {
                $id: getFileUriPattern(projectId, 'json'),
                $defs: {}
            };
            this.registerModelingSchema(projectId, projectSchema);
        }
        return projectSchema;
    }

    flatSchemaReference(schema: JSONSchemaInfoBasics, flatPrimitiveTypes = false): JSONSchemaInfoBasics {
        return this.flatSchemaReferenceWithOriginalSchema(schema, schema, flatPrimitiveTypes);
    }

    private flatSchemaReferenceWithOriginalSchema(schema: JSONSchemaInfoBasics, originalSchema: JSONSchemaInfoBasics, flatPrimitiveTypes: boolean): JSONSchemaInfoBasics {
        let result = this.deepCopy(schema) as JSONSchemaInfoBasics;

        if (schema?.properties) {
            Object.keys(schema.properties).forEach(propertyName => {
                result.properties[propertyName] = this.flatSchemaReferenceWithOriginalSchema(schema.properties[propertyName], originalSchema, flatPrimitiveTypes);
            });
        }

        if (schema?.type === 'array') {
            result.items = this.flatSchemaReferenceWithOriginalSchema(schema.items, originalSchema, flatPrimitiveTypes);
        }

        if (schema?.type && Array.isArray(schema.type)) {
            for (let index = 0; index < schema.type.length; index++) {
                const element = schema.type[index];
                if (typeof element !== 'string') {
                    (result.type as JSONSchemaInfoBasics)[index] = this.flatSchemaReferenceWithOriginalSchema(element, originalSchema, flatPrimitiveTypes);
                }
            }
        }

        if (schema?.allOf) {
            for (let index = 0; index < schema.allOf.length; index++) {
                const element = schema.allOf[index];
                result.allOf[index] = this.flatSchemaReferenceWithOriginalSchema(element, originalSchema, flatPrimitiveTypes);
            }
        }

        if (schema?.anyOf) {
            for (let index = 0; index < schema.anyOf.length; index++) {
                const element = schema.anyOf[index];
                result.anyOf[index] = this.flatSchemaReferenceWithOriginalSchema(element, originalSchema, flatPrimitiveTypes);
            }
        }

        if (schema?.oneOf) {
            for (let index = 0; index < schema.oneOf.length; index++) {
                const element = schema.oneOf[index];
                result.oneOf[index] = this.flatSchemaReferenceWithOriginalSchema(element, originalSchema, flatPrimitiveTypes);
            }
        }

        if (this.flatReference(schema?.$ref, flatPrimitiveTypes)) {
            const referencedSchema = this.getSchemaFromReference(schema.$ref, originalSchema);
            const flattenedReferencedSchema = this.flatSchemaReferenceWithOriginalSchema(referencedSchema, originalSchema, flatPrimitiveTypes);
            if (JSON.stringify(result) === JSON.stringify(schema) && Object.keys(schema).length === 1) {
                result = flattenedReferencedSchema;
            } else {
                if (result.allOf) {
                    result.allOf.push(flattenedReferencedSchema);
                } else {
                    result.allOf = [flattenedReferencedSchema];
                }
            }
            delete result.$ref;
        }

        return result || {};
    }

    private flatReference(reference: string, flatPrimitiveTypes: boolean): boolean {
        let flatReference = true;

        flatReference = flatReference && !!reference;

        if (reference?.startsWith(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH)) {
            flatReference = flatReference && flatPrimitiveTypes;
            flatReference = flatReference && (reference !== ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH + '/date');
            flatReference = flatReference && (reference !== ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH + '/datetime');
        }

        return flatReference;
    }

    getSchemaFromReference(ref: string, schema?: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        return this.getSchemaInSchemaFromReference(ref, schema) || this.getSchemaInProjectFromReference(ref);
    }

    private getSchemaInProjectFromReference(ref: string): JSONSchemaInfoBasics {
        if (ref) {
            const accessor = ref.substring(ref.lastIndexOf('#') + 2).split('/');

            return this.getTypeDefinition(this.getProjectSchema(), accessor);
        }
        return null;
    }

    private getSchemaInSchemaFromReference(ref: string, schema: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        if (ref && schema) {
            const accessor = ref.substring(ref.lastIndexOf('#') + 2).split('/');
            const inSchema = this.getTypeDefinition(schema, accessor);
            if (inSchema) {
                return inSchema;
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
        const projectSchema = {
            $id: getFileUriPattern(projectId, 'json'),
            $defs: {
                primitive: this.primitiveDefs
            }
        };

        this.registerModelingSchema(projectId, projectSchema);

        this.providers.forEach(provider => provider.initializeModelingJsonSchemasForProject(projectId));
    }

    registerTypeModel(typeId: string[], schema: JSONSchemaInfoBasics, projectId?: string, enableReplacement = true) {
        if (typeId && schema) {
            let projectSchema = this.codeEditorService.getSchema(getFileUriPattern(projectId || this.projectId, 'json'));
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
        }
    }

    getPrimitiveTypes(schema: JSONSchemaInfoBasics): string[] {
        let primitiveType: string[] = [];

        if (schema) {
            if (schema.$ref && schema.$ref.startsWith(ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH)) {
                const accessor = schema.$ref.substring(schema.$ref.lastIndexOf('#') + 2).split('/');
                primitiveType.push(this.getMappingPrimitiveTypeForString(accessor[accessor.length - 1]));
            }

            if (schema.type) {
                if (!Array.isArray(schema.type)) {
                    primitiveType.push(this.getModelingTypeFromJSONSchemaType(schema.type));
                } else {
                    (schema.type as string[] | JSONSchemaInfoBasics[]).forEach((type: string | JSONSchemaInfoBasics) => {
                        if (typeof type === 'string') {
                            primitiveType.push(this.getModelingTypeFromJSONSchemaType(type));
                        } else {
                            primitiveType = primitiveType.concat(this.getPrimitiveTypes(type));
                        }
                    });
                }
            }

            if (schema.enum) {
                primitiveType.push(this.getMappingPrimitiveTypeForString('enum'));
            }
        }

        return primitiveType.length > 0 ? [...new Set(primitiveType)] : ['json'];
    }

    getModelingTypeFromJSONSchemaType(jsonSchemaType: string): string {
        let type = 'json';

        switch (jsonSchemaType) {
        case 'number':
            type = 'string';
            break;
        case 'object':
            type = 'json';
            break;
        case 'execution':
            type = 'execution';
            break;
        default:
            type = this.getMappingPrimitiveTypeForString(jsonSchemaType);
            break;
        }

        return type;
    }

    getMappingPrimitiveTypeForString(type: string): string {
        if (!type) {
            return type;
        }

        for (const handler of this.inputTypeItemHandler) {
            if (handler.type === type) {
                return handler.primitiveType;
            }
        }
        return primitive_types.find(primitive => primitive === type) || 'json';
    }

    getMappingPrimitiveTypeForEntityProperty(property: EntityProperty): string[] {
        let primitiveTypes: string[] = [];
        if (property?.model) {
            primitiveTypes = this.getPrimitiveTypes(property.model);
        } else {
            primitiveTypes.push(this.getMappingPrimitiveTypeForString(property?.type));
        }

        return primitiveTypes.filter(type => !!type);
    }

    variableMatchesTypeFilter(variable: EntityProperty, typeFilter: string[] | string): boolean {
        if (!typeFilter) {
            return true;
        }

        const variablePrimitiveMappingTypes = this.getMappingPrimitiveTypeForEntityProperty(variable);
        if (Array.isArray(typeFilter)) {
            return variablePrimitiveMappingTypes.some(type => typeFilter.indexOf(type) >= 0);
        } else {
            return variablePrimitiveMappingTypes.some(type => typeFilter === type);
        }
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
            schema.forEach(subSchema => result.push(<JSONSchemaInfoBasics>this.fixReferences(subSchema, typeIdPath, originalSchema)));
            return result;
        } else {
            const result: JSONSchemaInfoBasics = {};
            Object.keys(schema).forEach(key => {
                if (key === '$ref' && !this.getSchemaInProjectFromReference(schema[key]) && !!this.getSchemaInSchemaFromReference(schema[key], originalSchema)) {
                    result[key] = schema[key].replace(/#/g, ModelingJSONSchemaService.DEFINITIONS_PATH + '/' + typeIdPath.join('/'));
                } else if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
                    result[key] = this.fixReferences(schema[key], typeIdPath, originalSchema);
                } else {
                    result[key] = schema[key];
                }
            });
            return result;
        }
    }

    private registerModelingSchema(projectId: string, schema: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        this.codeEditorService.addSchema(projectId, getFileUriPattern(projectId, 'json'), schema);
        return schema;
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

    deepCopy(obj: any): any {
        let copy;

        if (null == obj || 'object' !== typeof obj) {
            return obj;
        }

        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.deepCopy(obj[i]);
            }
            return copy;
        }

        if (obj instanceof Object) {
            copy = {};
            for (const attr in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, attr)) {
                    (<any>copy)[attr] = this.deepCopy(obj[attr]);
                }
            }
            return copy;
        }
    }
}
