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
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { CodeEditorService } from './services/code-editor-service.service';
import { CoreModule } from '@alfresco/adf-core';
import { MatDialogModule } from '@angular/material/dialog';

export function monacoEditorConfigFactory(codeEditorService: CodeEditorService) {
    return codeEditorService.getConfig();
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // We re-provide module's internal NGX_MONACO_EDITOR_CONFIG, see the providers
        MonacoEditorModule.forRoot({}),
        CoreModule.forChild(),
        MatDialogModule
    ],
    declarations: [
        CodeEditorComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        MonacoEditorModule,
        CodeEditorComponent
    ],
    providers: [
        {
            provide: NGX_MONACO_EDITOR_CONFIG,
            useFactory: monacoEditorConfigFactory,
            deps: [ CodeEditorService ]
        }
    ]
})
export class CodeEditorModule {}
