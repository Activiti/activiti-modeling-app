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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AmaState } from '../../../store/app.state';
import { navigationData } from '../main-navigation/main-navigation.component';

@Component({
  templateUrl: './main-navigation-header.component.html',
  styleUrls: ['./main-navigation-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavigationHeaderComponent implements OnInit, OnDestroy {

  url = '';
  headerLabel$ = new BehaviorSubject<string>('');
  actions = [];
  constructor(private router: Router, private store: Store<AmaState>) { }
  onDestroy$: Subject<void> = new Subject<void>();

  ngOnInit() {
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

  loadNavigationDetails() {
    Object.values(navigationData).find(data => {
      const navigationDetails = data.find(nav => this.url === nav.route.url);
      if (navigationDetails) {
        this.headerLabel$.next(navigationDetails.header_label);
        this.actions = navigationDetails.actions;
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
