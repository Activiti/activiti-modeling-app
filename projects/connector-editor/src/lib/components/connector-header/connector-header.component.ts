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

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import {
    BasicModelCommands,
    BreadcrumbItem,
    BreadCrumbHelperService
} from '@alfresco-dbp/modeling-shared/sdk';
import { selectConnectorCrumb } from '../../store/connector-editor.selectors';
import { ConnectorCommandsService } from '../../services/commands/connector-commands.service';

@Component({
    selector: 'ama-connector-header',
    templateUrl: './connector-header.component.html'
})
export class ConnectorHeaderComponent {

    @Input()
    disableSave = false;

    @Input()
    modelId: string;

    @Input()
    content: string;

    @Output()
    download = new EventEmitter<void>();
    breadcrumbs$: Observable<BreadcrumbItem[]>;

    constructor(
        private modelCommands: ConnectorCommandsService,
        breadCrumbHelperService: BreadCrumbHelperService
        ) {
        this.breadcrumbs$ = breadCrumbHelperService.getModelCrumbs(selectConnectorCrumb);
    }

    onDelete() {
        this.modelCommands.dispatchEvent(BasicModelCommands.delete);
    }

    onDownload() {
        this.modelCommands.dispatchEvent(BasicModelCommands.download);
    }

    onValidate() {
        this.modelCommands.dispatchEvent(BasicModelCommands.validate);
    }

    onSave(): void {
        this.modelCommands.dispatchEvent(BasicModelCommands.save);
    }

    onSaveAs() {
        this.modelCommands.dispatchEvent(BasicModelCommands.saveAs);
    }

}
