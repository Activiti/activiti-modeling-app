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

import { Injectable, Inject } from '@angular/core';
import { AmaApi } from '../../api/api.interface';
import { ACMProjectApi } from './project-api';
import { UI_API } from './model-variations/ui-api-variation';
import { DECISION_TABLE_API } from './model-variations/decision-table-api-variations';
import { ModelApiInterface } from '../../api/generalmodel-api.interface';
import { CONNECTOR_API } from './model-variations/connector-api-variation';
import { FORM_API } from './model-variations/form-api-variation';
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
import { PROCESS_API } from './model-variations/process-api-variation';
import { DATA_API } from './model-variations/data-api-variation';

@Injectable()
export class ACMApi implements AmaApi {
    constructor(
        public Project: ACMProjectApi,
        @Inject(PROCESS_API) public Process: ModelApiInterface<ProcessType, ProcessContent>,
        @Inject(CONNECTOR_API) public Connector: ModelApiInterface<ConnectorType, ConnectorContent>,
        @Inject(FORM_API) public Form: ModelApiInterface<FormType, FormContent>,
        @Inject(DECISION_TABLE_API) public DecisionTable: ModelApiInterface<DecisionTableType, DecisionTableContent>,
        @Inject(UI_API) public Ui: ModelApiInterface<UiType, UiContent>,
        @Inject(DATA_API) public Data: ModelApiInterface<DataType, DataContent>
    ) {}
}
