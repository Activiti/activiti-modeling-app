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

import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { EntityProperty, ExpressionSyntax } from '../../../../api/types';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { UuidService } from '../../../../services/uuid.service';
import { ExpressionsEditorService } from '../../services/expressions-editor.service';
import { ExpressionCodeEditorDialogComponent, ExpressionCodeEditorDialogData } from '../expression-code-editor-dialog/expression-code-editor-dialog.component';
import { getFileUri } from '../../../../code-editor/helpers/file-uri';

@Component({
    selector: 'modelingsdk-expression-code-editor',
    templateUrl: './expression-code-editor.component.html',
    styleUrls: ['./expression-code-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ExpressionCodeEditorComponent implements OnInit, AfterViewInit, OnChanges {

    constructor(
        private uuidService: UuidService,
        private expressionsEditorService: ExpressionsEditorService,
        private dialogService: DialogService,
        private cdr: ChangeDetectorRef,
        private renderer: Renderer2) { }

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
    removeLineNumbers = true;

    @Input()
    lineWrapping = true;

    @Input()
    nonBracketedOutput = false;

    @Input()
    dialogRemoveLineNumbers = false;

    @Input()
    dialogLineWrapping = false;

    @Input()
    expressionSyntax: ExpressionSyntax = ExpressionSyntax.JUEL;

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
    fileUri: string;
    workingExpression: string;
    workingRemoveEnclosingBrackets: boolean;
    expressionLanguage: string;
    private cachedExpression: string;
    private initialized = false;

    init() {
        if (!this.initialized) {
            this.fullInit();
            this.initialized = true;
        }
    }

    ngOnInit(): void {
        try {
            this.fullInit();
            this.initialized = true;
        } catch (error) {
            this.initialized = false;
        }
    }

    ngAfterViewInit(): void {
        this.initExpressionViewerIfNeeded();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['expression'] && !changes['expression'].firstChange && changes['expression'].currentValue !== this.cachedExpression) {
            this.cachedExpression = changes['expression'].currentValue;
            this.initWorkingExpression(this.expression);
            this.initExpressionViewerIfNeeded();
        }
        if (changes['language'] && !changes['language'].firstChange) {
            this.fullInit();
        }
        if (changes['removeEnclosingBrackets'] && !changes['removeEnclosingBrackets'].firstChange) {
            this.fullInit();
        }
        if (changes['variables'] && !changes['variables'].firstChange) {
            this.fullInit();
        }
        if (changes['enableInlineEditor'] && !changes['enableInlineEditor'].firstChange) {
            this.initWorkingExpression(this.expression);
            this.initExpressionViewerIfNeeded();
        }
        if ((changes['removeLineNumbers'] && !changes['removeLineNumbers'].firstChange) || (changes['lineWrapping'] && !changes['lineWrapping'].firstChange)) {
            this.initWorkingExpression(this.expression);
            this.initEditorOptions();
            this.recreateEditor();
        }
    }

    private fullInit() {
        this.initRemoveEnclosingBrackets();
        this.initWorkingExpression(this.expression);
        this.initLanguage();
        this.initEditorOptions();
        this.recreateEditor();
        this.initExpressionViewerIfNeeded();
    }

    private initRemoveEnclosingBrackets() {
        if (this.language) {
            this.workingRemoveEnclosingBrackets = false;
        } else {
            this.workingRemoveEnclosingBrackets = this.removeEnclosingBrackets;
        }
    }

    private initWorkingExpression(exp: string) {
        this.workingExpression = exp ? exp : '';
        if (this.workingRemoveEnclosingBrackets && exp && exp.trim().length > 0) {
            const groups = exp.trim().match(this.expressionRegex);
            if (groups) {
                this.workingExpression = groups[1];
            }
        }
    }

    private initEditorOptions() {
        this.editorOptions.language = this.language;
        this.editorOptions.lineNumbers = this.removeLineNumbers ? 'off' : 'on';
        this.editorOptions.wordWrap = this.lineWrapping ? 'on' : 'off';
    }

    private initLanguage() {
        this.expressionLanguage = this.EXPRESSION_LANGUAGE_PREFIX + '-' + this.uuidService.generate();
        this.fileUri = getFileUri(this.EXPRESSION_LANGUAGE_PREFIX, this.language, this.expressionLanguage);
        this.expressionsEditorService.initExpressionEditor(this.expressionLanguage, this.variables, this.expressionSyntax, this.language, this.workingRemoveEnclosingBrackets);
    }

    private initExpressionViewerIfNeeded() {
        if (!this.enableInlineEditor) {
            this.previewer.nativeElement.innerHTML = '';
            this.renderer.appendChild(this.previewer.nativeElement, this.renderer.createText(this.workingExpression));
            this.expressionsEditorService.colorizeElement(this.previewer.nativeElement);
        }
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

    private setExpressionToBracketedExpressionIfNeeded(expression: string) {
        const exp = expression ? expression.trim() : expression;
        if (!this.language && this.workingRemoveEnclosingBrackets) {
            if (exp && exp.length > 0 && exp.match(this.expressionRegex)) {
                this.expression = this.nonBracketedOutput ? exp.match(this.expressionRegex)[1] : exp;
            } else {
                this.expression = (exp && exp.length > 0 && !this.nonBracketedOutput) ? `\${${exp}}` : exp;
            }
        } else {
            this.expression = expression;
        }
    }

    editInDialog() {
        const expressionUpdate$ = new Subject<string>();

        const dialogData: ExpressionCodeEditorDialogData = {
            expression: this.expression,
            language: this.language,
            removeEnclosingBrackets: this.workingRemoveEnclosingBrackets,
            variables: this.variables,
            nonBracketedOutput: this.nonBracketedOutput,
            lineWrapping: this.dialogLineWrapping,
            removeLineNumbers: this.dialogRemoveLineNumbers,
            expressionUpdate$: expressionUpdate$,
            expressionSyntax: this.expressionSyntax
        };

        this.dialogService.openDialog(ExpressionCodeEditorDialogComponent, {
            disableClose: true,
            height: '460px',
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
