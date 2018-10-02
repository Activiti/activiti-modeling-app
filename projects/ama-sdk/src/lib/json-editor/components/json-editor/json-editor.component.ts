/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * limitations under the License.
 */

import { Component, Output, EventEmitter, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgxEditorModel } from 'ngx-monaco-editor';
const memoize = require('lodash/memoize');

export type EditorOptions = monaco.editor.IEditorOptions | { language: string; theme: string };

const createMemoizedEditorOptions = memoize(
    (theme, basicOptions): EditorOptions => {
        return { ...basicOptions, theme };
    }
);

@Component({
    selector: 'amasdk-json-editor',
    templateUrl: './json-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonEditorComponent implements OnDestroy {
    @Input() vsTheme = 'vs-light';

    @Input() content = '';

    @Output() changed = new EventEmitter<string>();

    private editor: monaco.editor.ICodeEditor = <monaco.editor.ICodeEditor>{ dispose: () => {} };
    editorModel: NgxEditorModel;

    private defaultOptions: EditorOptions = {
        language: 'json',
        scrollBeyondLastLine: false,
        contextmenu: false,
        formatOnPaste: true,
        formatOnType: true,
        minimap: {
            enabled: false
        },
        automaticLayout: true
    };

    get editorOptions(): EditorOptions {
        return createMemoizedEditorOptions(this.vsTheme, this.defaultOptions);
    }

    ngOnDestroy() {
        this.editor.dispose();
    }

    onEditorInit(editor: monaco.editor.ICodeEditor): void {
        this.editor = editor;
        editor.onKeyUp(this.onEditorChange.bind(this));
    }

    onEditorChange(): void {
        this.changed.emit(this.content.trim());
    }
}
