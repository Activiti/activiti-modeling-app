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
import { LoginPage, LoginPageImplementation, UtilRandom } from 'ama-testing/e2e';
import { SidebarActionMenu } from 'ama-testing/e2e';
import { CreateEntityDialog } from 'ama-testing/e2e';
import { DashboardPage } from 'ama-testing/e2e';
import { SnackBar } from 'ama-testing/e2e';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { Logger } from 'ama-testing/e2e';
 import { browser } from 'protractor';

describe('Create project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const sidebarActionMenu = new SidebarActionMenu();
    const createEntityDialog = new CreateEntityDialog();
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const dashboardPage = new DashboardPage();
    const snackBar = new SnackBar();

    let backend: Backend;
    let loginPage: LoginPageImplementation;
    let project, projectDetails;

    beforeEach(async () => {
        backend = await getBackend(testConfig).setUp();
        loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);

    });

    it('[C284637] Create new project', async () => {
        await sidebarActionMenu.createProject();

        /* cspell: disable-next-line */
        project = await createEntityDialog.setEntityDetails('amaqa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        await expect(await snackBar.isCreatedSuccessfully('project')).toBe(true);
        projectDetails = await backend.project.getProjectByName(project.name);
        await expect(await browser.getCurrentUrl()).toContain(projectDetails.entry.id);
        await browser.navigate().back();
        await expect(await dashboardPage.isProjectNameInList(project.name)).toBe(true);

    });

    afterEach(async () => {
        try {
            const createdAppId = await dashboardPage.getIdForProjectByItsName(project.name);
            await backend.project.delete(createdAppId);
        } catch (e) {
            Logger.error(`Cleaning up created project failed: ${project.name}`);
            throw e;
        }
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
