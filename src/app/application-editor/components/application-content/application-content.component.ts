/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationEditorState } from '../../store/state/application-editor.state';
import { selectApplication } from '../../store/selectors/application-editor.selectors';
import { Observable } from 'rxjs';
import { Application } from 'ama-sdk';
import { ExportApplicationAction } from '../../store/actions/application';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './application-content.component.html'
})
export class ApplicationContentComponent implements OnInit {
    application$: Observable<Partial<Application>>;
    subscribe: Subscription;

    constructor(private store: Store<ApplicationEditorState>) {}

    ngOnInit() {
        this.application$ = this.store.select(selectApplication);
    }

    downloadApp(application) {
        const payload = {
            applicationId: application.id,
            applicationName: application.name
        };

        this.store.dispatch(new ExportApplicationAction(payload));
    }
}
