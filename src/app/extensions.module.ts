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

import { NgModule } from '@angular/core';
import { APP_GITHUB_COMMIT, APP_VERSION, APP_DEPS } from '@alfresco-dbp/modeling-shared/sdk';
import { repository, version, dependencies, commit } from '../../package.json';
const latestCommitUrl = repository.url.replace('.git', '/commit/') + commit;

@NgModule({
    imports: [
    ],
    providers: [
        { provide: APP_GITHUB_COMMIT, useValue: latestCommitUrl },
        { provide: APP_VERSION, useValue: version },
        { provide: APP_DEPS, useValue: dependencies }
    ]
})
export class AppExtensionsModule {}
