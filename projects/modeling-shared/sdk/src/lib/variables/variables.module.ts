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
import { PropertiesViewerStringInputComponent } from './properties-viewer/value-type-inputs/string-input/string-input.component';
import { PropertiesViewerIntegerInputComponent } from './properties-viewer/value-type-inputs/integer-input/integer-input.component';
import { PropertiesViewerBooleanInputComponent } from './properties-viewer/value-type-inputs/boolean-input.component';
import { PropertiesViewerDateInputComponent } from './properties-viewer/value-type-inputs/date-input.component';
import { PropertiesViewerJsonInputComponent } from './properties-viewer/value-type-inputs/json-input/json-input.component';
import { PropertiesViewerFileInputComponent } from './properties-viewer/value-type-inputs/file-input.component';
import { SharedModule } from '../helpers/public-api';
import { VariableValuePipe } from './properties-viewer/variable-value.pipe';
import { PropertiesViewerDateTimeInputComponent } from './properties-viewer/value-type-inputs/date-time-input.component';
import { provideInputTypeItemHandler } from './properties-viewer/value-type-inputs/value-type-inputs';
import { MatSortModule } from '@angular/material/sort';
import { VariableExpressionLanguagePipe } from './properties-viewer/variable-expression-language.pipe';
import { VariablePrimitiveTypePipe } from './properties-viewer/variable-primitive-type.pipe';
import { FormsModule } from '@angular/forms';
import { PropertiesViewerEnumInputComponent } from './properties-viewer/value-type-inputs/enum-input/enum-input.component';
import { provideModelingJsonSchemaProvider } from '../services/modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../services/registered-inputs-modeling-json-schema-provider.service';
import { PropertiesViewerModeledObjectInputComponent } from './properties-viewer/value-type-inputs/modeled-object/modeled-object-input.component';
import { PropertiesViewerArrayInputComponent } from './properties-viewer/value-type-inputs/array-input/array-input.component';
import { ArrayInputDialogComponent } from './properties-viewer/value-type-inputs/array-input/array-input-dialog/array-input-dialog.component';
import { JsonParsePipe } from './properties-viewer/json-parse.pipe';
import { InputErrorDirective } from './properties-viewer/input-error.directive';
import { PropertyTypeSelectorSmartComponent } from './properties-viewer/property-type-selector/property-type-selector.smart-component';
import { PropertyTypeItemUiComponent } from './properties-viewer/property-type-item/property-type-item.ui-component';
import { AutomationIdPipe } from './properties-viewer/property-type-item/automation-id.pipe';
import { JsonSchemaEditorDialogComponent } from './json-schema/components/json-schema-editor-dialog/json-schema-editor-dialog.component';
import { JsonSchemaEditorComponent } from './json-schema/components/json-schema-editor/json-schema-editor.component';
import { ReferenceSelectorComponent } from './json-schema/components/reference-selector/reference-selector.component';
import { IsAnyTypePipe } from './json-schema/pipes/is-any-type-pipe/is-any-type.pipe';
import { IsNotTypePipe } from './json-schema/pipes/is-not-type-pipe/is-not-type.pipe';
import { RequiredPipe } from './json-schema/pipes/required-pipe/required.pipe';
import { DisplayAddMenuPipe } from './json-schema/pipes/display-add-menu/display-add-menu.pipe';
import { PropertyTypeDialogComponent } from './properties-viewer/property-type-dialog/property-type-dialog.component';
import { ExpressionCodeEditorComponent } from './expression-code-editor/components/expression-code-editor/expression-code-editor.component';
import { ExpressionCodeEditorDialogComponent } from './expression-code-editor/components/expression-code-editor-dialog/expression-code-editor-dialog.component';
import { ExpressionSimulatorComponent } from './expression-code-editor/components/expression-simulator/expression-simulator.component';
import { VariableIconPipe } from './expression-code-editor/pipes/variable-icon.pipe';
import { provideExpressionSyntaxHandler } from './expression-code-editor/services/expression-syntax.provider';
import { JuelExpressionSyntax } from './expression-code-editor/services/expression-language/juel-expression-syntax';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PropertiesViewerFolderInputComponent } from './properties-viewer/value-type-inputs/folder-input/folder-input.component';
import { FocusInsideElementDirective } from './json-schema/components/json-schema-editor/focus-within.directive';
import { JsonSchemaNodeSettingsComponent } from './json-schema/components/json-schema-node-settings/json-schema-node-settings.component';
import { AccessorPipe } from './json-schema/components/json-schema-editor/accessor.pipe';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        CodeEditorModule,
        SharedModule,
        MatSortModule,
        FormsModule,
        MatButtonToggleModule
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
        PropertiesViewerModeledObjectInputComponent,
        PropertiesViewerArrayInputComponent,
        ArrayInputDialogComponent,
        VariableValuePipe,
        VariableExpressionLanguagePipe,
        VariablePrimitiveTypePipe,
        PropertiesViewerEnumInputComponent,
        JsonParsePipe,
        InputErrorDirective,
        PropertyTypeSelectorSmartComponent,
        PropertyTypeItemUiComponent,
        AutomationIdPipe,
        JsonSchemaEditorComponent,
        JsonSchemaEditorDialogComponent,
        ReferenceSelectorComponent,
        RequiredPipe,
        IsAnyTypePipe,
        IsNotTypePipe,
        DisplayAddMenuPipe,
        PropertyTypeDialogComponent,
        ExpressionCodeEditorComponent,
        ExpressionCodeEditorDialogComponent,
        ExpressionSimulatorComponent,
        VariableIconPipe,
        PropertiesViewerFolderInputComponent,
        FocusInsideElementDirective,
        JsonSchemaNodeSettingsComponent,
        AccessorPipe
    ],
    providers: [
        provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
        provideInputTypeItemHandler('integer', PropertiesViewerIntegerInputComponent),
        provideInputTypeItemHandler('boolean', PropertiesViewerBooleanInputComponent),
        provideInputTypeItemHandler('date', PropertiesViewerDateInputComponent),
        provideInputTypeItemHandler('datetime', PropertiesViewerDateTimeInputComponent),
        provideInputTypeItemHandler('json', PropertiesViewerJsonInputComponent),
        provideInputTypeItemHandler('file', PropertiesViewerFileInputComponent),
        provideInputTypeItemHandler('folder', PropertiesViewerFolderInputComponent),
        provideInputTypeItemHandler('array', PropertiesViewerArrayInputComponent),
        provideInputTypeItemHandler('enum', PropertiesViewerEnumInputComponent, 'json'),
        provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider),
        provideExpressionSyntaxHandler(JuelExpressionSyntax)
    ],
    exports: [
        ValueTypeInputComponent,
        VariableValuePipe,
        VariableExpressionLanguagePipe,
        VariablePrimitiveTypePipe,
        JsonParsePipe,
        PropertyTypeSelectorSmartComponent,
        JsonSchemaEditorComponent,
        JsonSchemaNodeSettingsComponent,
        FocusInsideElementDirective,
        PropertiesViewerModeledObjectInputComponent,
        ExpressionCodeEditorComponent,
        InputErrorDirective
    ]
})
export class VariablesModule { }
