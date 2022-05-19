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

import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorResponse, ThemingService } from '@alfresco-dbp/modeling-shared/sdk';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { PluginRoutesManagerService } from '@alfresco-dbp/modeling-ce/app-shell';

@Component({
    selector: 'ama-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy {
    onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private renderer: Renderer2,
        private pluginRoutesManager: PluginRoutesManagerService,
        private router: Router,
        private alfrescoApiService: AlfrescoApiService,
        private themingService: ThemingService) {
        this.pluginRoutesManager.patchRoutes();
    }

    ngOnInit() {
        this.alfrescoApiService.getInstance().oauth2Auth.on('error', (error: ErrorResponse) => {
            if (error.status === 403 && this.router.url !== '/') {
                void this.router.navigate(['error', 403]);
            }
        });

        this.themingService.theme$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(selectedTheme => this.renderer.setAttribute(document.body, 'class', selectedTheme.className));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
