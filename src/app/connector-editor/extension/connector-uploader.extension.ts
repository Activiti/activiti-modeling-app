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

import { ModelUploader, MODEL_UPLOADERS, CONNECTOR, CONNECTOR_FILE_FORMAT } from '@alfresco-dbp/modeling-shared/sdk';
import { UploadConnectorAttemptAction } from '../store/connector-editor.actions';

export function createConnectorUploader(): ModelUploader {
    return {
        type: CONNECTOR,
        acceptedFileType: CONNECTOR_FILE_FORMAT,
        action: UploadConnectorAttemptAction
    };
}

export function getConnectorUploaderProvider() {
    return [
        {
            provide: MODEL_UPLOADERS,
            useFactory: createConnectorUploader,
            multi: true
        }
    ];
}
