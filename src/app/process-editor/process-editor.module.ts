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

import { CardViewTextItemComponent, CoreModule } from '@alfresco/adf-core';
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
    AmaStoreModule,
    AmaTitleService,
    BpmnFactoryToken,
    BpmnProperty,
    CodeEditorModule,
    CodeEditorService,
    extensionsSchema,
    getFileUriPattern,
    InputMappingTableModule,
    OutputMappingTableModule,
    PROCESS,
    PROCESS_VARIABLES,
    PROCESSES_ENTITY_KEY,
    ProcessModelerServiceToken,
    propertiesSchema,
    provideLogFilter,
    providePaletteElements,
    providePaletteHandler,
    providePropertyHandler,
    provideTranslations,
    SharedModule,
    VariablesModule,
    WorkbenchLayoutModule
} from 'ama-sdk';
import { BpmnFactoryService } from './services/bpmn-factory.service';
import { ProcessDiagramLoaderService } from './services/process-diagram-loader.service';
import { CardViewProcessVariablesItemComponent } from './services/cardview-properties/process-variable-item/process-variable-item.component';
import { CardViewImplementationItemComponent } from './services/cardview-properties/implementation-item/implementation-item.component';
import { CardViewDecisionTaskItemComponent } from './services/cardview-properties/decision-task-item/decision-task-item.component';
import { ProcessPropertiesComponent } from './components/process-properties/process-properties.component';
import { MatChipsModule, MatTooltipModule } from '@angular/material';
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
import { CardViewTimerDefinitionItemComponent } from './services/cardview-properties/timer-definition-item/timer-definition-item.component';
import { getProcessLogInitiator } from './services/process-editor.constants';
import { CardViewErrorRefItemComponent } from './services/cardview-properties/error-ref-item/error-ref-item.component';
import { CardViewMessageItemComponent } from './services/cardview-properties/message-item/message-item.component';
import { CardViewProcessMessagesItemComponent } from './services/cardview-properties/process-messages-item/process-messages-item.component';
import { ProcessMessagesEffects } from './store/process-messages.effects';
import { MessagesDialogComponent } from 'ama-sdk/src/lib/messages/messages-dialog.component';
import { MessagesService } from 'ama-sdk/src/lib/messages/messages.service';
import { CardViewMultiInstanceItemComponent } from './services/cardview-properties/multi-instance-item/multi-instance-item.component';
import { ClipboardService } from './services/clipboard/clipboard.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        ProcessEditorRoutingModule,
        EffectsModule.forFeature([ProcessEditorEffects, ProcessVariablesEffects, ProcessMessagesEffects]),
        AmaStoreModule.registerEntity({
            key: PROCESSES_ENTITY_KEY,
            reducer: processEntitiesReducer
        }),
        StoreModule.forFeature(PROCESS_EDITOR_STATE_NAME, processEditorReducer),
        SharedModule,
        WorkbenchLayoutModule,
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
        MessagesDialogComponent,
        CardViewProcessVariablesItemComponent,
        CardViewImplementationItemComponent,
        CardViewDecisionTaskItemComponent,
        CardViewDefaultSequenceFlowItemComponent,
        CardViewCalledItemItemComponent,
        CardViewSignalRefItemComponent,
        CardViewErrorRefItemComponent,
        CardViewTimerDefinitionItemComponent,
        CardViewMessageItemComponent,
        CardViewProcessMessagesItemComponent,
        CardViewMessageItemComponent,
        CardViewMultiInstanceItemComponent
    ],
    entryComponents: [
        CardViewProcessVariablesItemComponent,
        CardViewImplementationItemComponent,
        CardViewDecisionTaskItemComponent,
        CardViewDefaultSequenceFlowItemComponent,
        CardViewSignalRefItemComponent,
        CardViewErrorRefItemComponent,
        CardViewCalledItemItemComponent,
        CardViewTimerDefinitionItemComponent,
        CardViewMessageItemComponent,
        CardViewProcessMessagesItemComponent,
        ProcessEditorComponent,
        MessagesDialogComponent,
        CardViewMultiInstanceItemComponent
    ],
    exports: [ProcessEditorRoutingModule],
    providers: [
        ProcessEditorService,
        ProcessDiagramLoaderService,
        { provide: BpmnFactoryToken, useClass: BpmnFactoryService },
        { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
        ProcessModelerPaletteService,
        ClipboardService,
        CardViewPropertiesFactory,
        AmaTitleService,
        MessagesService,
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
        providePropertyHandler(BpmnProperty.errorRef, CardViewErrorRefItemComponent),
        providePropertyHandler(BpmnProperty.calledElement, CardViewCalledItemItemComponent),
        providePropertyHandler(BpmnProperty.timerEventDefinition, CardViewTimerDefinitionItemComponent),
        providePropertyHandler(BpmnProperty.messageRef, CardViewMessageItemComponent),
        providePropertyHandler(BpmnProperty.messages, CardViewProcessMessagesItemComponent),
        providePropertyHandler(BpmnProperty.multiInstanceType, CardViewMultiInstanceItemComponent),
        ...getProcessesFilterProvider(),
        ...getProcessCreatorProvider(),
        ...getProcessUploaderProvider(),
        provideLogFilter(getProcessLogInitiator())
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
