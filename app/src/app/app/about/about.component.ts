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

import { Component, Inject } from '@angular/core';
import { APP_GITHUB_COMMIT, APP_VERSION, APP_DEPS } from '@alfresco-dbp/modeling-shared/sdk';

@Component({
    selector: 'ama-about',
    templateUrl: './about.component.html',
    styleUrls: [ 'about.component.css' ]
})
export class AboutComponent {
    showExtensions = true;

    constructor(
        @Inject(APP_GITHUB_COMMIT) public url: string,
        @Inject(APP_VERSION) public version: string,
        @Inject(APP_DEPS) public dependencies: any[]
    ) {}
}
