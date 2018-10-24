 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { Component, OnDestroy } from '@angular/core';
import { SettingsService, StorageService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';

@Component({
    selector: 'ama-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnDestroy {
    onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private settingsService: SettingsService,
        private storage: StorageService
    ) {
        this.setProvider();
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private setProvider() {
        if (this.storage.hasItem('providers')) {
            this.settingsService.setProviders(this.storage.getItem('providers'));
        }
    }
}
