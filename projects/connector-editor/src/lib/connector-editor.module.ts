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
    CONNECTOR_MODEL_ENTITY_SELECTORS,
    ModelEntitySelectors
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
import { ConnectorsLoaderGuard } from './router/guards/connectors-loader.guard';
import { provideRoutes } from '@angular/router';
import { connectorEditorTabRoutes } from './router/connector-editor-tab.routes';

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        ExtensionsModule,
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
    ],
    providers: [
        DeleteConnectorCommand,
        DownloadConnectorCommand,
        SaveConnectorCommand,
        SaveAsConnectorCommand,
        ValidateConnectorCommand,
        ConnectorsLoaderGuard,
        provideTranslations('connector-editor'),
        ...getConnectorsFilterProvider(),
        ...getConnectorCreatorProvider(),
        ...getConnectorUploaderProvider(),
        ...getExtensionErrorProvider(ConnectorErrorProviderService),
        provideLogFilter(getConnectorLogInitiator()),
        provideRoutes(connectorEditorTabRoutes),
        provideLoadableModelSchema({
            modelType: CONNECTOR,
            schemaKey: MODEL_SCHEMA_TYPE.CONNECTOR
        }),
        { provide: CONNECTOR_SELECTORS_TOKEN, useValue: selectProjectConnectorsArray },
        {
            provide: CONNECTOR_MODEL_ENTITY_SELECTORS,
            useFactory: () => new ModelEntitySelectors(CONNECTORS_ENTITY_KEY),
        }
    ]
})
export class ConnectorEditorModule {
}
