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
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../helpers/shared.module';
import { EditProjectDialogComponent } from './edit-project-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatButtonModule,
        FormsModule,
        TranslateModule.forChild(),
        SharedModule
    ],
    declarations: [EditProjectDialogComponent],
    exports: [EditProjectDialogComponent]
})
export class EditProjectDialogModule {}
