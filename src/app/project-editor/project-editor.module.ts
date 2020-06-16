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
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from '@alfresco/adf-core';
import { SharedModule, getProjectEditorLogInitiator, PROJECT_EDITOR_STATE_NAME, provideLogFilter, provideTranslations } from '@alfresco-dbp/modeling-shared/sdk';
import { ProjectEditorRoutingModule } from './router/project-editor-routing.module';
import { ProjectEffects } from './store/effects/project.effects';
import { projectTreeReducer as tree } from './store/reducers/project-tree.reducer';
import { ProjectContentComponent } from './components/project-content/project-content.component';
import { ProjectNavigationComponent } from './components/project-navigation/project-navigation.component';
import { ProjectTreeComponent } from './components/project-tree/project-tree.component';
import { UploadFileButtonComponent } from './components/upload-file-button/upload-file-button.component';
import { ProjectTreeFilterComponent } from './components/project-tree/project-tree-module-filter/project-tree-filter.component';
import { ProjectEditorService } from './services/project-editor.service';
import { ProjectTreeHelper } from './components/project-tree/project-tree.helper';
import { ProjectTreeIconsComponent } from './components/project-tree/project-tree-icons/project-tree-icons.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { ProjectImportMenuComponent } from './components/project-import-menu/project-import-menu.component';

@NgModule({
    imports: [
        CommonModule,
        ProjectEditorRoutingModule,
        CoreModule.forChild(),
        SharedModule,
        OverlayModule,
        StoreModule.forFeature(PROJECT_EDITOR_STATE_NAME, { tree }),
        EffectsModule.forFeature([ProjectEffects]),
        ExtensionsModule
    ],
    declarations: [
        ProjectContentComponent,
        ProjectNavigationComponent,
        ProjectTreeComponent,
        ProjectTreeFilterComponent,
        UploadFileButtonComponent,
        ProjectTreeIconsComponent,
        ProjectImportMenuComponent
    ],
    exports: [ProjectEditorRoutingModule],
    providers: [
        ProjectEditorService,
        ProjectTreeHelper,
        provideTranslations('project-editor'),
        provideLogFilter(getProjectEditorLogInitiator())
    ]
})
export class ProjectEditorModule {}
