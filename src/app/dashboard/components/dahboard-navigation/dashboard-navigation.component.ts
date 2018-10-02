/*!
 * @license
 * Alfresco Example Modeling Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Modeling Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Modeling Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Modeling Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppConfigService } from '@alfresco/adf-core';
import { UploadApplicationAttemptAction, CreateApplicationAttemptAction } from '../../store/actions/applications';
import { AmaState } from 'ama-sdk';
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
        event.stopPropagation();
        this.fileInput.nativeElement.click();
    }

    onUpload(files: File[]): void {
        this.store.dispatch(new UploadApplicationAttemptAction(files[0]));
    }

    private buildMenu() {
        const schema = this.appConfig.get('navigation');
        const data = Array.isArray(schema) ? { main: schema } : schema;

        return Object.keys(data).map(key => data[key]);
    }

    public openApplicationDialog() {
        this.store.dispatch(new OpenEntityDialogAction({
            title: 'APP.HOME.NEW_MENU.CREATE_APP_TITLE',
            nameField: 'APP.HOME.DIALOGS.APP_NAME',
            descriptionField: 'APP.HOME.DIALOGS.APP_DESC',
            action: CreateApplicationAttemptAction
        }));
    }
}
