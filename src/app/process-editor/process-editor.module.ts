 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { CoreModule, CardViewTextItemComponent } from '@alfresco/adf-core';
import { EffectsModule } from '@ngrx/effects';
import { ProcessEditorComponent } from './components/process-editor/process-editor.component';
import { ProcessModelerComponent } from './components/process-modeler/process-modeler.component';
import { ProcessHeaderComponent } from './components/process-header/process-header.component';
import { ProcessModelerService } from './services/process-modeler.service';
import { ProcessEditorService } from './services/process-editor.service';
import { ProcessEditorEffects } from './store/process-editor.effects';
import { processEditorReducer } from './store/process-editor.reducer';
import { StoreModule } from '@ngrx/store';
import { ProcessEditorRoutingModule } from './router/process-editor-routing.module';
import { CardViewPropertiesFactory } from './services/cardview-properties/cardview-properties.factory';
import { Title } from '@angular/platform-browser';
import { AmaTitleService, ENTITIES_REDUCER_TOKEN, provideEntity, PROCESS_EDITOR_STATE_NAME, providePropertyHandler, BpmnProperty } from 'ama-sdk';
import { BpmnFactoryService } from './services/bpmn-factory.service';
import { BpmnFactoryToken } from './services/bpmn-factory.token';
import { SharedModule } from 'ama-sdk';
import { CardViewProcessVariablesItemComponent } from './services/cardview-properties/process-variable-item/process-variable-item.component';
import { CardViewImplementationItemComponent } from './services/cardview-properties/implementation-item/implementation-item.component';
import { VariablesModule } from 'ama-sdk';
import { ProcessPropertiesComponent } from './components/process-properties/process-properties.component';
import { MatTooltipModule } from '@angular/material';
import { getProcessesFilterProvider } from './extension/processes-filter.extension';
import { getProcessCreatorProvider } from './extension/process-creator.extension';
import { getProcessUploaderProvider } from './extension/process-uploader.extension';
import { processEntitiesReducer } from './store/process-entities.reducer';
import { ProcessVariablesEffects } from './store/process-variables.effects';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        ProcessEditorRoutingModule,
        EffectsModule.forFeature([ProcessEditorEffects, ProcessVariablesEffects]),
        StoreModule.forFeature('entities', ENTITIES_REDUCER_TOKEN),
        StoreModule.forFeature(PROCESS_EDITOR_STATE_NAME, processEditorReducer),
        SharedModule,
        VariablesModule,
        MatTooltipModule
    ],
    declarations: [
        ProcessEditorComponent,
        ProcessHeaderComponent,
        ProcessModelerComponent,
        ProcessPropertiesComponent,
        CardViewProcessVariablesItemComponent,
        CardViewImplementationItemComponent
    ],
    entryComponents: [
        CardViewProcessVariablesItemComponent,
        CardViewImplementationItemComponent,
        ProcessEditorComponent
    ],
    exports: [ProcessEditorRoutingModule],
    providers: [
        ProcessEditorService,
        { provide: BpmnFactoryToken, useClass: BpmnFactoryService },
        ProcessModelerService,
        CardViewPropertiesFactory,
        AmaTitleService,
        Title,
        provideEntity({ processes: processEntitiesReducer }),
        providePropertyHandler(BpmnProperty.properties, CardViewProcessVariablesItemComponent),
        providePropertyHandler(BpmnProperty.implementation, CardViewImplementationItemComponent),
        providePropertyHandler(BpmnProperty.formKey, CardViewTextItemComponent),
        ...getProcessesFilterProvider(),
        ...getProcessCreatorProvider(),
        ...getProcessUploaderProvider()
    ]
})
export class ProcessEditorModule {}
