/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { AuthenticationService, LogService, StorageService, AppConfigService } from '@alfresco/adf-core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AmaAuthenticationService {
    keepAlive: Subscription = <Subscription>{ unsubscribe: () => {} };

    constructor(
        private authService: AuthenticationService,
        private storageService: StorageService,
        private logService: LogService,
        private appConfig: AppConfigService,
        router: Router
    ) {
        this.authService.onLogout.subscribe(() => {
            router.navigate(['/login']);
        });
    }

    isBasicAuthType() {
        if (this.storageService.hasItem('authType')) {
            return this.storageService.getItem('authType') === 'BASIC';
        } else {
            return this.appConfig.get<string>('authType') === 'BASIC';
        }
    }

    logout() {
        this.authService.logout().subscribe({
            error: (error) => {
                this.logService.error('An unknown error occurred while logging out', error);
            },
            complete: () => {
                this.keepAlive.unsubscribe();
            }
        });
    }
}
