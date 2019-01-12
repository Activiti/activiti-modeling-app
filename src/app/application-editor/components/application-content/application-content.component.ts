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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationEditorState, Application, selectApplication } from 'ama-sdk';
import { Observable, Subscription } from 'rxjs';
import { ExportApplicationAction } from '../../store/actions/application';
import { LeaveApplicationAction } from 'ama-sdk';

@Component({
    templateUrl: './application-content.component.html'
})
export class ApplicationContentComponent implements OnInit, OnDestroy {
    application$: Observable<Partial<Application>>;
    openedFilters$: Subscription;

    constructor(private store: Store<ApplicationEditorState>) {}

    ngOnInit() {
        this.application$ = this.store.select(selectApplication);
    }

    ngOnDestroy() {
        this.store.dispatch(new LeaveApplicationAction());
    }

    downloadApp(application) {
        const payload = {
            applicationId: application.id,
            applicationName: application.name
        };

        this.store.dispatch(new ExportApplicationAction(payload));
    }
}
