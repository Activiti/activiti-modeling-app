 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { Component } from '@angular/core';
import { OpenProcessVariablesDialogAction } from './../../../store/process-variables.actions';
import { Store } from '@ngrx/store';
import { ProcessEditorState } from '../../../store/process-editor.state';
import { CardItemTypeService } from '@alfresco/adf-core';

@Component({
    selector: 'ama-processvariables',
    templateUrl: './process-variable-item.component.html',
    providers: [CardItemTypeService]
})

export class CardViewProcessVariablesItemComponent {
    constructor(private store: Store<ProcessEditorState>) {
    }

    openProcessVariablesDialog(): void {
        this.store.dispatch(new OpenProcessVariablesDialogAction());
    }
}
