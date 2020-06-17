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
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';

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
    InputMappingTableModule,
    OutputMappingTableModule,
    PROCESSES_ENTITY_KEY,
    ProcessModelerServiceToken,
    provideLogFilter,
    providePaletteElements,
    providePaletteHandler,
    providePropertyHandler,
    provideTranslations,
    SharedModule,
    VariablesModule,
    WorkbenchLayoutModule,
    provideLoadableModelSchema,
    PROCESS,
    MODEL_SCHEMA_TYPE,
    BpmnCompositeProperty
} from '@alfresco-dbp/modeling-shared/sdk';
import { BpmnFactoryService } from './services/bpmn-factory.service';
import { ProcessDiagramLoaderService } from './services/process-diagram-loader.service';
import { CardViewProcessVariablesItemComponent } from './services/cardview-properties/process-variable-item/process-variable-item.component';
import { CardViewImplementationItemComponent } from './services/cardview-properties/implementation-item/implementation-item.component';
import { CardViewDecisionTaskItemComponent } from './services/cardview-properties/decision-task-item/decision-task-item.component';
import { CardViewScriptTaskItemComponent } from './services/cardview-properties/script-task-item/script-task-item.component';
import { ProcessPropertiesComponent } from './components/process-properties/process-properties.component';
import { MatChipsModule, MatTooltipModule, MatCardModule, MatDialogModule, MatSnackBarModule } from '@angular/material';
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
import { CardViewMultiInstanceItemComponent } from './services/cardview-properties/multi-instance-item/multi-instance-item.component';
import { ClipboardService } from './services/clipboard/clipboard.service';
import { CardViewMessagePayloadItemComponent } from './services/cardview-properties/message-payload-item/message-payload-item.component';
import { CardViewMessageVariableMappingComponent } from './services/cardview-properties/message-variable-mapping/message-variable-mapping.component';
import { CardViewDueDateItemComponent } from './services/cardview-properties/due-date-item/due-date-item.component';
import { MessagesDialogComponent } from './components/process-modeler/messages/messages-dialog.component';
import { MessagesService } from './services/messages.service';
import { AssignmentDialogComponent } from './components/assignment/assignment-dialog.component';
import { ProcessTaskAssignmentEffects } from './store/process-task-assignment.effects';
import { CardViewTaskAssignmentItemComponent } from './services/cardview-properties/task-assignment-item/task-assignment-item.component';
import { TaskAssignmentService } from './services/cardview-properties/task-assignment-item/task-assignment.service';
import { transformJsonSchema } from './services/transformJsonSchema';
import { CardViewProcessNameItemComponent } from './services/cardview-properties/process-name-item/process-name-item.component';
import { ProcessConnectorService } from './services/process-connector-service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        ProcessServicesCloudModule,
        ProcessEditorRoutingModule,
        EffectsModule.forFeature([ProcessEditorEffects, ProcessVariablesEffects, ProcessMessagesEffects, ProcessTaskAssignmentEffects]),
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
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
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
        CardViewScriptTaskItemComponent,
        CardViewDefaultSequenceFlowItemComponent,
        CardViewCalledItemItemComponent,
        CardViewSignalRefItemComponent,
        CardViewErrorRefItemComponent,
        CardViewTimerDefinitionItemComponent,
        CardViewMessageItemComponent,
        CardViewMessageVariableMappingComponent,
        CardViewProcessMessagesItemComponent,
        CardViewMessagePayloadItemComponent,
        CardViewMultiInstanceItemComponent,
        CardViewDueDateItemComponent,
        AssignmentDialogComponent,
        CardViewTaskAssignmentItemComponent,
        CardViewProcessNameItemComponent
    ],
    entryComponents: [
        CardViewProcessVariablesItemComponent,
        CardViewTaskAssignmentItemComponent,
        CardViewImplementationItemComponent,
        CardViewDecisionTaskItemComponent,
        CardViewScriptTaskItemComponent,
        CardViewDefaultSequenceFlowItemComponent,
        CardViewSignalRefItemComponent,
        CardViewErrorRefItemComponent,
        CardViewCalledItemItemComponent,
        CardViewTimerDefinitionItemComponent,
        CardViewMessageItemComponent,
        CardViewMessageVariableMappingComponent,
        CardViewProcessMessagesItemComponent,
        ProcessEditorComponent,
        MessagesDialogComponent,
        CardViewMultiInstanceItemComponent,
        CardViewMessagePayloadItemComponent,
        CardViewDueDateItemComponent,
        AssignmentDialogComponent,
        CardViewProcessNameItemComponent
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
        TaskAssignmentService,
        Title,
        provideTranslations('process-editor'),
        ...providePaletteHandler('tool', ToolsHandler),
        ...providePaletteHandler('element', ElementCreationHandler),
        providePaletteElements(paletteElements),
        providePropertyHandler(BpmnCompositeProperty.properties, CardViewProcessVariablesItemComponent),
        providePropertyHandler(BpmnCompositeProperty.assignment, CardViewTaskAssignmentItemComponent),
        providePropertyHandler(BpmnProperty.implementation, CardViewImplementationItemComponent),
        providePropertyHandler(BpmnProperty.decisionTask, CardViewDecisionTaskItemComponent),
        providePropertyHandler(BpmnProperty.scriptTask, CardViewScriptTaskItemComponent),
        providePropertyHandler(BpmnProperty.formKey, CardViewTextItemComponent),
        providePropertyHandler(BpmnProperty.defaultSequenceFlow, CardViewDefaultSequenceFlowItemComponent),
        providePropertyHandler(BpmnProperty.signalRef, CardViewSignalRefItemComponent),
        providePropertyHandler(BpmnProperty.errorRef, CardViewErrorRefItemComponent),
        providePropertyHandler(BpmnProperty.calledElement, CardViewCalledItemItemComponent),
        providePropertyHandler(BpmnProperty.timerEventDefinition, CardViewTimerDefinitionItemComponent),
        providePropertyHandler(BpmnProperty.messageRef, CardViewMessageItemComponent),
        providePropertyHandler(BpmnCompositeProperty.messages, CardViewProcessMessagesItemComponent),
        providePropertyHandler(BpmnProperty.multiInstanceType, CardViewMultiInstanceItemComponent),
        providePropertyHandler(BpmnProperty.messagePayload, CardViewMessagePayloadItemComponent),
        providePropertyHandler(BpmnProperty.dueDate, CardViewDueDateItemComponent),
        providePropertyHandler(BpmnProperty.processName, CardViewProcessNameItemComponent),
        ...getProcessesFilterProvider(),
        ...getProcessCreatorProvider(),
        ...getProcessUploaderProvider(),
        provideLogFilter(getProcessLogInitiator()),
        provideLoadableModelSchema({
            modelType: PROCESS,
            schemaKey: MODEL_SCHEMA_TYPE.PROCESS_EXTENSION,
            transform: transformJsonSchema
        }),
        ProcessConnectorService
    ]
})
export class ProcessEditorModule {}
