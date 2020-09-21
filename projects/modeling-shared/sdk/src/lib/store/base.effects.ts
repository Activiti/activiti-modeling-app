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

import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export abstract class BaseEffects {
    constructor(protected router: Router) {}

    protected genericErrorHandler(specificErrorHandler: Function, error: { status: number }, ...args: any[]) {
        if (error.status === 401) {
            this.router.navigate(['login']);
            return of();
        }
        if (error.status === 403) {
            this.router.navigate(['error/403']);
            return of();
        }
        return specificErrorHandler(error, ...args);
    }
}
