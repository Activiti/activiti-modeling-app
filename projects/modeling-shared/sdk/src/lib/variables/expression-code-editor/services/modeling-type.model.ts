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
import { filter, take } from 'rxjs/operators';
import { JSONSchemaInfoBasics } from '../../../api/types';

export const MODELING_TYPES_PROVIDERS = new InjectionToken<ModelingTypeProvider[]>('modeling-types-providers');

export interface ModelingType {
    id: string;
    hidden?: boolean;
    collectionOf?: string;
    methods?: ModelingTypeMethodDescription[];
    properties?: ModelingTypePropertyDescription[];
}
export interface ModelingTypeMethodDescription {
    signature: string;
    type: string;
    documentation?: string;
    parameters?: ModelingMethodParameter[];
    model?: JSONSchemaInfoBasics;
    isArrayAccessor?: boolean;
    isSameTypeAsObject?: boolean;
}

export interface ModelingMethodParameter {
    label: string;
    documentation?: string;
}

export interface ModelingTypePropertyDescription {
    property: string;
    type: string;
    documentation?: string;
    model?: JSONSchemaInfoBasics;
}

export interface ModelingTypeSuggestion {
    label: string;
    filterText: string;
    kind: number;
    insertText: string;
    documentation: string;
    detail: string;
    insertTextRules?: number;
    command?: any;
    range?: any;
}

export interface ModelingTypeSignatureHelper {
    label: string;
    documentation: string;
    parameters: ModelingMethodParameter[];
    method: ModelingTypeMethodDescription;
}

export interface ModelingTypeMap {
    [id: string]: ModelingType;
}

export interface ProviderModelingTypeMap {
    [providerName: string]: ModelingTypeMap;
}

export abstract class ModelingTypeProvider {

    protected modelingTypesUpdated: BehaviorSubject<ModelingTypeMap> = new BehaviorSubject<ModelingTypeMap>(null);

    modelingTypesUpdated$ = this.modelingTypesUpdated.asObservable().pipe(filter(modelingTypes => !!modelingTypes));

    constructor(...services: any[]) {
        this.retrieveModelingTypesMap(services).pipe(take(1)).subscribe(modelingTypesMap => this.modelingTypesUpdated.next(modelingTypesMap));
    }

    protected abstract transformModelsToModelingTypeMap(models$: Observable<any>): Observable<ModelingTypeMap>;

    protected abstract retrieveModelingTypesMap(...services: any[]): Observable<ModelingTypeMap>;

    abstract getProviderName(): string;

    updateModelingTypes(models$: Observable<any>) {
        this.transformModelsToModelingTypeMap(models$).pipe(take(1)).subscribe(models => {
            this.modelingTypesUpdated.next(models);
        });
    }
}

export function provideModelingTypeProvider(implementationClass: Type<ModelingTypeProvider>): Provider {
    return {
        provide: MODELING_TYPES_PROVIDERS,
        multi: true,
        useExisting: implementationClass
    };
}
