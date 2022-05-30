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

import { ProcessModelerService, ProcessModelerServiceToken } from '@alfresco-dbp/modeling-shared/sdk';
import { Component, Inject, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ama-process-modeler-actions',
    templateUrl: './process-modeler-actions.component.html',
    styleUrls: ['./process-modeler-actions.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProcessModelerActionsComponent {
    constructor(@Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService) {}

    fitViewPort() {
        this.processModelerService.fitViewPort();
    }

    zoomIn() {
        this.processModelerService.zoomIn();
    }

    zoomOut() {
        this.processModelerService.zoomOut();
    }

    undo() {
        this.processModelerService.undo();
    }

    redo() {
        this.processModelerService.redo();
    }
}
