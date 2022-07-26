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
import { ProcessModelerServiceImplementation } from './services/process-modeler.service';
import { ProcessEditorService } from './services/process-editor.service';
import { ProcessEditorEffects } from './store/process-editor.effects';
import { StoreModule } from '@ngrx/store';
import { CardViewPropertiesFactory } from './services/cardview-properties/cardview-properties.factory';
import { Title } from '@angular/platform-browser';
import {
    AmaStoreModule,
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
    BpmnCompositeProperty,
    ProcessNameSelectorModule,
    VariableMappingTypeModule,
    provideProcessEditorElementVariablesProvider,
    ModelEditorModule,
    ModelEntitySelectors
} from '@alfresco-dbp/modeling-shared/sdk';
import { BpmnFactoryService } from './services/bpmn-factory.service';
import { ProcessDiagramLoaderService } from './services/process-diagram-loader.service';
import { CardViewProcessVariablesItemComponent } from './services/cardview-properties/process-variable-item/process-variable-item.component';
import { CardViewImplementationItemComponent } from './services/cardview-properties/implementation-item/implementation-item.component';
import { CardViewDecisionTaskItemComponent } from './services/cardview-properties/decision-task-item/decision-task-item.component';
import { CardViewScriptTaskItemComponent } from './services/cardview-properties/script-task-item/script-task-item.component';
import { ProcessPropertiesComponent } from './components/process-properties/process-properties.component';
import { getProcessesFilterProvider } from './extension/processes-filter.extension';
import { getProcessCreatorProvider } from './extension/process-creator.extension';
import { getProcessUploaderProvider } from './extension/process-uploader.extension';
import { processEntitiesReducer } from './store/process-entities.reducer';
import { ProcessVariablesEffects } from './store/process-variables.effects';
import { processEditorReducer } from './store/process-editor.reducer';
import { PROCESS_EDITOR_STATE_NAME, PROCESS_MODEL_ENTITY_SELECTORS } from './store/process-editor.selectors';
import { CardViewDefaultSequenceFlowItemComponent } from './services/cardview-properties/default-sequence-flow/default-sequence-flow-item.component';
import { PaletteComponent } from './components/process-modeler/palette/palette.component';
import { ProcessModelerPaletteService } from './services/palette/process-modeler-palette.service';
import { ElementCreationHandler } from './services/palette/handlers/element-creation';
import { ToolsHandler } from './services/palette/handlers/tools';
// Angular can't bundle json data into prod build, that is why the file is .json.ts
import { paletteElements } from './config/palette-elements.json';
import { CardViewSignalRefItemComponent } from './services/cardview-properties/signal-ref-item/signal-ref-item.component';
import { CalledElementComponent } from './services/cardview-properties/called-element-item/called-element-item.component';
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
import { transformJsonSchema } from './services/transform-json-schema';
import { CardViewProcessNameItemComponent } from './services/cardview-properties/process-name-item/process-name-item.component';
import { ProcessConnectorService } from './services/process-connector-service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CalledElementDialogComponent } from './services/cardview-properties/called-element-item/called-element-dialog/called-element-dialog.component';
import { ProcessErrorsEffects } from './store/process-errors.effects';
import { ProcessErrorsDialogComponent } from './components/process-modeler/process-errors/process-errors-dialog.component';
import { CardViewProcessErrorsItemComponent } from './services/cardview-properties/process-errors-item/process-errors-item.component';
import { CardViewConditionExpressionItemComponent } from './services/cardview-properties/condition-expression-item/condition-expression-item.component';
import { ProcessElementVariablesProviderService } from './services/process-element-variables-provider.service';
import { CalledElementVariablesProviderService } from './services/called-element-variables-provider.service';
import { SaveProcessCommand } from './services/commands/save-process.command';
import { CreateProcessDialogComponent } from './components/create-process-dialog/create-process-dialog.component';
import { ProcessCategorySelectorComponent } from './components/process-category-selector/process-category-selector.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CardProcessCategoryItemComponent } from './services/cardview-properties/process-category-item/process-category-item.component';
import { DeleteProcessCommand } from './services/commands/delete-process.command';
import { ValidateProcessCommand } from './services/commands/validate-process.command';
import { DownloadProcessCommand } from './services/commands/download-process.command';
import { ParticipantElementVariablesProviderService } from './services/participant-element-variables-provider.service';
import { SaveAsProcessCommand } from './services/commands/save-as-process.command';
import { DownloadProcessSVGImageCommand } from './services/commands/download-process-svg-image.command';
import { CardProcessVersionItemComponent } from './services/cardview-properties/process-version-item/process-version-item.component';
import { ProcessModelerActionsComponent } from './components/process-modeler/process-modeler-actions/process-modeler-actions.component';
import { provideRoutes } from '@angular/router';
import { processEditorTabRoutes } from './router/process-editor-tab.routes';
import { ProcessesLoaderGuard } from './router/guards/processes-loader.guard';
import { ProcessDeactivateGuard } from './router/guards/process-deactivate.guard';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        ProcessServicesCloudModule,
        EffectsModule.forFeature([
            ProcessEditorEffects,
            ProcessVariablesEffects,
            ProcessMessagesEffects,
            ProcessTaskAssignmentEffects,
            ProcessErrorsEffects
        ]),
        AmaStoreModule.registerEntity({
            key: PROCESSES_ENTITY_KEY,
            reducer: processEntitiesReducer
        }),
        ModelEditorModule.forChild({
            type: PROCESS,
            componentClass: ProcessEditorComponent
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
        MatAutocompleteModule,
        CodeEditorModule,
        DragDropModule,
        InputMappingTableModule,
        OutputMappingTableModule,
        ProcessNameSelectorModule,
        VariableMappingTypeModule
    ],
    declarations: [
        ProcessEditorComponent,
        PaletteComponent,
        ProcessModelerComponent,
        ProcessModelerActionsComponent,
        ProcessPropertiesComponent,
        MessagesDialogComponent,
        ProcessErrorsDialogComponent,
        CardViewProcessVariablesItemComponent,
        CardViewImplementationItemComponent,
        CardViewDecisionTaskItemComponent,
        CardViewScriptTaskItemComponent,
        CardViewDefaultSequenceFlowItemComponent,
        CalledElementComponent,
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
        CardViewProcessNameItemComponent,
        CalledElementDialogComponent,
        CardViewProcessErrorsItemComponent,
        CardProcessCategoryItemComponent,
        CardViewConditionExpressionItemComponent,
        CreateProcessDialogComponent,
        ProcessCategorySelectorComponent,
        CardProcessVersionItemComponent
    ],
    providers: [
        DeleteProcessCommand,
        SaveProcessCommand,
        ValidateProcessCommand,
        DownloadProcessCommand,
        SaveAsProcessCommand,
        DownloadProcessSVGImageCommand,
        ProcessEditorService,
        ProcessDiagramLoaderService,
        ProcessesLoaderGuard,
        ProcessDeactivateGuard,
        { provide: BpmnFactoryToken, useClass: BpmnFactoryService },
        { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
        ProcessModelerPaletteService,
        ClipboardService,
        CardViewPropertiesFactory,
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
        providePropertyHandler(BpmnProperty.calledElement, CalledElementComponent),
        providePropertyHandler(BpmnProperty.timerEventDefinition, CardViewTimerDefinitionItemComponent),
        providePropertyHandler(BpmnProperty.messageRef, CardViewMessageItemComponent),
        providePropertyHandler(BpmnCompositeProperty.messages, CardViewProcessMessagesItemComponent),
        providePropertyHandler(BpmnCompositeProperty.errors, CardViewProcessErrorsItemComponent),
        providePropertyHandler(BpmnProperty.multiInstanceType, CardViewMultiInstanceItemComponent),
        providePropertyHandler(BpmnProperty.messagePayload, CardViewMessagePayloadItemComponent),
        providePropertyHandler(BpmnProperty.dueDate, CardViewDueDateItemComponent),
        providePropertyHandler(BpmnProperty.processName, CardViewProcessNameItemComponent),
        providePropertyHandler(BpmnProperty.conditionExpression, CardViewConditionExpressionItemComponent),
        providePropertyHandler(BpmnProperty.category, CardProcessCategoryItemComponent),
        providePropertyHandler(BpmnProperty.version, CardProcessVersionItemComponent),
        ...getProcessesFilterProvider(),
        ...getProcessCreatorProvider(),
        ...getProcessUploaderProvider(),
        provideRoutes(processEditorTabRoutes),
        provideLogFilter(getProcessLogInitiator()),
        provideLoadableModelSchema({
            modelType: PROCESS,
            schemaKey: MODEL_SCHEMA_TYPE.PROCESS_EXTENSION,
            transform: transformJsonSchema
        }),
        ProcessConnectorService,
        provideProcessEditorElementVariablesProvider(ProcessElementVariablesProviderService),
        provideProcessEditorElementVariablesProvider(CalledElementVariablesProviderService),
        provideProcessEditorElementVariablesProvider(ParticipantElementVariablesProviderService),
        {
            provide: PROCESS_MODEL_ENTITY_SELECTORS,
            useFactory: () => new ModelEntitySelectors(PROCESSES_ENTITY_KEY),
        }
    ]
})
export class ProcessEditorModule {

}
