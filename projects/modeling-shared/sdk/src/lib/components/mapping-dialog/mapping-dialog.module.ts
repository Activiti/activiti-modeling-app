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
import { MappingDialogComponent } from './mapping-dialog.component';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { VariablesModule } from '../../variables/variables.module';
import { InputMappingDialogService } from '../../services/input-mapping-dialog.service';
import { OutputMappingDialogService } from '../../services/output-mapping-dialog.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { VariableSelectorsModule } from '../variable-selectors/variable-selectors.module';
import { MappingDialogSelectedTabPipe } from './mapping-dialog-selected-tab.pipe';
import { MappingDialogSavePipe } from './mapping-dialog-save.pipe';

@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        MatSelectModule,
        MatInputModule,
        MatDialogModule,
        VariablesModule,
        CoreModule.forChild(),
        VariableSelectorsModule
    ],
    providers: [DialogService, InputMappingDialogService, OutputMappingDialogService],
    declarations: [MappingDialogComponent, MappingDialogSelectedTabPipe, MappingDialogSavePipe],
    exports: [MappingDialogComponent]
})
export class MappingDialogModule { }
