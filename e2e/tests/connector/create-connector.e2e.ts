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
import { LoginPage, LoginPageImplementation, AuthenticatedPage, SidebarActionMenu, UtilRandom } from 'ama-testing/e2e';
import { CreateEntityDialog } from 'ama-testing/e2e';
import { ProjectContentPage } from 'ama-testing/e2e';
import { SnackBar } from 'ama-testing/e2e';
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { Toolbar } from 'ama-testing/e2e';

describe('Create connector', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const sidebarActionMenu = new SidebarActionMenu();
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const createEntityDialog = new CreateEntityDialog();
    const snackBar = new SnackBar();
    const toolbar = new Toolbar();

    let backend: Backend;
    let loginPage: LoginPageImplementation;
    let project: NodeEntry;
    let projectContentPage: ProjectContentPage;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        loginPage = LoginPage.get(testConfig);
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    beforeAll(async () => {
        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        await projectContentPage.navigateTo();
    });

    it('1. [C280408] Create connector using New dropdown', async () => {
        await sidebarActionMenu.createConnector();
        const connector = await createEntityDialog.setEntityDetails('amaqa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        expect(await snackBar.isCreatedSuccessfully('connector')).toBe(true, 'Connector creation snackbar should be displayed');
        expect(await projectContentPage.isModelInList('connector', connector.name)).toBe(true, 'Connector should be in the left sidebar');
        expect(await toolbar.isItemDisplayed(connector.name)).toBe(true, 'Connector name should be displayed in the breadcrumb');
    });

    it('2. [C291964] Create connector using + button', async () => {
        await projectContentPage.createConnector();
        const connector = await createEntityDialog.setEntityDetails('amaqa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        expect(await snackBar.isCreatedSuccessfully('connector')).toBe(true, 'Connector creation snackbar should be displayed');
        expect(await projectContentPage.isModelInList('connector', connector.name)).toBe(true, 'Connector should be in the left sidebar');
        expect(await toolbar.isItemDisplayed(connector.name)).toBe(true, 'Connector name should be displayed in the breadcrumb');
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
