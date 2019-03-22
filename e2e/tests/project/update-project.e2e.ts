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
import { DashboardPage } from '../../pages/dashboard.page';
import { CreateEntityDialog } from 'ama-testing/e2e';
import { SnackBar } from '../../pages/snackbar';
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';

describe('Update project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const loginPage: LoginPageImplementation = LoginPage.get(testConfig);
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const dashboardPage = new DashboardPage();
    const snackBar = new SnackBar();
    const createEntityDialog = new CreateEntityDialog();

    let backend: Backend;
    let app: NodeEntry;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        app = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    it('1. [C289977] Update project name and description', async () => {
        const appId = app.entry.id;
        const updatedAppName = app.entry.name + '_updated';

        await dashboardPage.editProject(appId);
        await createEntityDialog.setEntityDetails(updatedAppName, app.entry.name + ' description');

        expect(await snackBar.isUpdatedSuccessfully('project')).toBe(true);
        expect(await dashboardPage.isProjectInList(appId)).toBe(true);
        expect(await dashboardPage.isProjectNameInList(updatedAppName)).toBe(true);

        const appResponse = await backend.project.get(appId);
        expect(appResponse[`entry`][`name`]).toEqual(updatedAppName);
    });

    afterAll(async () => {
        await backend.project.delete(app.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
