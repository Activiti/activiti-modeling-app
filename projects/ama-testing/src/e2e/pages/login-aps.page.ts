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
import { GenericPage } from './common/generic.page';
import { TestConfig } from '../config';
import { Logger } from '../util';


export class LoginAPSPage extends GenericPage implements LoginPageImplementation {

    static LOGIN_ATTEMPT_COUNTER = 3;

    private readonly ssoButton = element(by.css(`[data-automation-id="login-button-sso"]`));
    private readonly loginForm = element(by.id('adf-login-form'));
    private readonly usernameField = element(by.id('username'));
    private readonly passwordField = element(by.id('password'));
    private readonly loginButton = element(by.id('login-button'));

    constructor(testConfig: TestConfig) {
        super(testConfig);
    }

    async login(username: string, password: string) {
        await this.signIn(username, password);
    }

    async loginWithRetry(username: string, password: string) {
        for (let i = 0; i < LoginAPSPage.LOGIN_ATTEMPT_COUNTER; i++) {
            try {
                await this.attemptToLogin(username, password);
                return;
            } catch (error) {
                await this.navigateTo();
                Logger.error(`Logging in was not successful for attempt: #${i + 1}`);
            }
        }

        throw(new Error('Logging in was not possible'));
    }

    // Temporary fix for BE login form's issue
    private async attemptToLogin(username: string, password: string) {
        await this.clickOnSSOButton();
        await this.signIn(username, password);
    }

    // Temporary fix for BE login form's issue - redirect the user to login form
    private async signIn(username: string, password: string) {
        await super.waitForElementToBePresent(this.loginForm);
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickOnLoginButton();
    }

    async navigateTo() {
        const loginURL = `login`;
        await super.navigateTo(loginURL);
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
