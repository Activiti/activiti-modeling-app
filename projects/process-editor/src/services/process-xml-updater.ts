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

import { Store } from '@ngrx/store';
import { ProcessModelerService, BpmnProperty, SnackbarInfoAction } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessEntitiesState } from '../store/process-entities.state';
import { modelNameHandler } from './bpmn-js/property-handlers/model-name.handler';
import { processNameHandler } from './bpmn-js/property-handlers/process-name.handler';

const updateProcessXML = (store: Store<ProcessEntitiesState>, processModelerService: ProcessModelerService) => {
    const element = processModelerService.getRootProcessElement();
    let name = modelNameHandler.get(element);

    if (!name) {
        name = processNameHandler.get(element);
        processModelerService.updateElementProperty(element.id, BpmnProperty.modelName, name);
        store.dispatch(new SnackbarInfoAction('PROCESS_EDITOR.PROCESS_UPDATED'));
    }
};

export const processXmlUpdater = { updateProcessXML };
