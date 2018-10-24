 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectMenuOpened } from '../../../store/selectors/app.selectors';
import { CreateProcessAttemptAction } from '../../store/actions/processes';
import { OpenEntityDialogAction } from '../../../store/actions/dialog';
import { AmaState, selectSelectedAppId } from 'ama-sdk';

@Component({
    templateUrl: './application-navigation.component.html'
})
export class ApplicationNavigationComponent {
    expanded$: Observable<boolean>;
    selectedAppId$: Observable<string>;

    constructor(private store: Store<AmaState>) {
        this.expanded$ = this.store.select(selectMenuOpened);
        this.selectedAppId$ = this.store.select(selectSelectedAppId);
    }

    openProcessDialog(): void {
        this.store.dispatch(new OpenEntityDialogAction({
            title: 'APP.APPLICATION.PROCESS_DIALOG.TITLE_CREATE',
            nameField: 'APP.APPLICATION.PROCESS_DIALOG.PROCESS_NAME',
            descriptionField: 'APP.APPLICATION.PROCESS_DIALOG.PROCESS_DESC',
            action: CreateProcessAttemptAction
        }));
    }
}
