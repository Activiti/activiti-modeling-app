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
import { Observable, combineLatest, of } from 'rxjs';
import { BreadcrumbItem, AmaState, OpenConfirmDialogAction, selectProjectCrumb, SnackbarInfoAction, SnackbarErrorAction } from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { selectConnectorCrumb } from '../../store/connector-editor.selectors';
import {
    DeleteConnectorAttemptAction,
    ValidateConnectorAttemptAction,
    DownloadConnectorAction,
    UpdateConnectorContentAttemptAction
} from '../../store/connector-editor.actions';

@Component({
    selector: 'ama-connector-header',
    templateUrl: './connector-header.component.html'
})
export class ConnectorHeaderComponent {

    @Input()
    disableSave = false;

    @Input()
    connectorId: string;

    @Input()
    content: string;

    @Output()
    download = new EventEmitter<void>();
    breadcrumbs$: Observable<BreadcrumbItem[]>;

    constructor(private store: Store<AmaState>) {
        this.breadcrumbs$ = combineLatest(
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null)),
            this.store.select(selectConnectorCrumb).pipe(filter(value => value !== null))
        );
    }

    onSave() {
        this.store.dispatch(new ValidateConnectorAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.SAVE.CONNECTOR',
            connectorId: this.connectorId,
            connectorContent: JSON.parse(this.content),
            action: new UpdateConnectorContentAttemptAction(JSON.parse(this.content))
        }));
    }

    onDelete() {
        this.store.dispatch(
            new OpenConfirmDialogAction({
                dialogData: { title: 'APP.DIALOGS.CONFIRM.DELETE.CONNECTOR' },
                action: new DeleteConnectorAttemptAction(this.connectorId)
            })
        );
    }

    onDownload() {
        this.store.dispatch(new ValidateConnectorAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.CONNECTOR',
            connectorId: this.connectorId,
            connectorContent: JSON.parse(this.content),
            action: new DownloadConnectorAction()
        }));
    }

    onValidate() {
        this.store.dispatch(new ValidateConnectorAttemptAction({
            title: null,
            connectorId: this.connectorId,
            connectorContent: JSON.parse(this.content),
            action: new SnackbarInfoAction('CONNECTOR_EDITOR.CONNECTOR_VALID'),
            errorAction: new SnackbarErrorAction('CONNECTOR_EDITOR.CONNECTOR_INVALID')
        }));
    }
}
