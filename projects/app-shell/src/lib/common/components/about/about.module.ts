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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { MatTableModule } from '@angular/material/table';
import { DEV_MODE_TOKEN } from './dev-mode.tokens';
import { EnvironmentModule } from '@alfresco-dbp/adf-candidates/core/environment';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        EnvironmentModule,
        MatTableModule
    ],
    declarations: [
        AboutComponent
    ]
})
export class AboutModule {
    public static forRoot(devMode: boolean): ModuleWithProviders<AboutModule> {

        return {
            ngModule: AboutModule,
            providers: [{ provide: DEV_MODE_TOKEN, useValue: devMode }]
        };
    }
}
