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

import { LoginPage, LoginPageImplementation } from 'ama-testing/e2e';
import { Resources } from '../../resources/resources';
import { SidebarActionMenu } from 'ama-testing/e2e';
import { DashboardPage } from 'ama-testing/e2e';
import { SnackBar } from 'ama-testing/e2e';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { testConfig } from '../../test.config';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { Logger } from 'ama-testing/e2e';

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
    let loginPage: LoginPageImplementation;

    const projectDetails = {
        path: Resources.SIMPLE_PROJECT.file_location,
        name: Resources.SIMPLE_PROJECT.project_name
    };
    const absoluteFilePath = path.resolve(testConfig.main.rootPath + projectDetails.path);

    async function cleanupProject(projectName: string) {
        try {
            const createdProjectId = await dashboardPage.getIdForProjectByItsName(projectName);
            await backend.project.delete(createdProjectId);
        } catch (e) {
            Logger.warn(`${projectName} is not there, no need to delete (?)...`);
        }
    }

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
    });

    beforeAll(async () => {
        loginPage = LoginPage.get(testConfig);
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    it('1. [C286559] Upload project', async () => {
        await sidebarActionMenu.clickOnCreateButton();
        await sidebarActionMenu.uploadProject(absoluteFilePath);
        await sidebarActionMenu.isOptionsMenuDismissed();

        expect(await snackBar.isUploadedSuccessfully('project')).toBe(true);
        expect(await dashboardPage.isProjectNameInList(projectDetails.name)).toBe(true, `Item '${projectDetails.name}' was not found in the list.`);
    });

    it('2. [C311378] Upload project using the REST API', async () => {
        const project = await backend.project.import(absoluteFilePath);
        await authenticatedPage.refreshPage();
        expect(await dashboardPage.isProjectNameInList(project.entry.name)).toBe(true, `Item '${project.entry.name}' was not found in the list.`);
    });

    afterEach(async () => {
        await cleanupProject(projectDetails.name);
    });

    afterAll(async () => {
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
