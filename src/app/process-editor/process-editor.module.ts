import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@alfresco/adf-core';
import { EffectsModule } from '@ngrx/effects';
import { ProcessEditorComponent } from './components/process-editor/process-editor.component';
import { ProcessModelerComponent } from './components/process-modeler/process-modeler.component';
import { ProcessHeaderComponent } from './components/process-header/process-header.component';
import { ProcessModelerService } from './services/process-modeler.service';
import { ProcessEditorService } from './services/process-editor.service';
import { ProcessEditorEffects } from './store/process-editor.effects';
import { PROCESS_EDITOR_STATE_NAME } from './store/process-editor.selectors';
import { processEditorReducer } from './store/process-editor.reducer';
import { StoreModule } from '@ngrx/store';
import { ProcessEditorRoutingModule } from './router/process-editor-routing.module';
import { VariablesEffects } from './store/process-variables.effects';
import { CardViewPropertiesFactory } from './services/cardview-properties/cardview-properties.factory';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AmaTitleService } from 'ama-sdk';
import { BpmnFactoryService } from './services/bpmn-factory.service';
import { BpmnFactoryToken } from './services/bpmn-factory.token';
import { SharedModule } from 'ama-sdk';
import { CardViewProcessVariablesItemComponent } from './services/cardview-properties/process-variable-item/process-variable-item.component';
import { CardViewImplementationItemComponent } from './services/cardview-properties/implementation-item/implementation-item.component';
import { ProcessVariablesModule } from '../process-variables/process-variables.module';
import { ProcessPropertiesComponent } from './components/process-properties/process-properties.component';
import { MatTooltipModule } from '../../../node_modules/@angular/material';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ProcessEditorRoutingModule,
        StoreModule.forFeature(PROCESS_EDITOR_STATE_NAME, processEditorReducer),
        EffectsModule.forFeature([ProcessEditorEffects, VariablesEffects]),
        BrowserModule,
        SharedModule,
        ProcessVariablesModule,
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
        CardViewImplementationItemComponent
    ],
    exports: [ProcessEditorRoutingModule],
    providers: [
        ProcessEditorService,
        { provide: BpmnFactoryToken, useClass: BpmnFactoryService },
        ProcessModelerService,
        CardViewPropertiesFactory,
        AmaTitleService,
        Title
    ]
})
export class ProcessEditorModule {}
