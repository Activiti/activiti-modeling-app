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
import { LoginPage, LoginPageImplementation } from '../../pages/login.page';
import { SidebarActionMenu } from '../../pages/sidebar.menu';
import { CreateEntityDialog } from '../../pages/dialog/create-entity.dialog';
import { DashboardPage } from '../../pages/dashboard.page';
import { SnackBar } from '../../pages/snackbar';
import { Backend } from '../../api/api.interfaces';
import { getBackend } from '../../api/helpers';
import { AuthenticatedPage } from '../../pages/authenticated.page';
import { Logger } from '../../util/logger';

describe('Create project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const sidebarActionMenu = new SidebarActionMenu();
    const createEntityDialog = new CreateEntityDialog();
    const authenticatedPage = new AuthenticatedPage();
    const dashboardPage = new DashboardPage();
    const snackBar = new SnackBar();

    let backend: Backend;
    let loginPage: LoginPageImplementation;

    beforeEach(async () => {
        backend = await getBackend().setUp();
    });

    beforeEach(async () => {
        loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    it('1. [C284637] Create new project', async () => {
        await sidebarActionMenu.createProject();

        const project = await createEntityDialog.setEntityDetails();

        expect(await snackBar.isCreatedSuccessfully('project')).toBe(true);
        expect(await dashboardPage.isProjectNameInList(project.name)).toBe(true);

        try {
            const createdAppId = await dashboardPage.getIdForProjectByItsName(project.name);
            await backend.project.delete(createdAppId);
        } catch (e) {
            Logger.error(`Cleaning up created project failed: ${project.name}`);
            throw e;
        }
    });

    afterEach(async () => {
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
