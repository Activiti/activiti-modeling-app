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
    AmaState,
    OpenConfirmDialogAction,
    SnackbarInfoAction,
    SnackbarErrorAction,
    BreadCrumbHelperService
} from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { selectConnectorCrumb } from '../../store/connector-editor.selectors';
import {
    DeleteConnectorAttemptAction,
    ValidateConnectorAttemptAction,
    DownloadConnectorAction,
    OpenSaveAsConnectorAction,
    SaveAsConnectorAttemptAction
} from '../../store/connector-editor.actions';
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
        private store: Store<AmaState>,
        private modelCommands: ConnectorCommandsService,
        breadCrumbHelperService: BreadCrumbHelperService
        ) {
        this.breadcrumbs$ = breadCrumbHelperService.getModelCrumbs(selectConnectorCrumb);
    }

    onDelete() {
        this.store.dispatch(
            new OpenConfirmDialogAction({
                dialogData: { title: 'APP.DIALOGS.CONFIRM.DELETE.CONNECTOR' },
                action: new DeleteConnectorAttemptAction(this.modelId)
            })
        );
    }

    onDownload() {
        this.store.dispatch(new ValidateConnectorAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.CONNECTOR',
            modelId: this.modelId,
            modelContent: JSON.parse(this.content),
            action: new DownloadConnectorAction()
        }));
    }

    onValidate() {
        this.store.dispatch(new ValidateConnectorAttemptAction({
            title: null,
            modelId: this.modelId,
            modelContent: JSON.parse(this.content),
            action: new SnackbarInfoAction('CONNECTOR_EDITOR.CONNECTOR_VALID'),
            errorAction: new SnackbarErrorAction('CONNECTOR_EDITOR.CONNECTOR_INVALID')
        }));
    }

    onSave(): void {
        this.modelCommands.dispatchEvent(BasicModelCommands.save);
    }

    onSaveAs() {
        const contentObj = JSON.parse(this.content);
        this.store.dispatch(new ValidateConnectorAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.SAVE_AS.CONNECTOR',
            modelId: this.modelId,
            modelContent: contentObj,
            action: new OpenSaveAsConnectorAction({
                id: contentObj.id,
                name: contentObj.name,
                description: contentObj.description,
                sourceContent: contentObj,
                action: SaveAsConnectorAttemptAction
            })
        }));
    }

}
