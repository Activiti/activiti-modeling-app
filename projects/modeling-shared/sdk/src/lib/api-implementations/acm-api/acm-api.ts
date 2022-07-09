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

import { Inject, Injectable } from '@angular/core';
import {
    AmaApi,
    AUTHENTICATION_API_TOKEN,
    CONNECTOR_API_TOKEN,
    CONTENT_MODEL_API_TOKEN,
    DATA_API_TOKEN,
    DECISION_TABLE_API_TOKEN,
    FILE_API_TOKEN,
    FORM_API_TOKEN,
    FORM_WIDGET_API_TOKEN,
    HXP_DOC_TYPE_API_TOKEN,
    HXP_MIXIN_API_TOKEN,
    HXP_SCHEMA_API_TOKEN,
    PROCESS_API_TOKEN,
    SCRIPT_API_TOKEN,
    TRIGGER_API_TOKEN,
    UI_API_TOKEN
} from '../../api/api.interface';
import { ACMProjectApi } from './project-api';
import { ModelApiInterface } from '../../api/generalmodel-api.interface';
import {
    ActivitiFile,
    ActivitiFileContent,
    ActivitiScript,
    ActivitiScriptContent,
    Authentication,
    Connector as ConnectorType,
    ConnectorContent,
    ContentModel,
    ContentModelXML,
    Data as DataType,
    DecisionTable as DecisionTableType,
    DecisionTableContent,
    Form as FormType,
    FormContent,
    HxPDocumentType,
    HxPMixin,
    HxPSchema,
    JSONSchemaInfoBasics,
    Process as ProcessType,
    ProcessContent,
    Trigger,
    TriggerContent,
    Ui as UiType,
    UiContent,
    Widget,
    WidgetContent
} from '../../api/types';
import { AuthenticationContent } from '../../api/authentication/authentication.interface';

@Injectable()
export class ACMApi implements AmaApi {
    constructor(
        public Project: ACMProjectApi,
        @Inject(PROCESS_API_TOKEN) public Process: ModelApiInterface<ProcessType, ProcessContent>,
        @Inject(CONNECTOR_API_TOKEN) public Connector: ModelApiInterface<ConnectorType, ConnectorContent>,
        @Inject(FORM_API_TOKEN) public Form: ModelApiInterface<FormType, FormContent>,
        @Inject(DECISION_TABLE_API_TOKEN) public DecisionTable: ModelApiInterface<DecisionTableType, DecisionTableContent>,
        @Inject(UI_API_TOKEN) public Ui: ModelApiInterface<UiType, UiContent>,
        @Inject(DATA_API_TOKEN) public Data: ModelApiInterface<DataType, JSONSchemaInfoBasics>,
        @Inject(FILE_API_TOKEN) public File: ModelApiInterface<ActivitiFile, ActivitiFileContent>,
        @Inject(SCRIPT_API_TOKEN) public script: ModelApiInterface<ActivitiScript, ActivitiScriptContent>,
        @Inject(TRIGGER_API_TOKEN) public trigger: ModelApiInterface<Trigger, TriggerContent>,
        @Inject(CONTENT_MODEL_API_TOKEN) public contentModel: ModelApiInterface<ContentModel, ContentModelXML>,
        @Inject(FORM_WIDGET_API_TOKEN) public  formWidget: ModelApiInterface<Widget, WidgetContent>,
        @Inject(AUTHENTICATION_API_TOKEN) public  authentication: ModelApiInterface<Authentication, AuthenticationContent>,
        @Inject(HXP_DOC_TYPE_API_TOKEN) public hxpDocumentType: ModelApiInterface<HxPDocumentType, JSONSchemaInfoBasics>,
        @Inject(HXP_MIXIN_API_TOKEN) public hxpMixin: ModelApiInterface<HxPMixin, JSONSchemaInfoBasics>,
        @Inject(HXP_SCHEMA_API_TOKEN) public hxpSchema: ModelApiInterface<HxPSchema, JSONSchemaInfoBasics>
    ) {}
}
