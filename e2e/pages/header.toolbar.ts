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

import { GenericWebElement } from './common/generic.webelement';
import { browser, element, by } from 'protractor';
import { testConfig } from '../test.config';


export class HeaderToolbar extends GenericWebElement {

    readonly appTitle = element(by.cssContainingText('.adf-app-title', testConfig.ama.appTitle));
    readonly userAvatar = element(by.css('div.current-user__avatar'));
    readonly userMenu = element(by.css(`div.mat-menu-content`));
    readonly settings = element(by.cssContainingText(`button.mat-menu-item>span`, 'Settings'));

    constructor() {
        super();
    }

    async isAppTitleDisplayed() {
        await super.waitForElementToBeVisible(this.appTitle);
        await browser.refresh();
    }

    async clickOnUserAvatar() {
        await this.click(this.userAvatar);
        await this.waitForElementToBeVisible(this.userMenu);
    }

    async goToSettings() {
        await super.click(this.settings);
    }
}
