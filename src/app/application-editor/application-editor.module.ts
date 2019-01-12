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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from '@alfresco/adf-core';
import { SharedModule, Blob2JsonService } from 'ama-sdk';
import { ApplicationEditorRoutingModule } from './router/application-editor-routing.module';
import { ApplicationEffects } from './store/effects/application.effects';
import { ProcessesEffects } from './store/effects/processes.effects';
import { APPLICATION_EDITOR_STATE_NAME } from 'ama-sdk';
import { applicationDataReducer as application } from './store/reducers/application-data.reducer';
import { applicationTreeReducer as tree } from './store/reducers/application-tree.reducer';
import { ApplicationContentComponent } from './components/application-content/application-content.component';
import { ApplicationNavigationComponent } from './components/application-navigation/application-navigation.component';
import { ApplicationTreeComponent } from './components/application-tree/application-tree.component';
import { UploadFileButtonComponent } from './components/upload-file-button/upload-file-button.component';
import { ApplicationTreeFilterComponent } from './components/application-tree/application-tree-module-filter/application-tree-filter.component';
import { ApplicationEditorService } from './services/application-editor.service';
import { ApplicationTreeHelper } from './components/application-tree/application-tree.helper';
import { ApplicationTreeIconsComponent } from './components/application-tree/application-tree-icons/application-tree-icons.component';

@NgModule({
    imports: [
        CommonModule,
        ApplicationEditorRoutingModule,
        CoreModule.forChild(),
        SharedModule,
        StoreModule.forFeature(APPLICATION_EDITOR_STATE_NAME, { application, tree }),
        EffectsModule.forFeature([ApplicationEffects, ProcessesEffects])
    ],
    declarations: [
        ApplicationContentComponent,
        ApplicationNavigationComponent,
        ApplicationTreeComponent,
        ApplicationTreeFilterComponent,
        UploadFileButtonComponent,
        ApplicationTreeIconsComponent
    ],
    exports: [ApplicationEditorRoutingModule],
    providers: [
        Blob2JsonService,
        ApplicationEditorService,
        ApplicationTreeHelper
    ]
})
export class ApplicationEditorModule {}
