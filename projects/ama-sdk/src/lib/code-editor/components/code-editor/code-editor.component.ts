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

import { Component, Output, EventEmitter, Input, OnDestroy, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgxEditorModel, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
const memoize = require('lodash/memoize');
const uuidv4 = require('uuid/v4');

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
    selector: 'amasdk-code-editor',
    templateUrl: './code-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent implements OnDestroy, OnInit {
    @Input() vsTheme = 'vs-light';
    @Input() options: EditorOptions;
    @Input() fileUri: string;
    @Input() language: string;

    @Input()
    set content(value: string) {
        if (value !== this._content) {
            this._content = value;
            this.editorModelSubject$.next({
                value: this._content,
                language: this.language,
                uri: this.getUniqueUri(this.fileUri)
            });
        }
    }

    get content() {
        return this._content;
    }

    @Output() changed = new EventEmitter<string>();
    @Output() positionChanged = new EventEmitter<CodeEditorPosition>();

    editorModel: NgxEditorModel;
    config: NgxMonacoEditorConfig;

    private _content: string;
    private editorModelSubject$ = new Subject<NgxEditorModel>();
    private editor: monaco.editor.ICodeEditor = <monaco.editor.ICodeEditor>{ dispose: () => {} };
    private onDestroy$: Subject<void> = new Subject<void>();
    private defaultOptions: any;

    constructor() {
        this.editorModelSubject$.pipe(
            filter(model => model.value !== undefined && !!model.uri && !!model.language),
            takeUntil(this.onDestroy$)
        ).subscribe((model) => this.editorModel = model);
    }

    ngOnInit() {
        this.defaultOptions = Object.assign({}, DEFAULT_OPTIONS, this.options);
    }

    get editorOptions(): EditorOptions {
        return createMemoizedEditorOptions(this.vsTheme, this.defaultOptions.language, this.defaultOptions);
    }

    get editorConfig(): NgxMonacoEditorConfig {
        return this.editorConfig;
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.editor.dispose();
    }

    onEditorInit(editor: monaco.editor.ICodeEditor): void {
        this.editor = editor;
        let timer = null;

        editor.onKeyUp(() => {
            clearTimeout(timer);
            timer = window.setTimeout(() => this.onEditorChange(), 1000);
        });

        editor.onDidChangeCursorPosition((event: { position: CodeEditorPosition }) => {
            this.positionChanged.emit(event.position);
        });
    }

    onEditorChange(): void {
        this._content = this.editor.getValue().trim();
        this.changed.emit(this._content);
    }

    private getUniqueUri(fileUri: string) {
        if (fileUri) {
            return fileUri + '.' + uuidv4();
        } else {
            return uuidv4();
        }
    }
}
