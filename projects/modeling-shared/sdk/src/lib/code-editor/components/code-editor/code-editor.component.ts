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

import { Component, Output, EventEmitter, Input, OnDestroy, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEditorModel, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
const memoize = require('lodash/memoize');

export type EditorOptions = monaco.editor.IEditorOptions | { language: string; theme: string };
export interface CodeEditorPosition {
    column: number;
    lineNumber: number;
}

const createMemoizedEditorOptions = memoize(
    (theme, language, basicOptions): EditorOptions => ({ ...basicOptions, theme, language }),
    (theme, language) => `${theme}-${language}`
);

const DEFAULT_OPTIONS = {
    language: 'json',
    scrollBeyondLastLine: false,
    contextmenu: true,
    formatOnPaste: true,
    formatOnType: true,
    minimap: {
        enabled: false
    },
    automaticLayout: true
};

@Component({
    selector: 'modelingsdk-code-editor',
    templateUrl: './code-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent implements OnDestroy, OnInit, OnChanges {
    @Input() vsTheme = 'vs-light';
    @Input() options: EditorOptions;
    @Input() fileUri: string;
    @Input() language: string;
    @Input() content = '';
    @Output() changed = new EventEmitter<string>();
    @Output() positionChanged = new EventEmitter<CodeEditorPosition>();

    editorModel: NgxEditorModel;
    config: NgxMonacoEditorConfig;

    private editor: monaco.editor.ICodeEditor = <monaco.editor.ICodeEditor>{ dispose: () => {} };
    private defaultOptions: any;

    ngOnInit() {
        this.defaultOptions = Object.assign({}, DEFAULT_OPTIONS, this.options);
        this.editorModel = {
            value: this.content,
            language: this.language,
            uri: this.fileUri
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.fileUri && changes.fileUri.currentValue) {
            this.editorModel = Object.assign({}, this.editorModel, { uri: changes.fileUri.currentValue });
        }
    }

    get editorOptions(): EditorOptions {
        return createMemoizedEditorOptions(this.vsTheme, this.defaultOptions.language, this.defaultOptions);
    }

    get editorConfig(): NgxMonacoEditorConfig {
        return this.editorConfig;
    }

    ngOnDestroy() {
        this.editor.dispose();
    }

    onEditorInit(editor: monaco.editor.ICodeEditor): void {
        this.editor = editor;
        let timer = null;

        editor.onKeyUp(() => {
            clearTimeout(timer);
            timer = window.setTimeout(() => this.onEditorChange(), 1);
        });

        editor.onDidChangeCursorPosition((event: { position: CodeEditorPosition }) => {
            this.positionChanged.emit(event.position);
        });
    }

    onEditorChange(): void {
        this.changed.emit(this.content);
    }
}
