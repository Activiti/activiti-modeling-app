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
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CoreModule, CardViewTextItemComponent } from '@alfresco/adf-core';
import { EffectsModule } from '@ngrx/effects';
import { ProcessEditorComponent } from './components/process-editor/process-editor.component';
import { ProcessModelerComponent } from './components/process-modeler/process-modeler.component';
import { ProcessHeaderComponent } from './components/process-header/process-header.component';
import { ProcessModelerServiceImplementation } from './services/process-modeler.service';
import { ProcessEditorService } from './services/process-editor.service';
import { ProcessEditorEffects } from './store/process-editor.effects';
import { StoreModule } from '@ngrx/store';
import { ProcessEditorRoutingModule } from './router/process-editor-routing.module';
import { CardViewPropertiesFactory } from './services/cardview-properties/cardview-properties.factory';
import { Title } from '@angular/platform-browser';
import {
    AmaTitleService,
    providePropertyHandler,
    BpmnProperty,
    CodeEditorModule,
    provideTranslations,
    SharedModule,
    VariablesModule,
    providePaletteHandler,
    providePaletteElements,
    BpmnFactoryToken,
    ProcessModelerServiceToken,
    AmaStoreModule,
    PROCESSES_ENTITY_KEY,
    CodeEditorService,
    getFileUriPattern,
    PROCESS,
    extensionsSchema,
    PROCESS_VARIABLES,
    propertiesSchema
} from 'ama-sdk';
import { BpmnFactoryService } from './services/bpmn-factory.service';
import { ProcessDiagramLoaderService } from './services/process-diagram-loader.service';
import { CardViewProcessVariablesItemComponent } from './services/cardview-properties/process-variable-item/process-variable-item.component';
import { CardViewImplementationItemComponent } from './services/cardview-properties/implementation-item/implementation-item.component';
import { CardViewDecisionTaskItemComponent } from './services/cardview-properties/decision-task-item/decision-task-item.component';
import { ProcessPropertiesComponent } from './components/process-properties/process-properties.component';
import { MatTooltipModule, MatChipsModule } from '@angular/material';
import { getProcessesFilterProvider } from './extension/processes-filter.extension';
import { getProcessCreatorProvider } from './extension/process-creator.extension';
import { getProcessUploaderProvider } from './extension/process-uploader.extension';
import { processEntitiesReducer } from './store/process-entities.reducer';
import { ProcessVariablesEffects } from './store/process-variables.effects';
import { processEditorReducer } from './store/process-editor.reducer';
import { PROCESS_EDITOR_STATE_NAME } from './store/process-editor.selectors';
import { CardViewDefaultSequenceFlowItemComponent } from './services/cardview-properties/default-sequence-flow/default-sequence-flow-item.component';
import { PaletteComponent } from './components/process-modeler/palette/palette.component';
import { ProcessModelerPaletteService } from './services/palette/process-modeler-palette.service';
import { ElementCreationHandler } from './services/palette/handlers/element-creation';
import { ToolsHandler } from './services/palette/handlers/tools';
import { PaletteOverlayDirective } from './components/process-modeler/palette/palette-overlay.directive';
// Angular can't bundle json data into prod build, that is why the file is .json.ts
import { paletteElements } from './config/palette-elements.json';
import { CardViewSignalRefItemComponent } from './services/cardview-properties/signal-ref-item/signal-ref-item.component';
import { CardViewCalledItemItemComponent } from './services/cardview-properties/called-element-item/called-element-item.component';
import { InputMappingTableModule, OutputMappingTableModule } from 'ama-sdk';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        ProcessEditorRoutingModule,
        EffectsModule.forFeature([ProcessEditorEffects, ProcessVariablesEffects]),
        AmaStoreModule.registerEntity({
            key: PROCESSES_ENTITY_KEY,
            reducer: processEntitiesReducer
        }),
        StoreModule.forFeature(PROCESS_EDITOR_STATE_NAME, processEditorReducer),
        SharedModule,
        VariablesModule,
        MatTooltipModule,
        MatChipsModule,
        CodeEditorModule,
        DragDropModule,
        InputMappingTableModule,
        OutputMappingTableModule
    ],
    declarations: [
        ProcessEditorComponent,
        ProcessHeaderComponent,
        PaletteComponent,
        PaletteOverlayDirective,
        ProcessModelerComponent,
        ProcessPropertiesComponent,
        CardViewProcessVariablesItemComponent,
        CardViewImplementationItemComponent,
        CardViewDecisionTaskItemComponent,
        CardViewDefaultSequenceFlowItemComponent,
        CardViewCalledItemItemComponent,
        CardViewSignalRefItemComponent
    ],
    entryComponents: [
        CardViewProcessVariablesItemComponent,
        CardViewImplementationItemComponent,
        CardViewDecisionTaskItemComponent,
        CardViewDefaultSequenceFlowItemComponent,
        CardViewSignalRefItemComponent,
        CardViewCalledItemItemComponent,
        ProcessEditorComponent
    ],
    exports: [ProcessEditorRoutingModule],
    providers: [
        ProcessEditorService,
        ProcessDiagramLoaderService,
        { provide: BpmnFactoryToken, useClass: BpmnFactoryService },
        { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
        ProcessModelerPaletteService,
        CardViewPropertiesFactory,
        AmaTitleService,
        Title,
        provideTranslations('process-editor'),
        ...providePaletteHandler('tool', ToolsHandler),
        ...providePaletteHandler('element', ElementCreationHandler),
        providePaletteElements(paletteElements),
        providePropertyHandler(BpmnProperty.properties, CardViewProcessVariablesItemComponent),
        providePropertyHandler(BpmnProperty.implementation, CardViewImplementationItemComponent),
        providePropertyHandler(BpmnProperty.decisionTask, CardViewDecisionTaskItemComponent),
        providePropertyHandler(BpmnProperty.formKey, CardViewTextItemComponent),
        providePropertyHandler(BpmnProperty.defaultSequenceFlow, CardViewDefaultSequenceFlowItemComponent),
        providePropertyHandler(BpmnProperty.signalRef, CardViewSignalRefItemComponent),
        providePropertyHandler(BpmnProperty.calledElement, CardViewCalledItemItemComponent),
        ...getProcessesFilterProvider(),
        ...getProcessCreatorProvider(),
        ...getProcessUploaderProvider()
    ]
})
export class ProcessEditorModule {
    constructor(
        codeEditorService: CodeEditorService
    ) {
        codeEditorService.addSchema('processExtensionSchema', getFileUriPattern(PROCESS, 'json'), extensionsSchema);
        codeEditorService.addSchema('processVariableSchema', getFileUriPattern(PROCESS_VARIABLES, 'json'), propertiesSchema);
    }
}
