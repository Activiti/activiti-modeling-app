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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeThemeAction } from '../../../store/app.actions';
import { AmaState, AppTheme } from '../../../store/app.state';
import { appThemes } from './themes';

@Component({
    selector: 'modelingsdk-theme-menu',
    template: `
        <button
            mat-menu-item
            *ngFor="let theme of themes"
            (click)="changeTheme(theme.className)">
            <mat-icon *ngIf="selectedTheme === theme.className">done</mat-icon>
            <mat-icon *ngIf="selectedTheme !== theme.className"></mat-icon>
            <span>{{ theme.name }}</span>
        </button>
    `
})
export class ThemeMenuComponent implements OnInit, OnDestroy {

    themes: AppTheme[];
    onDestroy$: Subject<void> = new Subject<void>();
    selectedTheme: string;

    constructor(private store: Store<AmaState>) {
        this.themes = appThemes;
    }

    ngOnInit() {
        this.store
            .select('app')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(app => {
                this.selectedTheme = app.selectedTheme.className;
            });
    }

    changeTheme(theme: string) {
        this.store.dispatch(new ChangeThemeAction({ theme }));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
