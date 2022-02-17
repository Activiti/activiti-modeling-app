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
import { CoreModule } from '@alfresco/adf-core';
import { VariableSelectorComponent } from './variable-selector/variable-selector.component';
import { VariableSelectorDropdownComponent } from './variable-selector-dropdown/variable-selector-dropdown.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MappingVariableExpressionDropdownComponent } from './mapping-variable-expression-dropdown/mapping-variable-expression-dropdown.component';
import { VariablesModule } from '../../variables/variables.module';
import { VariableExpressionLanguagePipe } from '../../variables/properties-viewer/variable-expression-language.pipe';
import { VariableIdFromVariableNamePipe } from './variable-id-from-variable-name.pipe';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        OverlayModule,
        VariablesModule
    ],
    providers: [ VariableExpressionLanguagePipe ],
    declarations: [VariableSelectorComponent, VariableSelectorDropdownComponent, MappingVariableExpressionDropdownComponent, VariableIdFromVariableNamePipe],
    exports: [VariableSelectorComponent, VariableSelectorDropdownComponent, MappingVariableExpressionDropdownComponent, VariableIdFromVariableNamePipe]
})
export class VariableSelectorsModule { }
