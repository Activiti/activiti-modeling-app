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

import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { EntityProperty } from '../../../api/types';
import { DialogService } from '../../../dialogs/services/dialog.service';
import { UuidService } from '../../../services/uuid.service';
import { getFileUri } from '../../helpers/file-uri';
import { ExpressionsEditorService } from '../../services/expressions-editor.service';
import { ExpressionCodeEditorDialogComponent, ExpressionCodeEditorDialogData } from '../expression-code-editor-dialog/expression-code-editor-dialog.component';

@Component({
    selector: 'modelingsdk-expression-code-editor',
    templateUrl: 'expression-code-editor.component.html',
})
export class ExpressionCodeEditorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    constructor(
        private uuidService: UuidService,
        private expressionsEditorService: ExpressionsEditorService,
        private dialogService: DialogService,
        private cdr: ChangeDetectorRef) { }

    @Input()
    expression = '';

    @Input()
    language: string = null;

    @Input()
    variables: EntityProperty[] = [];

    @Input()
    removeEnclosingBrackets = true;

    @Input()
    enableInlineEditor = true;

    @Input()
    enableDialogEditor = true;

    @Input()
    fileUri: string;

    @Input()
    removeLineNumbers = true;

    @Input()
    lineWrapping = true;

    @Output()
    expressionChange = new EventEmitter<string>();

    @ViewChild('expressionPreviewer')
    previewer: any;

    private readonly EXPRESSION_LANGUAGE_PREFIX = 'expression';
    private readonly expressionRegex = /^\${([^]*)}$/m;

    editorOptions = {
        language: 'expression',
        scrollBeyondLastLine: false,
        contextmenu: true,
        formatOnPaste: true,
        formatOnType: true,
        minimap: {
            enabled: false
        },
        automaticLayout: true,
        acceptSuggestionOnCommitCharacter: true,
        suggest: {
            showInlineDetails: true,
            showWords: false
        },
        wordBasedSuggestions: false,
        lineNumbers: 'off',
        wordWrap: 'on'
    };

    workingExpression: string;
    private cachedExpression: string;
    private removeLanguage = false;

    ngOnInit(): void {
        this.initLanguage();
        this.initFileUri();
        this.initEditorOptions();
        this.initWorkingExpression(this.expression);
    }

    ngAfterViewInit(): void {
        if (!this.enableInlineEditor) {
            this.previewer.nativeElement.innerHTML = this.workingExpression;
            this.expressionsEditorService.colorizeElement(this.previewer.nativeElement);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['expression'] && !changes['expression'].firstChange && changes['expression'].currentValue !== this.cachedExpression) {
            this.cachedExpression = changes['expression'].currentValue;
            this.initWorkingExpression(this.expression);
            this.ngAfterViewInit();
        }
        if (changes['language'] && !changes['language'].firstChange) {
            this.initLanguage();
            this.initFileUri(true);
            this.recreateEditor();
            this.ngAfterViewInit();
        }
        if (changes['removeEnclosingBrackets'] && !changes['removeEnclosingBrackets'].firstChange) {
            this.initWorkingExpression(this.expression);
            this.ngAfterViewInit();
        }
        if (changes['variables'] && !changes['variables'].firstChange) {
            if (this.language?.startsWith(this.EXPRESSION_LANGUAGE_PREFIX + '-')) {
                this.initLanguage(true);
            }
            this.recreateEditor();
            this.ngAfterViewInit();
        }
        if (changes['enableInlineEditor'] && !changes['enableInlineEditor'].firstChange) {
            this.ngAfterViewInit();
        }
        if (changes['fileUri'] && !changes['fileUri'].firstChange) {
            this.initFileUri();
            this.recreateEditor();
        }

        if ((changes['removeLineNumbers'] && !changes['removeLineNumbers'].firstChange) || (changes['lineWrapping'] && !changes['lineWrapping'].firstChange)) {
            this.initEditorOptions();
            this.recreateEditor();
        }
    }

    ngOnDestroy(): void {
        if (this.removeLanguage) {
            this.expressionsEditorService.removeEditorLanguageSettings(this.language);
        }
    }

    private initLanguage(force = false) {
        if (force || !this.language) {
            this.language = this.EXPRESSION_LANGUAGE_PREFIX + '-' + this.uuidService.generate();
            this.expressionsEditorService.initExpressionEditor(this.language, this.variables);
            this.removeLanguage = true;
        }
    }

    private initWorkingExpression(exp: string) {
        this.workingExpression = exp ? exp.trim() : '';
        if (this.removeEnclosingBrackets && exp && exp.trim().length > 0) {
            const groups = exp.trim().match(this.expressionRegex);
            if (groups) {
                this.workingExpression = groups[1].trim();
            }
        }
    }

    private initFileUri(force = false) {
        if (force || !this.fileUri) {
            this.fileUri = getFileUri(this.EXPRESSION_LANGUAGE_PREFIX, this.language, 'editor');
        }
    }

    private initEditorOptions() {
        this.editorOptions.language = this.language;
        this.editorOptions.lineNumbers = this.removeLineNumbers ? 'off' : 'on';
        this.editorOptions.wordWrap = this.lineWrapping ? 'on' : 'off';
    }

    private recreateEditor() {
        if (this.enableInlineEditor) {
            this.enableInlineEditor = false;
            this.cdr.detectChanges();
            this.enableInlineEditor = true;
            this.cdr.detectChanges();
        }
    }

    expChanged(exp: string) {
        this.setExpressionToBracketedExpressionIfNeeded(exp);
        this.cachedExpression = this.expression;
        this.expressionChange.emit(this.expression);
    }

    private setExpressionToBracketedExpressionIfNeeded(exp: string) {
        exp = exp?.trim();
        if (this.language?.startsWith(this.EXPRESSION_LANGUAGE_PREFIX + '-')) {
            if (exp && exp.length > 0 && exp.match(this.expressionRegex)) {
                this.expression = exp;
            } else {
                this.expression = (exp && exp.length > 0) ? `\${${exp}}` : exp;
            }
        } else {
            this.expression = exp;
        }
    }

    editInDialog() {
        const expressionUpdate$ = new Subject<string>();

        const dialogData: ExpressionCodeEditorDialogData = {
            expression: this.expression,
            language: this.language,
            removeEnclosingBrackets: this.removeEnclosingBrackets,
            variables: this.variables,
            fileUri: this.fileUri + '-dialog',
            expressionUpdate$: expressionUpdate$
        };

        this.dialogService.openDialog(ExpressionCodeEditorDialogComponent, {
            disableClose: true,
            height: '450px',
            width: '1000px',
            data: dialogData,
        });

        expressionUpdate$.subscribe(data => {
            this.setExpressionToBracketedExpressionIfNeeded(data);
            this.initWorkingExpression(data);
            this.ngAfterViewInit();
            this.expressionChange.emit(data);
        });
    }
}
