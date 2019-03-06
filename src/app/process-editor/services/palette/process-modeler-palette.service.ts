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

import { Injectable } from '@angular/core';
import { BpmnTrigger } from 'ama-sdk';
import { ElementCreationHandler } from './handlers/element-creation';
import { LogService } from '@alfresco/adf-core';
import { ToolsHandler } from './handlers/tools';

@Injectable()
export class ProcessModelerPaletteService {

    triggers: { [ key: string ]: any };

    constructor(elementCreationHandler: ElementCreationHandler, toolsHandler: ToolsHandler, private logger: LogService) {
        this.triggers = {
            'tool': toolsHandler,
            'element': elementCreationHandler
        };
    }

    delegateEvent(element: BpmnTrigger, event) {
        try {
            const trigger = this.triggers[element.group];
            trigger.processEvent(event.originalEvent || event, element);
        } catch (error) {
            this.logger.error(error);
        }

        event.preventDefault();
    }
}
