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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ACMApi } from './acm-api';
import { ACMApplicationApi } from './application-api';
import { AmaApi } from '../../api/api.interface';
import { UiApiVariation, UI_API } from './model-variations/ui-api-variation';
import { DecisionTableApiVariation, DECISION_TABLE_API } from './model-variations/decision-table-api-variations';
import { RequestApiHelper } from './request-api.helper';
import { ConnectorApiVariation, CONNECTOR_API } from './model-variations/connector-api-variation';
import { ModelApi, ModelApiVariation } from './model-api';
import { FormApiVariation, FORM_API } from './model-variations/form-api-variation';
import { ProcessApiVariation, PROCESS_API } from './model-variations/process-api-variation';
import { DataApiVariation, DATA_API } from './model-variations/data-api-variation';

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
                ACMApplicationApi,

                UiApiVariation,
                { provide: UI_API, useFactory: modelApiFactory, deps: [UiApiVariation, RequestApiHelper] },

                DataApiVariation,
                { provide: DATA_API, useFactory: modelApiFactory, deps: [DataApiVariation, RequestApiHelper] },

                DecisionTableApiVariation,
                {provide: DECISION_TABLE_API, useFactory: modelApiFactory, deps: [DecisionTableApiVariation, RequestApiHelper]},

                ConnectorApiVariation,
                { provide: CONNECTOR_API, useFactory: modelApiFactory, deps: [ConnectorApiVariation, RequestApiHelper] },

                FormApiVariation,
                { provide: FORM_API, useFactory: modelApiFactory, deps: [FormApiVariation, RequestApiHelper] },

                ProcessApiVariation,
                { provide: PROCESS_API, useFactory: modelApiFactory, deps: [ProcessApiVariation, RequestApiHelper] },
            ]
        };
    }
}
