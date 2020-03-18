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

import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { EditorComponent } from 'ngx-monaco-editor';

@Component({
    template: `
             <ngx-monaco-editor #editor class="monaco-editor"
                data-automation-id="variable-value"
                (keyup)="onChange()"
                [options]="editorOptions"
                [(ngModel)]="value"
                (onInit)="onInit($event)"
                (onDidChangeConfiguration)="onConfigurationChange($event)">
            </ngx-monaco-editor>
    `
})

export class PropertiesViewerJsonInputComponent {

    // tslint:disable-next-line
    @Output() change = new EventEmitter();
    @Input() value;
    @Input() disabled: boolean;

    @ViewChild('editor') editor: EditorComponent;

    monacoEditor: any;

    editorOptions = {
        language: 'json',
        readOnly: this.disabled
    };

    onInit(editor) {
        this.monacoEditor = editor;
        this.monacoEditor.updateOptions({
            language: 'json',
            readOnly: this.disabled
        });
    }

    onConfigurationChange(configuration) {
        if (configuration.readOnly === undefined || configuration.readOnly !== this.disabled) {
            this.monacoEditor.updateOptions({
                language: 'json',
                readOnly: this.disabled
            });
        }
    }

    onChange() {
        if (this.value && this.value.trim()) {
            try {
                JSON.parse(this.value);
            } catch (e) {
                return;
            }
            this.change.emit(this.value);
        } else {
            this.change.emit(null);
        }
    }

}
