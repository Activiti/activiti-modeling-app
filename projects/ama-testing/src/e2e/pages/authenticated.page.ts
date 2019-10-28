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

import { element, by } from 'protractor';
import { GenericPage } from './common/generic.page';
import { TestConfig } from '../config';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class AuthenticatedPage extends GenericPage {

    private readonly userLoggedIn = element(by.css(`[data-automation-id="user-logged-in"]`));
    private readonly userMenu = element(by.css(`[data-automation-id="user-menu"]`));
    private readonly userLogout = element(by.css(`[data-automation-id="user-logout"]`));

    constructor(testConfig: TestConfig) {
        super(testConfig);
    }

    async isLoggedIn(): Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.userLoggedIn);
    }

    async logout(): Promise<void> {
        await BrowserActions.click(this.userMenu);
        await BrowserActions.click(this.userLogout);
    }

    async navigateTo(): Promise<void> {
        const loginURL = `dashboard/projects`;
        super.navigateTo(loginURL);
    }
}
