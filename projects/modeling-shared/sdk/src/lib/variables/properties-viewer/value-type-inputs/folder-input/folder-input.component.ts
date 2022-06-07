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

import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { EntityProperty } from '../../../../api/types';

@Component({
    template: `
            <modelingsdk-expression-code-editor
                [attr.data-automation-id]="'variable-value'"
                [expression]="strValue"
                (expressionChange)="onChange($event)"
                [variables]="autocompletionContext"
                [language]="'json'"
                [removeEnclosingBrackets]="false"
                [enableDialogEditor]="!disabled"
                [enableInlineEditor]="!disabled"
                [removeLineNumbers]="true"
                [lineWrapping]="false"
                [nonBracketedOutput]="false">
            </modelingsdk-expression-code-editor>
    `
})
export class PropertiesViewerFolderInputComponent implements OnInit {
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() change = new EventEmitter();
    @Input() value: any;
    @Input() disabled = false;
    @Input() autocompletionContext: EntityProperty[] = [];

    strValue = '';

    ngOnInit() {
        if (this.value === null || this.value === undefined) {
            this.strValue = '';
        } else if (typeof this.value !== 'string') {
            this.strValue = JSON.stringify(this.value, null, 4);
        } else {
            this.strValue = this.value;
        }
    }

    onChange(value: string) {
        this.strValue = value;
        if (this.strValue && this.strValue.trim()) {
            try {
                this.change.emit(JSON.parse(this.strValue));
            } catch (e) {
                return;
            }
        }
    }
}
