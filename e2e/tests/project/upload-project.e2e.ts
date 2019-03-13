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

import { LoginPage, LoginPageImplementation } from '../../pages/login.page';
import { Resources } from '../../util/resources';
import { SidebarActionMenu } from '../../pages/sidebar.menu';
import { DashboardPage } from '../../pages/dashboard.page';
import { SnackBar } from '../../pages/snackbar';
import { Backend } from '../../api/api.interfaces';
import { getBackend } from '../../api/helpers';
import { testConfig } from '../../test.config';
import { AuthenticatedPage } from '../../pages/authenticated.page';
import { Logger } from '../../util/logger';

const path = require('path');

describe('Upload project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const sidebarActionMenu = new SidebarActionMenu();
    const authenticatedPage = new AuthenticatedPage();
    const dashboardPage = new DashboardPage();
    const snackBar = new SnackBar();

    let backend: Backend;
    let loginPage: LoginPageImplementation;

    async function cleanupProject(projectName: string) {
        try {
            const createdProjectId = await dashboardPage.getIdForProjectByItsName(projectName);
            await backend.project.delete(createdProjectId);
        } catch (e) {
            Logger.warn(`${projectName} is not there, no need to delete (?)...`);
        }
    }

    beforeAll(async () => {
        backend = await getBackend().setUp();
    });

    beforeAll(async () => {
        loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    it('1. [C286559] Upload new project', async () => {
        await sidebarActionMenu.clickOnCreateButton();
        const projectDetails = {
            path: Resources.SIMPLE_PROJECT.file_location,
            name: Resources.SIMPLE_PROJECT.project_name
        };
        const absoluteFilePath = path.resolve(testConfig.main.rootPath + projectDetails.path);
        await sidebarActionMenu.uploadProject(absoluteFilePath);
        await sidebarActionMenu.isOptionsMenuDismissed();

        expect(await snackBar.isUploadedSuccessfully('project')).toBe(true);
        expect(await dashboardPage.isProjectNameInList(projectDetails.name)).toBe(true, `Item '${projectDetails.name}' was not found in the list.`);
    });

    afterAll(async () => {
        await cleanupProject(Resources.SIMPLE_PROJECT.project_name);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
