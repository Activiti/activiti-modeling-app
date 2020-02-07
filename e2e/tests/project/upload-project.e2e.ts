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
import { Resources } from '../../resources/resources';
import {
    LoginPage,
    SidebarActionMenu,
    DashboardPage,
    SnackBar,
    Backend,
    AuthenticatedPage,
    Logger,
    getBackend } from 'ama-testing/e2e';
import { testConfig } from '../../test.config';
import { browser } from 'protractor';

const path = require('path');

describe('Upload project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const sidebarActionMenu = new SidebarActionMenu();
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const dashboardPage = new DashboardPage();
    const snackBar = new SnackBar();

    let backend: Backend;

    const projectDetails = {
        path: Resources.SIMPLE_PROJECT.file_location,
        name: Resources.SIMPLE_PROJECT.project_name
    };

    const resourcesDir = browser.params.resourcesDir;
    const absoluteFilePath = path.join(resourcesDir, projectDetails.path);

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
        await cleanupProject(projectDetails.name);
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    it('[C286559] should upload project', async () => {
        await sidebarActionMenu.clickOnCreateButton();
        await sidebarActionMenu.uploadProject(absoluteFilePath);

        await expect(await snackBar.isUploadedSuccessfully('project')).toBe(true);
        await expect(await dashboardPage.isProjectNameInList(projectDetails.name)).toBe(true, `Item '${projectDetails.name}' was not found in the list.`);
    });
});
