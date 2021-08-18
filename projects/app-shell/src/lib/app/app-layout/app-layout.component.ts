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

import { Component, ViewChild, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { SidenavLayoutComponent, AppConfigService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { SettingsDialogComponent } from '../settings/settings-dialog.component';
import { AmaState, OpenDialogAction, selectMenuOpened, SetMenuAction } from '@alfresco-dbp/modeling-shared/sdk';
import { LogoutAction } from '../../store/actions/app.actions';

@Component({
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.scss'],
    host: { class: 'adf-app-layout' },
    encapsulation: ViewEncapsulation.None
})
export class AppLayoutComponent implements AfterViewInit, OnDestroy {
    @ViewChild('sidenavLayout', { static: true }) sidenavLayout: SidenavLayoutComponent;

    menuOpened$: Observable<boolean>;
    onDestroy$ = new Subject<void>();

    constructor(private store: Store<AmaState>, private appConfig: AppConfigService) {
        this.menuOpened$ = this.store.select(selectMenuOpened).pipe(first());
    }

    // Hack for adf-sidenav-layout
    ngAfterViewInit() {
        this.store
            .select(selectMenuOpened)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(menuOpened => {
                const isMenuMinimized = !menuOpened;
                if (isMenuMinimized !== this.sidenavLayout.isMenuMinimized) {
                    this.sidenavLayout.toggleMenu();
                }
            });
    }

    get showLanguagePicker() {
        return this.appConfig.get('languagePicker') || false;
    }

    get showNotificationHistory() {
        return this.appConfig.get('showNotificationHistory') || false;
    }

    dispatchToggleMenuAction(menuOpened) {
        this.store.dispatch(new SetMenuAction(menuOpened));
    }

    onLogout() {
        this.store.dispatch(new LogoutAction());
    }

    onOpenSettings() {
        this.store.dispatch(new OpenDialogAction(SettingsDialogComponent));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
