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

import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const TABLET_WIDTH = '768';
const SMALL_SCREEN_WIDTH = '680';
@Injectable({ providedIn: 'root'})
export class LayoutService {

    private sideNavStatusSubject$: Subject<boolean> = new Subject();

    sidenavToggleEvent$ = this.sideNavStatusSubject$.asObservable();
    tabletMediaQuery: MediaQueryList;
    smallScreenMediaQuery: MediaQueryList;

    constructor(private mediaMatcher: MediaMatcher) {
        this.tabletMediaQuery = this.mediaMatcher.matchMedia(`(max-width: ${TABLET_WIDTH}px)`);
        this.smallScreenMediaQuery = this.mediaMatcher.matchMedia(`(max-width: ${SMALL_SCREEN_WIDTH}px)`);
    }

    isTabletWidth() {
        return this.tabletMediaQuery.matches;
    }

    isSmallScreenWidth() {
        return this.smallScreenMediaQuery.matches;
    }

    toggleSideNav() {
        this.sideNavStatusSubject$.next();
    }
}
