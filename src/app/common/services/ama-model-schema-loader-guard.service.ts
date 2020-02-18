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

import { Injectable, Inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of, zip } from 'rxjs';
import {
    SCHEMA_API_TOKEN,
    ModelSchemaApi,
    CodeEditorService,
    getFileUriPattern,
    SchemaModelMap,
    Json,
    LogFactoryService,
    AmaState,
    MODEL_SCHEMAS_TO_LOAD,
    AssignmentMode
} from '@alfresco-dbp/modeling-shared/sdk';
import { tap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getBackendLogInitiator } from './application.constants';
import assigneeSchema from './../../../../resources/schema/assignee-schema.json';
import candidateSchema from './../../../../resources/schema/candidates-schema.json';

export enum TaskAssignmentSchema {
    assigneeURI = 'TASK-ASSIGNEE-EXTENSION',
    candidatesURI = 'TASK-CANDIDATE-EXTENSION'
}

@Injectable()
export class AmaModelSchemaLoaderGuard implements CanActivate {
    constructor(
        @Inject(SCHEMA_API_TOKEN) private modelSchemaApi: ModelSchemaApi,
        @Inject(MODEL_SCHEMAS_TO_LOAD) private schemas: SchemaModelMap[],
        private codeEditorService: CodeEditorService,
        private store: Store<AmaState>,
        private logFactory: LogFactoryService
    ) {}

    canActivate():  Observable<boolean> {
        this.registerTemporaryTaskAssignmentSchema();
        const schemaLoaders = this.schemas.map<Observable<Json>>(this.registerMonacoJsonSchema.bind(this));
        return zip(...schemaLoaders).pipe(
            map(() => true),
            catchError(error => {
                this.store.dispatch(this.logFactory.logError(getBackendLogInitiator(), error.message));
                return of(true);
            })
        );
    }

    private registerMonacoJsonSchema({ schemaKey, modelType, transform }: SchemaModelMap) {
        return this.modelSchemaApi.retrieve(schemaKey).pipe(
            catchError(() => {
                throw new Error(`${schemaKey} could not be loaded for model type: ${modelType}`);
            }),
            tap((schema) => {
                const monacoSchema = transform ? transform(schema) : schema;
                this.codeEditorService.addSchema(schemaKey, getFileUriPattern(modelType, 'json'), monacoSchema);
            })
        );
    }

    private registerTemporaryTaskAssignmentSchema() {
        this.codeEditorService.addSchema(TaskAssignmentSchema.assigneeURI, getFileUriPattern(AssignmentMode.assignee, 'json'), assigneeSchema);
        this.codeEditorService.addSchema(TaskAssignmentSchema.candidatesURI, getFileUriPattern(AssignmentMode.candidates, 'json'), candidateSchema);
    }
}
