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
import { DialogService } from './services/dialog.service';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { MultipleChoiceDialogComponent } from './components/multiple-choice-dialog/multiple-choice-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        CoreModule.forChild(),
    ],
    providers: [ DialogService ],
    declarations: [
        ConfirmationDialogComponent,
        InfoDialogComponent,
        MultipleChoiceDialogComponent
    ],
    exports: [
        CommonModule,
        MatIconModule,
        RouterModule
    ]
})
export class DialogsModule {}
