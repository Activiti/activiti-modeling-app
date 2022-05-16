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

import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AllowedCharacters, EntityDialogForm } from '../../helpers/common';
import { MODELER_NAME_REGEX } from '../../helpers/public-api';
import { AmaState } from '../../store/app.state';

export interface SaveAsDialogPayload extends EntityDialogForm {
    sourceModelContent: any;
    sourceModelMetadata?: any;
    action?: any;
}

@Component({
    templateUrl: './save-as-dialog.component.html',
    styleUrls: ['./save-as-dialog.component.scss']
})
export class SaveAsDialogComponent implements OnInit {

    name: string;
    description: string;
    allowedCharacters: AllowedCharacters;

    constructor(
        private store: Store<AmaState>,
        public dialog: MatDialogRef<SaveAsDialogComponent>,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: SaveAsDialogPayload
    ) {
    }

    ngOnInit() {
        this.allowedCharacters = {
            regex: MODELER_NAME_REGEX,
            error: 'APP.DIALOGS.ERROR.GENERAL_NAME_VALIDATION'
        };
        this.name = this.data.name;
        this.description = this.data.description;
    }

    validate(): boolean {
        return this.allowedCharacters.regex.test(this.name);
    }

    submit(): void {
        if (this.validate()) {
            this.store.dispatch(new this.data.action(
                {
                    name: this.name,
                    description: this.description,
                    sourceModelContent: this.data.sourceModelContent,
                    sourceModelMetadata: this.data.sourceModelMetadata ? this.data.sourceModelMetadata : null
                },
                true));
            this.dialog.close();
        }
    }
}
