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

import { AppConfigService, JwtHelperService, UserAccessService } from '@alfresco/adf-core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { OpenAboutDialogAction } from '../../../store/app.actions';
import { AmaState } from '../../../store/app.state';

const ROLE_ADMIN = 'ACTIVITI_ADMIN';
interface UserDetails {
    firstName: string;
    lastName: string;
}

@Component({
    selector: 'modelingsdk-user-info-menu',
    styleUrls: ['./user-info-menu.component.scss'],
    templateUrl: './user-info-menu.component.html',
    encapsulation: ViewEncapsulation.None
})
export class UserInfoMenuComponent implements OnInit {

    userDetails: UserDetails;
    userName = '';
    userMail = '';

    constructor(
        private jwtHelperService: JwtHelperService,
        private userAccessService: UserAccessService,
        private config: AppConfigService,
        private store: Store<AmaState>
    ) {}

    ngOnInit() {
        this.userDetails = {
            firstName: this.jwtHelperService.getValueFromLocalIdToken('given_name') ?? '',
            lastName: this.jwtHelperService.getValueFromLocalIdToken('family_name') ?? ''
        };
        this.userName = this.getUserName();
        this.userMail = this.jwtHelperService.getValueFromLocalIdToken('email');
    }

    getUserName(): string {
        return this.jwtHelperService.getValueFromLocalIdToken('name');
    }

    isUserAdmin(): boolean {
        return this.userAccessService.hasGlobalAccess([ROLE_ADMIN]);
    }

    openAdminApp(): void {
        const hostValue = this.config.get('bpmHost');
        window.open( `${hostValue}/admin`);
    }

    navigateToDocs() {
        window.open('https://docs.alfresco.com/process-automation/latest/');
    }

    navigateToAbout() {
        this.store.dispatch(new OpenAboutDialogAction());
    }

}
