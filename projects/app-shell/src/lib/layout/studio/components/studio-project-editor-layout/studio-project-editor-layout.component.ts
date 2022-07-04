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

import { LayoutService } from '@alfresco-dbp/modeling-shared/sdk';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Direction } from '@angular/cdk/bidi';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './studio-project-editor-layout.component.html',
    styleUrls: ['./studio-project-editor-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StudioProjectEditorLayoutComponent implements OnDestroy {

    onDestroy$: Subject<void> = new Subject<void>();
    direction = 'ltr';
    mediaQueryList: MediaQueryList;
    leftPanelOpened = true;

    constructor(private layoutService: LayoutService, private userPreferencesService: UserPreferencesService) {
        this.layoutService.sidenavToggleEvent$.pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.leftPanelOpened = !this.leftPanelOpened;
            });

        this.userPreferencesService
            .select('textOrientation')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((direction: Direction) => {
                this.direction = direction;
            });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    get isMobileScreenSize(): boolean {
        return this.layoutService.isSmallScreenWidth();
    }

}
