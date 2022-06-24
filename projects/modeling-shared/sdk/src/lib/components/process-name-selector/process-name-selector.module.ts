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
import { VariablesModule } from '../../variables/variables.module';
import { CodeEditorModule } from '../../code-editor/public-api';
import { ProcessNameSelectorComponent } from './process-name-selector.component';
import { provideInputTypeItemHandler } from '../../variables/properties-viewer/value-type-inputs/value-type-inputs';

@NgModule({
    imports: [
        CommonModule,
        VariablesModule,
        CodeEditorModule,
        CoreModule.forChild()
    ],
    providers: [provideInputTypeItemHandler('process', ProcessNameSelectorComponent, 'string')],
    declarations: [ProcessNameSelectorComponent],
    exports: [ProcessNameSelectorComponent]
})
export class ProcessNameSelectorModule { }
