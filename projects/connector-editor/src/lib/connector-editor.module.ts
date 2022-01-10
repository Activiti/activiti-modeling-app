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
    SharedModule,
    provideTranslations,
    CONNECTORS_ENTITY_KEY,
    AmaStoreModule,
    provideLogFilter,
    selectProjectConnectorsArray,
    CONNECTOR_SELECTORS_TOKEN,
    provideLoadableModelSchema,
    CONNECTOR,
    MODEL_SCHEMA_TYPE,
    getExtensionErrorProvider,
    ModelEditorModule,
} from '@alfresco-dbp/modeling-shared/sdk';
import { EffectsModule } from '@ngrx/effects';
import { ConnectorEditorEffects } from './store/connector-editor.effects';
import { StoreModule } from '@ngrx/store';
import { CONNECTOR_EDITOR_STATE_NAME } from './store/connector-editor.selectors';
import { connectorEditorReducer } from './store/connector-editor.reducer';
import { connectorEntitiesReducer } from './store/connector-entities.reducer';
import { getConnectorsFilterProvider } from './extension/connectors-filter.extension';
import { getConnectorCreatorProvider } from './extension/connector-creator.extension';
import { getConnectorUploaderProvider } from './extension/connector-uploader.extension';
import { ConnectorErrorProviderService } from './services/connector-error-provider.service';
import { getConnectorLogInitiator } from './services/connector-editor.constants';
import { SaveConnectorCommand } from './services/commands/save-connector.command';
import { DeleteConnectorCommand } from './services/commands/delete-connector.command';
import { SaveAsConnectorCommand } from './services/commands/save-as-connector.command';
import { DownloadConnectorCommand } from './services/commands/download-connector.command';
import { ValidateConnectorCommand } from './services/commands/validate-connector.command';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        ExtensionsModule,
        ConnectorEditorRoutingModule,
        SharedModule,
        CodeEditorModule,
        EffectsModule.forFeature([ConnectorEditorEffects]),
        AmaStoreModule.registerEntity({
            key: CONNECTORS_ENTITY_KEY,
            reducer: connectorEntitiesReducer
        }),
        ModelEditorModule.forChild({
            type: CONNECTOR,
            componentClass: ConnectorEditorComponent
        }),
        StoreModule.forFeature(CONNECTOR_EDITOR_STATE_NAME, connectorEditorReducer)
    ],
    declarations: [
        ConnectorEditorComponent,
        ConnectorHeaderComponent,
    ],
    exports: [ ConnectorEditorRoutingModule ],
    providers: [
        DeleteConnectorCommand,
        DownloadConnectorCommand,
        SaveConnectorCommand,
        SaveAsConnectorCommand,
        ValidateConnectorCommand,
        provideTranslations('connector-editor'),
        ...getConnectorsFilterProvider(),
        ...getConnectorCreatorProvider(),
        ...getConnectorUploaderProvider(),
        ...getExtensionErrorProvider(ConnectorErrorProviderService),
        provideLogFilter(getConnectorLogInitiator()),
        provideLoadableModelSchema({
            modelType: CONNECTOR,
            schemaKey: MODEL_SCHEMA_TYPE.CONNECTOR
        }),
        { provide: CONNECTOR_SELECTORS_TOKEN, useValue: selectProjectConnectorsArray }
    ]
})
export class ConnectorEditorModule {}
