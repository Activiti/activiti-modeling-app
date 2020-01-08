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
import {
    LoginPage,
    UtilRandom,
    CreatedEntity,
    SidebarActionMenu,
    CreateEntityDialog,
    DashboardPage,
    SnackBar,
    Backend,
    getBackend,
    AuthenticatedPage,
    Logger } from 'ama-testing/e2e';
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
    let project: CreatedEntity;

    async function cleanupProject(projectName: string) {
        try {
            const createdProjectId = await dashboardPage.getIdForProjectByItsName(projectName);
            await backend.project.delete(createdProjectId);
        } catch (e) {
            Logger.warn(`${projectName} is not there, no need to delete (?)...\nError: ${e}`);
        }
    }

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
    });

    afterAll(async () => {
        await cleanupProject(project.name);
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    it('[C284637] Create new project', async () => {
        await sidebarActionMenu.createProject();

        /* cspell: disable-next-line */
        project = await createEntityDialog.setEntityDetails('amaqa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        await expect(await snackBar.isCreatedSuccessfully('project')).toBe(true);
        await browser.navigate().back();
        await expect(await dashboardPage.isProjectNameInList(project.name)).toBe(true);
    });
});
