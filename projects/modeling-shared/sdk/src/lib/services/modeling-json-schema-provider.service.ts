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

import { InjectionToken, Provider, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { JSONSchemaInfoBasics } from '../api/types';

export interface ModelingJsonSchema {
    projectId: string;
    typeId: string[];
    schema: JSONSchemaInfoBasics;
}

export const MODELING_JSON_SCHEMA_PROVIDERS = new InjectionToken<ModelingJsonSchemaProvider<any>[]>('modeling-json-schema-providers');

export abstract class ModelingJsonSchemaProvider<T> {
    protected modelingJsonSchemasUpdated: BehaviorSubject<ModelingJsonSchema[]> = new BehaviorSubject<ModelingJsonSchema[]>(null);

    modelingJsonSchemasUpdated$ = this.modelingJsonSchemasUpdated.asObservable().pipe(filter(jsonSchemas => !!jsonSchemas));

    abstract getProviderName(): string;

    protected abstract retrieveModels(projectId: string): Observable<T[]>;

    protected abstract transformModelToJsonSchemas(projectId: string, model: T): ModelingJsonSchema[];

    isGlobalProvider() {
        return false;
    }

    updateModelingJsonSchema(projectId: string, model: T) {
        this.modelingJsonSchemasUpdated.next(this.transformModelToJsonSchemas(projectId, model));
    }

    initializeModelingJsonSchemasForProject(projectId: string): Observable<ModelingJsonSchema[]> {
        const schemas = this.retrieveModels(projectId).pipe(
            map(models => {
                let jsonSchemas: ModelingJsonSchema[] = [];
                models.forEach(model => jsonSchemas = jsonSchemas.concat(this.transformModelToJsonSchemas(projectId, model)));
                return jsonSchemas;
            })
        ).pipe(take(1));

        schemas.subscribe(jsonSchemas => this.modelingJsonSchemasUpdated.next(jsonSchemas));

        return schemas;
    }
}

export function provideModelingJsonSchemaProvider(implementationClass: Type<ModelingJsonSchemaProvider<any>>): Provider {
    return {
        provide: MODELING_JSON_SCHEMA_PROVIDERS,
        useClass: implementationClass,
        multi: true
    };
}
