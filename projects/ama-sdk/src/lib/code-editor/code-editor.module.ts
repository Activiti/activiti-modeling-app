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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';

import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { connectorSchema, formSchema, uiSchema, dataSchema, extensionsSchema } from '../schemas/public_api';

const editorConfig: NgxMonacoEditorConfig = {
    baseUrl: './assets',
    onMonacoLoad: () => {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [{
                uri: 'connectorSchema',
                schema: connectorSchema
            }, {
                uri: 'formSchema',
                schema: formSchema
            }, {
                uri: 'uiSchema',
                schema: uiSchema
            }, {
                uri: 'dataSchema',
                schema: dataSchema
            }, {
                uri: 'extensionsSchema',
                schema: extensionsSchema
            }]
        });
    }
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MonacoEditorModule.forRoot(editorConfig)
    ],
    declarations: [CodeEditorComponent],
    exports: [
        CommonModule,
        FormsModule,
        MonacoEditorModule,
        CodeEditorComponent
    ]
})
export class CodeEditorModule {}
