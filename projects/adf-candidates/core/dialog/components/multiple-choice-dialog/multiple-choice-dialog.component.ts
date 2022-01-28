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

import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { HumanReadableChoice } from '../../interfaces/dialog.interface';

export interface MultipleChoiceDialogPayload<T> {
    subject: Subject<MultipleChoiceDialogReturnType<T>>;
    choices?: HumanReadableChoice<T>[];
    title?: string;
    subtitle?: string;
}

export interface MultipleChoiceDialogReturnType<T> {
    dialogRef: MatDialogRef<MultipleChoiceDialogComponent<T>>;
    choice: T;
}

@Component({
    templateUrl: './multiple-choice-dialog.component.html'
})

export class MultipleChoiceDialogComponent<T> implements OnInit {
    title: string;
    subtitle: string;
    subject: Subject<MultipleChoiceDialogReturnType<T>>;
    choices: HumanReadableChoice<T>[];
    loading = {};
    disableButtons = false;

    constructor(
        public dialog: MatDialogRef<MultipleChoiceDialogComponent<T>>,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: MultipleChoiceDialogPayload<T>
    ) {}

    ngOnInit() {
        this.title = this.data.title;
        this.subtitle = this.data.subtitle;
        this.choices = this.data.choices;
        this.subject = this.data.subject;
    }

    choose(choice): void {
        this.disableButtons = true;
        this.loading[choice] = true;
        this.subject.next({dialogRef: this.dialog, choice});
        this.subject.complete();
    }

    isSpinnerVisible(choice) {
        return choice.spinnable && this.loading[choice.choice];
    }
}
