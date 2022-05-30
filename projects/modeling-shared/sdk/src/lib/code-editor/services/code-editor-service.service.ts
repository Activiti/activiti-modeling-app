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
import { JSONSchemaInfoBasics } from '../../api/types';

@Injectable({
    providedIn: 'root'
})
export class CodeEditorService {

    private schemas = [];

    getSchema(uri: string): JSONSchemaInfoBasics {
        return this.schemas.find(schema => schema.schema?.$id === uri)?.schema;
    }

    addSchema(uri: string, fileMatch: string | string[], schema: string | any) {
        this.schemas.push({
            uri,
            fileMatch: Array.isArray(fileMatch) ? fileMatch : [ fileMatch ],
            schema
        });
    }

    replaceSchema(uri: string, fileMatch: string | string[], schema: string | any) {
        const schemaIndex = this.getSchemaIndexByUri(uri);
        if (schemaIndex === -1) {
            this.addSchema(uri, fileMatch, schema);
        } else {
            this.schemas[schemaIndex] = {
                uri,
                fileMatch: Array.isArray(fileMatch) ? fileMatch : [ fileMatch ],
                schema
            };
        }
    }

    deleteSchemaByUri(uri: string) {
        const schemaIndex = this.getSchemaIndexByUri(uri);
        if (schemaIndex !== -1) {
            this.deleteSchema(schemaIndex);
        }
    }

    getConfig() {
        return {
            baseUrl: './assets',
            onMonacoLoad: this.onMonacoLoad.bind(this)
        };
    }

    private deleteSchema(index: number) {
        this.schemas.splice(index, 1);
    }

    private getSchemaIndexByUri(uri: string): number {
        return this.schemas.findIndex(itemSchema => itemSchema.uri === uri);
    }

    private onMonacoLoad() {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: this.schemas
        });
    }
}
