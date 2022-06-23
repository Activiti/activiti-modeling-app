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
import { CommonModule } from '@angular/common';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AmaLocalStorageMergeGuard } from './guards/ama-localstorage-merge-guard.service';
import { AmaModelSchemaLoaderGuard } from './guards/ama-model-schema-loader-guard.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    providers: [
        AmaLocalStorageMergeGuard,
        AmaModelSchemaLoaderGuard
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders<AppRoutingModule> {
        return {
            ngModule: AppRoutingModule,
            providers: RouterModule.forRoot(routes, config).providers,
        };
    }
}
