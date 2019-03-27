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
    DATA_API_TOKEN
} from '../../api/api.interface';
import { UiApiVariation } from './model-variations/ui-api-variation';
import { DecisionTableApiVariation } from './model-variations/decision-table-api-variations';
import { RequestApiHelper } from './request-api.helper';
import { ConnectorApiVariation } from './model-variations/connector-api-variation';
import { ModelApi, ModelApiVariation } from './model-api';
import { FormApiVariation } from './model-variations/form-api-variation';
import { ProcessApiVariation } from './model-variations/process-api-variation';
import { DataApiVariation } from './model-variations/data-api-variation';

export function modelApiFactory (modelVariation: ModelApiVariation<any, any>, requestApiHelper: RequestApiHelper) {
    return new ModelApi(modelVariation, requestApiHelper);
}

@NgModule({
    imports: [CommonModule]
})
export class ACMApiModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ACMApiModule,
            providers: [
                { provide: AmaApi, useClass: ACMApi },
                RequestApiHelper,
                ACMProjectApi,

                ProcessApiVariation,
                { provide: PROCESS_API_TOKEN, useFactory: modelApiFactory, deps: [ProcessApiVariation, RequestApiHelper] },

                ConnectorApiVariation,
                { provide: CONNECTOR_API_TOKEN, useFactory: modelApiFactory, deps: [ConnectorApiVariation, RequestApiHelper] },

                FormApiVariation,
                { provide: FORM_API_TOKEN, useFactory: modelApiFactory, deps: [FormApiVariation, RequestApiHelper] },

                UiApiVariation,
                { provide: UI_API_TOKEN, useFactory: modelApiFactory, deps: [UiApiVariation, RequestApiHelper] },

                DecisionTableApiVariation,
                {provide: DECISION_TABLE_API_TOKEN, useFactory: modelApiFactory, deps: [DecisionTableApiVariation, RequestApiHelper]},

                DataApiVariation,
                { provide: DATA_API_TOKEN, useFactory: modelApiFactory, deps: [DataApiVariation, RequestApiHelper] }
            ]
        };
    }
}
