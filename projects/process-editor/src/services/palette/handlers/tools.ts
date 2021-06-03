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

import { Injectable, Inject } from '@angular/core';
import { TriggerHandler, ToolTrigger, ProcessModelerServiceToken, ProcessModelerService } from '@alfresco-dbp/modeling-shared/sdk';

@Injectable()
export class ToolsHandler implements TriggerHandler {

    constructor(@Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService) {}

    private get handTool() {
        return this.processModelerService.getFromModeler('handTool');
    }

    private get globalConnect() {
        return this.processModelerService.getFromModeler('globalConnect');
    }

    private get lassoTool() {
        return this.processModelerService.getFromModeler('lassoTool');
    }

    private get spaceTool() {
        return this.processModelerService.getFromModeler('spaceTool');
    }

    processEvent(event: any, tool: ToolTrigger) {
        switch (tool.type) {
            case 'hand-tool':
                this.handTool.activateHand(event);
            break;

            case 'connect-tool':
                this.globalConnect.toggle(event);
            break;

            case 'space-tool':
                this.spaceTool.activateSelection(event);
            break;

            case 'lasso-tool':
                this.lassoTool.activateSelection(event);
            break;
        }
    }
}
