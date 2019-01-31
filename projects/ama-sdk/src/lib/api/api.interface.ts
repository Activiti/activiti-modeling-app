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

import { Injectable } from '@angular/core';
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
