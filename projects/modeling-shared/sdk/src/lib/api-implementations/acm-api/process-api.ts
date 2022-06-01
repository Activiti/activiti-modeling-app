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

import { Observable, from } from 'rxjs';
import { Process, ProcessContent } from '../../api/types';
import { ModelApi } from './model-api';
import { ModelApiInterface } from '../../api/generalmodel-api.interface';
import { RequestApiHelperOptions } from './request-api.helper';
import { concatMap } from 'rxjs/operators';
import { createBlobFormDataFromStringContent } from '../../helpers/utils/create-json-blob';

export class ProcessAcmApi<T extends Process, S extends ProcessContent> extends ModelApi<T, S> implements ModelApiInterface<T, S> {
    public validate(modelId: string, content: S, containerId: string, modelExtensions: any): Observable<any> {
        return super.validate(modelId, content, containerId).pipe(
            concatMap(() => this.validateExtensions(modelId, JSON.stringify(modelExtensions)))
        );
    }

    private validateExtensions(modelId: string, modelExtensions: string) {
        const requestOptions: RequestApiHelperOptions = {
            formParams: {
                file: createBlobFormDataFromStringContent(modelExtensions, `process-${modelId}.extensions.json`)
            },
            contentTypes: [ 'multipart/form-data' ]
        };

        return from(this.requestApiHelper
            .post(`/modeling-service/v1/models/${modelId}/validate/extensions`, requestOptions));
    }
}
