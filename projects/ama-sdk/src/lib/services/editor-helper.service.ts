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

import { Injectable } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ToolbarMessageAction } from '../store/app.actions';
import { Store } from '@ngrx/store';
import { AmaState } from '../store/app.state';
import { CodeEditorPosition } from './../code-editor/components/code-editor/code-editor.component';

@Injectable()
export class EditorHelperService {
    selectedTabIndex: number;

    constructor(private store: Store<AmaState>) {}

    selectedTabChange(event: MatTabChangeEvent, tabNames: string[]) {
        this.selectedTabIndex = event.index;
        this.store.dispatch(new ToolbarMessageAction(tabNames[this.selectedTabIndex]));
    }

    codeEditorPositionChanged(position: CodeEditorPosition) {
        if (this.selectedTabIndex > 0) {
            this.store.dispatch(new ToolbarMessageAction(`Ln ${position.lineNumber}, Col ${position.column}`));
        }
    }
}
