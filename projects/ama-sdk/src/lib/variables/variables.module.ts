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
import { PropertiesViewerComponent } from './properties-viewer/properties-viewer.component';
import { ValueTypeInputComponent } from './properties-viewer/value-type-input.component';
import { PropertiesViewerStringInputComponent } from './properties-viewer/value-type-inputs/string-input.component';
import { PropertiesViewerIntegerInputComponent } from './properties-viewer/value-type-inputs/integer-input.component';
import { PropertiesViewerBooleanInputComponent } from './properties-viewer/value-type-inputs/boolean-input.component';
import { PropertiesViewerDateInputComponent } from './properties-viewer/value-type-inputs/date-input.component';
import { PropertiesViewerJsonInputComponent } from './properties-viewer/value-type-inputs/json-input.component';
import { PropertiesViewerFileInputComponent } from './properties-viewer/value-type-inputs/file-input.component';
import { SharedModule } from '../helpers/public_api';
import { VariableValuePipe } from './properties-viewer/variable-value.pipe';
import { PropertiesViewerDateTimeInputComponent } from './properties-viewer/value-type-inputs/date-time-input.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        CodeEditorModule,
        SharedModule
    ],
    declarations: [
        VariablesComponent,
        PropertiesViewerComponent,
        ValueTypeInputComponent,
        PropertiesViewerStringInputComponent,
        PropertiesViewerIntegerInputComponent,
        PropertiesViewerBooleanInputComponent,
        PropertiesViewerDateInputComponent,
        PropertiesViewerDateTimeInputComponent,
        PropertiesViewerJsonInputComponent,
        PropertiesViewerFileInputComponent,
        VariableValuePipe
    ],
    entryComponents: [
        VariablesComponent,
        PropertiesViewerIntegerInputComponent,
        PropertiesViewerStringInputComponent,
        PropertiesViewerBooleanInputComponent,
        PropertiesViewerDateInputComponent,
        PropertiesViewerDateTimeInputComponent,
        PropertiesViewerJsonInputComponent,
        PropertiesViewerFileInputComponent
    ],
    providers: [
    ]
})
export class VariablesModule {}
