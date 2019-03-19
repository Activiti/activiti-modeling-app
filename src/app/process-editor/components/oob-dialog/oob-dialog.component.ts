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

import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { OobConnectorsService, Connector, AmaState, selectProjectConnectorsArray } from 'ama-sdk';
import { CreateConnectorAttemptAction } from './../../../connector-editor/store/connector-editor.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './oob-dialog.component.html'
})
export class OobDialogComponent implements OnInit {

    submitButton: string;
    connectors: Observable<Connector[]>;
    form: Partial<any>;
    ENTER_KEY = 13;

    constructor(
        private store: Store<AmaState>,
        public dialog: MatDialogRef<OobDialogComponent>,
        public oobService: OobConnectorsService,
    ) {}

    ngOnInit() {
        this.form = {
            connectorName: '',
            connectorInstance: ''
        };

        this.connectors = this.store.select(selectProjectConnectorsArray).pipe(
            map(connectors => [...this.oobService.getMetadata(), ...connectors.filter((connector) => !!connector.template)])
        );
    }

    submit(): void {
       this.store.dispatch(new CreateConnectorAttemptAction({name: this.form.connectorName, description: '', template: this.form.connectorInstance}));
       this.dialog.close();
    }

    @HostListener('document:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        const currentlySelectedElementIsDescription  = event.srcElement.classList.contains('mat-input-element');
        if (event.keyCode === this.ENTER_KEY && !currentlySelectedElementIsDescription) {
            this.submit();
        }
    }
}
