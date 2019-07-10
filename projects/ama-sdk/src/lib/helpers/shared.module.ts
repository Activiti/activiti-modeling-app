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
import { HeaderBreadcrumbsComponent } from './components/header-breadcrumbs/header-breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';
import { CoreModule } from '@alfresco/adf-core';
import { AllowedCharactersDirective } from './directives/allowed-characters.directive';
import { InputMappingTableModule } from '../components/input-mapping-table/input-mapping-table.module';
import { OutputMappingTableModule } from '../components/output-mapping-table/output-mapping-table.module';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
        InputMappingTableModule,
        OutputMappingTableModule,
        CoreModule.forChild(),
    ],
    declarations: [
        HeaderBreadcrumbsComponent,
        EntityDialogComponent,
        AllowedCharactersDirective
    ],
    entryComponents: [ EntityDialogComponent ],
    exports: [
        HeaderBreadcrumbsComponent,
        EntityDialogComponent,
        AllowedCharactersDirective,
        InputMappingTableModule,
        OutputMappingTableModule
    ]
})
export class SharedModule {}
