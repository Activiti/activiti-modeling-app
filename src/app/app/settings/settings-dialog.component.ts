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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { UpdateSettingsAction } from '../../store/actions';
import { appThemes } from '../themes';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppTheme, AmaState } from '@alfresco-dbp/modeling-shared/sdk';

@Component({
    templateUrl: './settings-dialog.component.html'
})
export class SettingsDialogComponent implements OnInit, OnDestroy {
    form: any;
    themes: AppTheme[];
    onDestroy$: Subject<void> = new Subject<void>();

    constructor(private store: Store<AmaState>, public dialog: MatDialogRef<SettingsDialogComponent>) {
        this.themes = appThemes;
    }

    ngOnInit() {
        this.form = {};
        this.store
            .select('app')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(app => {
                this.form.theme = app.selectedTheme.className;
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    submit(): void {
        this.store.dispatch(new UpdateSettingsAction({ ...this.form }));
        this.dialog.close();
    }
}
