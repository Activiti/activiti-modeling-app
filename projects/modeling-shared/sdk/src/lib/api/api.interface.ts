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
    ActivitiFile,
    ActivitiFileContent,
    ActivitiScript,
    ActivitiScriptContent,
    Connector,
    ConnectorContent,
    ContentModel,
    ContentModelXML,
    Data,
    JSONSchemaInfoBasics,
    DecisionTable,
    DecisionTableContent,
    Form,
    FormContent,
    Process,
    ProcessContent,
    Trigger,
    TriggerContent,
    Ui,
    UiContent,
    Widget,
    WidgetContent,
    Authentication,
    HxPDocumentType,
    HxPMixin,
    HxPSchema
} from './types';
import { ModelSchemaApi } from './model-schema-api.interface';
import { AuthenticationContent } from './authentication/authentication.interface';

export const PROCESS_API_TOKEN = new InjectionToken<ModelApiInterface<Process, ProcessContent>>('connector-api');
export const CONNECTOR_API_TOKEN = new InjectionToken<ModelApiInterface<Connector, ConnectorContent>>('connector-api');
export const FORM_API_TOKEN = new InjectionToken<ModelApiInterface<Form, FormContent>>('form-api');
export const UI_API_TOKEN = new InjectionToken<ModelApiInterface<Ui, UiContent>>('ui-api');
export const DECISION_TABLE_API_TOKEN = new InjectionToken<ModelApiInterface<DecisionTable, DecisionTableContent>>('connector-api');
export const DATA_API_TOKEN = new InjectionToken<ModelApiInterface<Data, JSONSchemaInfoBasics>>('data-api');
export const FILE_API_TOKEN = new InjectionToken<ModelApiInterface<ActivitiFile, ActivitiFileContent>>('file-api');
export const SCHEMA_API_TOKEN = new InjectionToken<ModelSchemaApi>('schema-api');
export const SCRIPT_API_TOKEN = new InjectionToken<ModelApiInterface<ActivitiScript, ActivitiScriptContent>>('script-api');
export const TRIGGER_API_TOKEN = new InjectionToken<ModelApiInterface<Trigger, TriggerContent>>('trigger-api');
export const CONTENT_MODEL_API_TOKEN = new InjectionToken<ModelApiInterface<ContentModel, ContentModelXML>>('content-model-api');
export const FORM_WIDGET_API_TOKEN = new InjectionToken<ModelApiInterface<Widget, WidgetContent>>('form-widget-api');
export const AUTHENTICATION_API_TOKEN = new InjectionToken<ModelApiInterface<Authentication, AuthenticationContent>>('authentication-api');
export const HXP_DOC_TYPE_API_TOKEN = new InjectionToken<ModelApiInterface<HxPDocumentType, JSONSchemaInfoBasics>>('hxp-document-type-api');
export const HXP_MIXIN_API_TOKEN = new InjectionToken<ModelApiInterface<HxPMixin, JSONSchemaInfoBasics>>('hxp-schema-api');
export const HXP_SCHEMA_API_TOKEN = new InjectionToken<ModelApiInterface<HxPSchema, JSONSchemaInfoBasics>>('hxp-schema-api');

@Injectable()
export abstract class AmaApi {
    public Project: ProjectApi;
    public Process: ModelApiInterface<Process, ProcessContent>;
    public Connector: ModelApiInterface<Connector, ConnectorContent>;
    public Form: ModelApiInterface<Form, FormContent>;
    public Ui: ModelApiInterface<Ui, UiContent>;
    public Data: ModelApiInterface<Data, JSONSchemaInfoBasics>;
    public DecisionTable: ModelApiInterface<DecisionTable, DecisionTableContent>;
    public File: ModelApiInterface<ActivitiFile, ActivitiFileContent>;
    public script: ModelApiInterface<ActivitiScript, ActivitiScriptContent>;
    public trigger: ModelApiInterface<Trigger, TriggerContent>;
    public contentModel: ModelApiInterface<ContentModel, ContentModelXML>;
    public formWidget: ModelApiInterface<Widget, WidgetContent>;
    public authentication: ModelApiInterface<Authentication, AuthenticationContent>;
    public hxpDocumentType: ModelApiInterface<HxPDocumentType, JSONSchemaInfoBasics>;
    public hxpMixin: ModelApiInterface<HxPMixin, JSONSchemaInfoBasics>;
    public hxpSchema: ModelApiInterface<HxPSchema, JSONSchemaInfoBasics>;
}
