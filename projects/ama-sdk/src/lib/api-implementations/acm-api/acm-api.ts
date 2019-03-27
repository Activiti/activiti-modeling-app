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

import { Injectable, Inject } from '@angular/core';
import {
    AmaApi,
    CONNECTOR_API_TOKEN,
    UI_API_TOKEN,
    PROCESS_API_TOKEN,
    FORM_API_TOKEN,
    DECISION_TABLE_API_TOKEN,
    DATA_API_TOKEN
} from '../../api/api.interface';
import { ACMProjectApi } from './project-api';
import { ModelApiInterface } from '../../api/generalmodel-api.interface';
import {
    Connector as ConnectorType,
    ConnectorContent,
    Form as FormType,
    Ui as UiType,
    Process as ProcessType,
    ProcessContent,
    DecisionTable as DecisionTableType,
    DecisionTableContent,
    UiContent,
    Data as DataType,
    DataContent,
    FormContent
} from '../../api/types';

@Injectable()
export class ACMApi implements AmaApi {
    constructor(
        public Project: ACMProjectApi,
        @Inject(PROCESS_API_TOKEN) public Process: ModelApiInterface<ProcessType, ProcessContent>,
        @Inject(CONNECTOR_API_TOKEN) public Connector: ModelApiInterface<ConnectorType, ConnectorContent>,
        @Inject(FORM_API_TOKEN) public Form: ModelApiInterface<FormType, FormContent>,
        @Inject(DECISION_TABLE_API_TOKEN) public DecisionTable: ModelApiInterface<DecisionTableType, DecisionTableContent>,
        @Inject(UI_API_TOKEN) public Ui: ModelApiInterface<UiType, UiContent>,
        @Inject(DATA_API_TOKEN) public Data: ModelApiInterface<DataType, DataContent>
    ) {}
}
