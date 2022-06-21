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

import { AppConfigService } from '@alfresco/adf-core';
import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../services/layout.service';
import { AmaState } from '../../../store/app.state';
import { NavigationData } from '../main-navigation/main-navigation.component';

@Component({
    templateUrl: './main-navigation-header.component.html',
    styleUrls: ['./main-navigation-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainNavigationHeaderComponent implements OnInit, OnDestroy {
    searchBarExpanded = false;
    showSearchBar = true;
    headerLabel$ = new BehaviorSubject<string>('');
    onDestroy$: Subject<void> = new Subject<void>();
    actions = [];
    url = '';
    mediaQueryList: MediaQueryList;
    navigation: NavigationData;

    constructor(
        private router: Router,
        private store: Store<AmaState>,
        private layoutService: LayoutService,
        private appConfig: AppConfigService) {
    }

    get isTabletScreen(): boolean {
        return this.layoutService.isTabletWidth();
    }

    get isSmallScreen(): boolean {
        return this.layoutService.isSmallScreenWidth();
    }

    openSidenav() {
        this.layoutService.toggleSideNav();
    }

    ngOnInit() {
        this.navigation = this.appConfig.get('studioLayoutNavigationData');
        this.router.events.pipe(
            filter(event => event instanceof NavigationStart),
            takeUntil(this.onDestroy$)
        ).subscribe((event: NavigationStart) => {
            this.url = event.url.split('?')[0];
            this.loadNavigationDetails();
        });
        if (!this.url) {
            this.url = this.router.url.split('?')[0];
            this.loadNavigationDetails();
        }
    }

    isSearchBarExpanded(value) {
        this.searchBarExpanded = value;
    }

    loadNavigationDetails() {
        Object.values(this.navigation).find(data => {
            const navigationDetails = data.find(nav => this.url === nav.route.url);
            if (navigationDetails) {
                this.headerLabel$.next(navigationDetails.label);
                this.actions = navigationDetails.actions;
                this.showSearchBar = navigationDetails.showSearchBar;
                this.searchBarExpanded = false;
            }
        });
    }

    runAction(type: string) {
        this.store.dispatch({ type });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
