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

import { CoreModule } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditorFooterComponent } from './editor-footer.component';
import { LogHistoryEntryComponent } from './log-history/log-history-entry/log-history-entry.component';
import { LogHistoryComponent } from './log-history/log-history.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatTooltipModule,
        MatSelectModule,
        MatInputModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        CoreModule.forChild()
    ],
    declarations: [LogHistoryEntryComponent, LogHistoryComponent, EditorFooterComponent],
    exports: [LogHistoryEntryComponent, LogHistoryComponent, EditorFooterComponent]
})
export class EditorFooterModule { }
