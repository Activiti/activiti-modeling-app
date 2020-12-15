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

import { Injectable, Injector, Inject } from '@angular/core';
import { BpmnTrigger, PaletteElementHandler, PaletteElementsHandlersToken } from '@alfresco-dbp/modeling-shared/sdk';
import { LogService } from '@alfresco/adf-core';

@Injectable()
export class ProcessModelerPaletteService {

    constructor(
        @Inject(PaletteElementsHandlersToken) private paletteHandlers: PaletteElementHandler[],
        private logger: LogService,
        private injector: Injector
    ) {}

    delegateEvent(element: BpmnTrigger, event) {
        try {
            const chosenHandler = this.paletteHandlers.find(paletteHandler => paletteHandler.key === element.group);
            const handler = this.injector.get(chosenHandler.handler);
            handler.processEvent(event.originalEvent || event, element);
        } catch (error) {
            this.logger.error(error);
        }

        event.preventDefault();
    }
}
