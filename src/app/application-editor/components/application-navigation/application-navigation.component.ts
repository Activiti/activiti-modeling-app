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

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectMenuOpened, selectSelectedAppId } from '../../../store/selectors/app.selectors';
import { CreateProcessAttemptAction } from '../../store/actions/processes';
import { OpenEntityDialogAction } from '../../../store/actions/dialog';
import { AmaState } from 'ama-sdk';

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
