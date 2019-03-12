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

import { LoginPageImplementation } from './login.page';
import { element, by } from 'protractor';
import { testConfig } from '../test.config';
import { GenericPage } from './common/generic.page';
import { AuthenticatedPage } from './authenticated.page';

export class LoginAPSPage extends GenericPage implements LoginPageImplementation {

    private readonly loginURL = `${testConfig.ama.url}${testConfig.ama.port !== '' ? `:${testConfig.ama.port}` : ''}/login`;

    private readonly ssoButton = element(by.css(`[data-automation-id="login-button-sso"]`));
    private readonly usernameField = element(by.id('username'));
    private readonly passwordField = element(by.id('password'));
    private readonly loginButton = element(by.className('submit'));

    private authenticatedPage = new AuthenticatedPage();

    async login(username: string, password: string) {
        await this.clickOnSSOButton();

        await super.waitForElementToBePresent(element(by.id('kc-form-login')));
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickOnLoginButton();
        await this.authenticatedPage.isLoggedIn();
    }

    async navigateTo() {
        return await super.navigateTo(this.loginURL);
    }

    async isLoginPageDisplayed() {
        return await super.waitForElementToBeVisible(this.ssoButton);
    }

    private async clickOnSSOButton() {
        await super.waitForElementToBeClickable(this.ssoButton);
        await super.click(this.ssoButton);
    }

    private async clickOnLoginButton() {
        await super.waitForElementToBeClickable(this.loginButton);
        await super.click(this.loginButton);
    }

    private async enterUsername(username) {
        await this.clearUsername();
        await super.sendKeysIfVisible(this.usernameField, username);
    }

    private async enterPassword(password) {
        await this.clearPassword();
        await super.sendKeysIfVisible(this.passwordField, password);
    }

    private async clearUsername() {
        await super.clear(this.usernameField);
    }

    private async clearPassword() {
        await super.clear(this.passwordField);
    }
}
