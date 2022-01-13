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

import { EditorFooterComponent } from './components/editor-footer/editor-footer.component';
import { AppLayoutV1Component } from './components/app-layout/app-layout-v1.component';
import { LogHistoryEntryComponent } from './components/log-history/log-history-entry/log-history-entry.component';
import { HeaderMenuComponent } from './components/header/header-menu.component';
import { LogHistoryComponent } from './components/log-history/log-history.component';
import { CommonModule } from '@angular/common';
import { CoreModule, MaterialModule } from '@alfresco/adf-core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavigationModule } from '@alfresco-dbp/modeling-shared/sdk';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { EDITOR_FOOTER_SERVICE_TOKEN } from './components/editor-footer/editor-footer.service.interface';
import { AppFooterService } from './services/app-footer.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        FlexLayoutModule,
        RouterModule,
        NavigationModule,
        TranslateModule.forChild(),
        CoreModule.forChild()
    ],
    declarations: [
        AppLayoutV1Component,
        HeaderMenuComponent,
        LogHistoryComponent,
        LogHistoryEntryComponent,
        EditorFooterComponent,
    ],
    providers: [
        { provide: EDITOR_FOOTER_SERVICE_TOKEN, useClass: AppFooterService },
    ]
})
export class AppLayoutV1Module {}
