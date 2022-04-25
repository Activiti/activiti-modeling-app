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
import { ModelEditorType, MODEL_EDITORS_TOKEN } from './components/model-editor/model-editors.token';
import { ModelEditorComponent } from './components/model-editor/model-editor.component';
import { DynamicComponentDirective } from './components/model-editor/dynamic-component.directive';
import { ModelLoaderGuard } from './router/guards/model-loader.guard';
import { ModelEditorProxyComponent } from './components/model-editor-proxy/model-editor-proxy.component';
import { UnsavedPageGuard } from './router/guards/unsaved-page.guard';
import { ModelHeaderComponent } from './components/model-header/model-header.component';
import { SharedModule } from '../helpers/shared.module';
import { MaterialModule, ToolbarModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ModelHeaderBreadcrumbProxyComponent } from './components/model-header-breadcrumb/model-header-breadcrumb-proxy.component';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        ToolbarModule,
        TranslateModule.forRoot()
    ],
    declarations: [
        DynamicComponentDirective,
        ModelEditorComponent,
        ModelEditorProxyComponent,
        ModelHeaderComponent,
        ModelHeaderBreadcrumbProxyComponent
    ],
    exports: [
        CommonModule,
        ModelEditorComponent,
        ModelEditorProxyComponent,
        ModelHeaderComponent,
        ModelHeaderBreadcrumbProxyComponent
    ],
    providers: [
        UnsavedPageGuard,
        ModelLoaderGuard
    ]
})
export class ModelEditorModule {
    public static forChild(modelEditorType: ModelEditorType): ModuleWithProviders<ModelEditorModule> {
        return {
            ngModule: ModelEditorModule,
            providers: [
                { provide: MODEL_EDITORS_TOKEN, useValue: modelEditorType, multi: true }
            ]
        };
    }

}
