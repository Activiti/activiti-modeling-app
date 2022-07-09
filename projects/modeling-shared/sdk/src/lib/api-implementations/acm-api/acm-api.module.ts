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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ACMApi } from './acm-api';
import { ACMProjectApi } from './project-api';
import {
    AmaApi,
    CONNECTOR_API_TOKEN,
    UI_API_TOKEN,
    PROCESS_API_TOKEN,
    FORM_API_TOKEN,
    DECISION_TABLE_API_TOKEN,
    FILE_API_TOKEN,
    SCHEMA_API_TOKEN,
    SCRIPT_API_TOKEN,
    TRIGGER_API_TOKEN,
    CONTENT_MODEL_API_TOKEN,
    FORM_WIDGET_API_TOKEN,
    DATA_API_TOKEN,
    AUTHENTICATION_API_TOKEN,
    HXP_DOC_TYPE_API_TOKEN,
    HXP_MIXIN_API_TOKEN,
    HXP_SCHEMA_API_TOKEN
} from '../../api/api.interface';
import { UiApiVariation } from './model-variations/ui-api-variation';
import { DecisionTableApiVariation } from './model-variations/decision-table-api-variations';
import { RequestApiHelper } from './request-api.helper';
import { ConnectorApiVariation } from './model-variations/connector-api-variation';
import { ModelApi, ModelApiVariation } from './model-api';
import { FormApiVariation } from './model-variations/form-api-variation';
import { ProcessApiVariation } from './model-variations/process-api-variation';
import { ProcessAcmApi } from './process-api';
import { FileApiVariation } from './model-variations/file-api-variation';
import { ModelSchemaAcmApi } from './model-schema-api';
import { ScriptApiVariation } from './model-variations/script-api-variation';
import { TriggerApiVariation } from './model-variations/trigger-api-variation';
import { ModelContentApiVariation } from './model-variations/content-api-variation';
import { FormWidgetApiVariation } from './model-variations/form-widget-api-variation';
import { DataApiVariation } from './model-variations/data-api-variation';
import { AuthenticationApiVariation } from './model-variations/authentication-api-variation';
import { HxPDocumentTypeApiVariation } from './model-variations/hxp-document-type-api-variation';
import { HxPMixinApiVariation } from './model-variations/hxp-mixin-api-variation';
import { HxPSchemaApiVariation } from './model-variations/hxp-schema-api-variation';

export function modelApiFactory (modelVariation: ModelApiVariation<any, any>, requestApiHelper: RequestApiHelper) {
    return new ModelApi(modelVariation, requestApiHelper);
}

export function processApiFactory (modelVariation: ModelApiVariation<any, any>, requestApiHelper: RequestApiHelper) {
    return new ProcessAcmApi(modelVariation, requestApiHelper);
}

@NgModule({
    imports: [CommonModule]
})
export class ACMApiModule {
    static forRoot(): ModuleWithProviders<ACMApiModule> {
        return {
            ngModule: ACMApiModule,
            providers: [
                { provide: AmaApi, useClass: ACMApi },
                RequestApiHelper,
                ACMProjectApi,

                ProcessApiVariation,
                { provide: PROCESS_API_TOKEN, useFactory: processApiFactory, deps: [ProcessApiVariation, RequestApiHelper] },

                ConnectorApiVariation,
                { provide: CONNECTOR_API_TOKEN, useFactory: modelApiFactory, deps: [ConnectorApiVariation, RequestApiHelper] },

                FormApiVariation,
                { provide: FORM_API_TOKEN, useFactory: modelApiFactory, deps: [FormApiVariation, RequestApiHelper] },

                UiApiVariation,
                { provide: UI_API_TOKEN, useFactory: modelApiFactory, deps: [UiApiVariation, RequestApiHelper] },

                DecisionTableApiVariation,
                { provide: DECISION_TABLE_API_TOKEN, useFactory: modelApiFactory, deps: [DecisionTableApiVariation, RequestApiHelper]},

                FileApiVariation,
                { provide: FILE_API_TOKEN, useFactory: modelApiFactory, deps: [FileApiVariation, RequestApiHelper] },

                { provide: SCHEMA_API_TOKEN, useClass: ModelSchemaAcmApi },

                ScriptApiVariation,
                { provide: SCRIPT_API_TOKEN, useFactory: modelApiFactory, deps: [ScriptApiVariation, RequestApiHelper] },

                TriggerApiVariation,
                { provide: TRIGGER_API_TOKEN, useFactory: modelApiFactory, deps: [TriggerApiVariation, RequestApiHelper] },

                ModelContentApiVariation,
                { provide: CONTENT_MODEL_API_TOKEN, useFactory: modelApiFactory, deps: [ModelContentApiVariation, RequestApiHelper] },

                FormWidgetApiVariation,
                { provide: FORM_WIDGET_API_TOKEN, useFactory: modelApiFactory, deps: [FormWidgetApiVariation, RequestApiHelper] },

                DataApiVariation,
                { provide: DATA_API_TOKEN, useFactory: modelApiFactory, deps: [DataApiVariation, RequestApiHelper] },

                AuthenticationApiVariation,
                { provide: AUTHENTICATION_API_TOKEN, useFactory: modelApiFactory, deps: [AuthenticationApiVariation, RequestApiHelper] },

                HxPDocumentTypeApiVariation,
                { provide: HXP_DOC_TYPE_API_TOKEN, useFactory: modelApiFactory, deps: [HxPDocumentTypeApiVariation, RequestApiHelper] },

                HxPMixinApiVariation,
                { provide: HXP_MIXIN_API_TOKEN, useFactory: modelApiFactory, deps: [HxPMixinApiVariation, RequestApiHelper] },

                HxPSchemaApiVariation,
                { provide: HXP_SCHEMA_API_TOKEN, useFactory: modelApiFactory, deps: [HxPSchemaApiVariation, RequestApiHelper] },
            ]
        };
    }
}
