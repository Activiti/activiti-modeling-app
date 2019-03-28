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
import { CoreModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';

import { ConnectorEditorComponent } from './components/connector-editor/connector-editor.component';
import { ConnectorEditorRoutingModule } from './router/connector-editor-routing.module';
import { ConnectorHeaderComponent } from './components/connector-header/connector-header.component';
import {
    CodeEditorModule,
    provideEntity,
    ENTITIES_REDUCER_TOKEN,
    SharedModule,
    provideTranslations,
    CONNECTOR,
    CONNECTOR_API_TOKEN,
    CONNECTORS_ENTITY_NAME,
    registerModel
} from 'ama-sdk';
import { EffectsModule } from '@ngrx/effects';
import { ConnectorEditorEffects } from './store/connector-editor.effects';
import { ConnectorEditorService } from './services/connector-editor.service';
import { StoreModule } from '@ngrx/store';
import { CONNECTOR_EDITOR_STATE_NAME } from './store/connector-editor.selectors';
import { connectorEditorReducer } from './store/connector-editor.reducer';
import { connectorEntitiesReducer } from './store/connector-entities.reducer';
import { getConnectorsFilterProvider } from './extension/connectors-filter.extension';
import { getConnectorCreatorProvider } from './extension/connector-creator.extension';
import { getConnectorUploaderProvider } from './extension/connector-uploader.extension';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        ExtensionsModule,
        ConnectorEditorRoutingModule,
        SharedModule,
        CodeEditorModule,
        EffectsModule.forFeature([ConnectorEditorEffects]),
        StoreModule.forFeature('entities', ENTITIES_REDUCER_TOKEN),
        StoreModule.forFeature(CONNECTOR_EDITOR_STATE_NAME, connectorEditorReducer)
    ],
    declarations: [
        ConnectorEditorComponent,
        ConnectorHeaderComponent
    ],
    exports: [ ConnectorEditorRoutingModule ],
    providers: [
        ConnectorEditorService,
        provideTranslations('connector-editor'),
        ...registerModel(CONNECTOR, CONNECTOR_API_TOKEN, CONNECTORS_ENTITY_NAME),
        provideEntity({ connectors: connectorEntitiesReducer }),
        ...getConnectorsFilterProvider(),
        ...getConnectorCreatorProvider(),
        ...getConnectorUploaderProvider()
    ]
})
export class ConnectorEditorModule {}
