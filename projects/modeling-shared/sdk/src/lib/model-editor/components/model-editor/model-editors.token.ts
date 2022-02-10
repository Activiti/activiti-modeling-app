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

import { InjectionToken, Type } from '@angular/core';
import { MODEL_TYPE } from '../../../api/types';
import { ModelCommandsService } from '../../services/model-commands.service';

export interface ModelEditorType {
    type: MODEL_TYPE;
    componentClass: Type<any>;
}

export const MODEL_EDITORS_TOKEN = new InjectionToken<ModelEditorType[]>('model-editor-components');

export const MODEL_COMMAND_SERVICE_TOKEN = new InjectionToken<ModelCommandsService>('modelCommands');
