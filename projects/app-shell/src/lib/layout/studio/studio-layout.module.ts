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

import { CommonModule } from '@angular/common';
import { CoreModule, MaterialModule } from '@alfresco/adf-core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { StudioLayoutComponent } from './components/studio-layout/studio-layout.component';
import { StudioProjectEditorLayoutComponent } from './components/studio-project-editor-layout/studio-project-editor-layout.component';
import { AppFooterService, EditorFooterModule, EDITOR_FOOTER_SERVICE_TOKEN } from '@alfresco-dbp/modeling-shared/sdk';
@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        BrowserModule,
        FlexLayoutModule,
        RouterModule,
        TranslateModule.forChild(),
        CoreModule.forChild(),
        EditorFooterModule
    ],
    declarations: [
        StudioLayoutComponent,
        StudioProjectEditorLayoutComponent,
    ],
    providers: [
        { provide: EDITOR_FOOTER_SERVICE_TOKEN, useClass: AppFooterService },
    ]
})
export class StudioLayoutModule {}
