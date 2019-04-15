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
import { CodeEditorModule } from './../code-editor/code-editor.module';
import { CoreModule } from '@alfresco/adf-core';
import { VariablesComponent } from './variables.component';
import { PropertiesViwerComponent } from './properties-viewer/properties-viewer.component';
import { VariablesService } from './variables.service';
import { ValueTypeInputComponent } from './properties-viewer/value-type-input.component';
import { PropertiesViwerStringInputComponent } from './properties-viewer/value-type-inputs/string-input.component';
import { PropertiesViwerIntegerInputComponent } from './properties-viewer/value-type-inputs/integer-input.component';
import { PropertiesViwerBooleanInputComponent } from './properties-viewer/value-type-inputs/boolean-input.component';
import { PropertiesViwerDateInputComponent } from './properties-viewer/value-type-inputs/date-input.component';
import { SharedModule } from '../helpers/public_api';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        CodeEditorModule,
        SharedModule
    ],
    declarations: [
        VariablesComponent,
        PropertiesViwerComponent,
        ValueTypeInputComponent,
        PropertiesViwerStringInputComponent,
        PropertiesViwerIntegerInputComponent,
        PropertiesViwerBooleanInputComponent,
        PropertiesViwerDateInputComponent
    ],
    entryComponents: [
        VariablesComponent,
        PropertiesViwerIntegerInputComponent,
        PropertiesViwerStringInputComponent,
        PropertiesViwerBooleanInputComponent,
        PropertiesViwerDateInputComponent
    ],
    providers: [
        VariablesService
    ]
})
export class VariablesModule {}
