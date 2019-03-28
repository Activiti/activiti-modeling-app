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

import { testConfig } from '../../test.config';
import { LoginPage, LoginPageImplementation } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';

describe('User Authorization', () => {

    const authenticatedPage = new AuthenticatedPage(testConfig);

    let loginPage: LoginPageImplementation;

    beforeEach(async () => {
        loginPage = LoginPage.get(testConfig);
        await loginPage.navigateTo();
    });

    it('1. [C289335] Login with user with "ACTIVITI_MODELER" role', async () => {
        await loginPage.login(testConfig.ama.user, testConfig.ama.password);
        expect(await authenticatedPage.isLoggedIn()).toBe(true);
        await authenticatedPage.logout();
    });

    it('2. [C289854] Login with user without "ACTIVITI_MODELER" role ', async () => {
        await loginPage.login(testConfig.ama.unauthorized_user, testConfig.ama.unauthorized_user_password);
        expect(await loginPage.isLoginPageDisplayed()).toBe(true);
    });

});
