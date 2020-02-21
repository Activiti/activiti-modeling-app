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
import { MatIconModule, MatInputModule, MatSelectModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { OutputMappingTableComponent } from './output-mapping-table.component';
import { MappingDialogModule } from '../mapping-dialog/public-api';
import { VariablesModule } from '../../variables/public-api';

@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        MatSelectModule,
        MatInputModule,
        MappingDialogModule,
        VariablesModule,
        CoreModule.forChild()
    ],
    declarations: [OutputMappingTableComponent],
    exports: [OutputMappingTableComponent]
})
export class OutputMappingTableModule {}
