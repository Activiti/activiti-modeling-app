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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { EntityProperty, ExpressionSyntax } from '../../../../api/types';

export interface ExpressionCodeEditorDialogData {
    expression: string;
    language: string;
    removeEnclosingBrackets: boolean;
    nonBracketedOutput: boolean;
    variables: EntityProperty[];
    removeLineNumbers: boolean;
    lineWrapping: boolean;
    expressionUpdate$: Subject<string>;
    expressionSyntax: ExpressionSyntax;
}

@Component({
    selector: 'modelingsdk-expression-code-editor-dialog',
    templateUrl: './expression-code-editor-dialog.component.html',
    styleUrls: ['./expression-code-editor-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ExpressionCodeEditorDialogComponent {

    expression: string;
    simulation = false;

    constructor(public dialog: MatDialogRef<ExpressionCodeEditorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ExpressionCodeEditorDialogData) {
        this.expression = data.expression;
    }

    onClose() {
        this.dialog.close();
    }

    onSave() {
        this.data.expressionUpdate$.next(this.expression);
        this.data.expressionUpdate$.complete();
        this.dialog.close();
    }
}
