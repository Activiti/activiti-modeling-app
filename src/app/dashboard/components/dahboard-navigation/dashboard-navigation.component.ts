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

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppConfigService } from '@alfresco/adf-core';
import { UploadProjectAttemptAction } from '../../store/actions/projects';
import { AmaState, CreateProjectAttemptAction } from 'ama-sdk';
import { selectMenuOpened } from '../../../store/selectors/app.selectors';
import { OpenEntityDialogAction } from '../../../store/actions/dialog';

@Component({
    templateUrl: './dashboard-navigation.component.html'
})
export class DashboardNavigationComponent implements OnInit {
    expanded$: Observable<boolean>;
    navigation: any[];
    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(private store: Store<AmaState>, private appConfig: AppConfigService) {
        this.expanded$ = this.store.select(selectMenuOpened);
    }

    ngOnInit() {
        this.navigation = this.buildMenu();
    }

    onClick(event): void {
        this.fileInput.nativeElement.click();
    }

    onUpload(files: File[]): void {
        this.store.dispatch(new UploadProjectAttemptAction(files[0]));
        this.fileInput.nativeElement.value = null;
    }

    private buildMenu() {
        const schema = this.appConfig.get('navigation');
        const data = Array.isArray(schema) ? { main: schema } : schema;

        return Object.keys(data).map(key => data[key]);
    }

    public openProjectDialog() {
        this.store.dispatch(new OpenEntityDialogAction({
            title: 'APP.HOME.NEW_MENU.CREATE_APP_TITLE',
            nameField: 'APP.HOME.DIALOGS.APP_NAME',
            descriptionField: 'APP.HOME.DIALOGS.APP_DESC',
            action: CreateProjectAttemptAction
        }));
    }
}
