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

import { Observable } from 'rxjs';
import { ContentType } from '../../api-implementations/acm-api/content-types';
import { MODEL_TYPE } from '../../api/types';

export class ModelCommandCallbackEvent extends Event {
    constructor(
        type: string,
        public modelType: MODEL_TYPE,
        public modelContentType: ContentType,
        public modelId$: Observable<string>,
        public modelContent$: Observable<string>,
        public modelMetadata$: Observable<Record<string, any>>) {
        super(type, {});
    }
}

export type ModelCommandCallback = (e: ModelCommandCallbackEvent) => void;
