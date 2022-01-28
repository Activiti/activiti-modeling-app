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

import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {AllowedCharacters, EntityDialogForm} from '../../helpers/common';
import { MODELER_NAME_REGEX } from '../../helpers/utils/create-entries-names';
import {AmaState} from '../../store/app.state';

export interface SaveAsProjectDialogPayload extends EntityDialogForm {
    action?: any;
}

@Component({
    templateUrl: './save-as-project-dialog.component.html'
})
export class SaveAsProjectDialogComponent implements OnInit {

    id: string;
    name: string;
    allowedCharacters: AllowedCharacters;

    constructor(
        private store: Store<AmaState>,
        public dialog: MatDialogRef<SaveAsProjectDialogComponent>,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: SaveAsProjectDialogPayload
    ) {
    }

    ngOnInit() {
        this.allowedCharacters = {
            regex: MODELER_NAME_REGEX,
            error: 'APP.DIALOGS.ERROR.GENERAL_NAME_VALIDATION'
        };
        this.id = this.data.id;
        this.name = this.data.name;
    }

    validate(): boolean {
        return this.allowedCharacters.regex.test(this.name);
    }

    submit(): void {
        if (this.validate()) {
            this.store.dispatch(new this.data.action(
                {
                    id: this.id,
                    name: this.name
                },
                true));
            this.dialog.close();
        }
    }
}
