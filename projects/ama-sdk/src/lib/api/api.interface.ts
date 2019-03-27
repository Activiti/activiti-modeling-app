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

import { Injectable, InjectionToken } from '@angular/core';
import { ProjectApi } from './project-api.interface';
import { ModelApiInterface } from './generalmodel-api.interface';
import {
    Process,
    ProcessContent,
    Connector,
    ConnectorContent,
    Form,
    FormContent,
    Ui,
    UiContent,
    DecisionTable,
    DecisionTableContent,
    Data,
    DataContent
} from './types';

export const PROCESSES_ENTITY_NAME = 'processes';
export const CONNECTORS_ENTITY_NAME = 'connectors';
export const FORMS_ENTITY_NAME = 'forms';
export const UIS_ENTITY_NAME = 'uis';
export const DECISION_TABLES_ENTITY_NAME = 'decision-tables';
export const DATA_ENTITY_NAME = 'data';

export const PROCESS_API_TOKEN = new InjectionToken<ModelApiInterface<Process, ProcessContent>>('connector-api');
export const CONNECTOR_API_TOKEN = new InjectionToken<ModelApiInterface<Connector, ConnectorContent>>('connector-api');
export const FORM_API_TOKEN = new InjectionToken<ModelApiInterface<Form, FormContent>>('form-api');
export const UI_API_TOKEN = new InjectionToken<ModelApiInterface<Ui, UiContent>>('ui-api');
export const DECISION_TABLE_API_TOKEN = new InjectionToken<ModelApiInterface<DecisionTable, DecisionTableContent>>('connector-api');
export const DATA_API_TOKEN = new InjectionToken<ModelApiInterface<Data, DataContent>>('data-api');

@Injectable()
export abstract class AmaApi {
    public Project: ProjectApi;
    public Process: ModelApiInterface<Process, ProcessContent>;
    public Connector: ModelApiInterface<Connector, ConnectorContent>;
    public Form: ModelApiInterface<Form, FormContent>;
    public Ui: ModelApiInterface<Ui, UiContent>;
    public Data: ModelApiInterface<Data, DataContent>;
    public DecisionTable: ModelApiInterface<DecisionTable, DecisionTableContent>;
}
