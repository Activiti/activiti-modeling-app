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
import { LoginPage } from 'ama-testing/e2e';
import { DashboardPage } from 'ama-testing/e2e';
import { DeleteEntityDialog } from 'ama-testing/e2e';
import { SnackBar } from 'ama-testing/e2e';
import { NodeEntry } from '@alfresco/js-api';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { Logger } from 'ama-testing/e2e';

describe('Delete project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);
    const dashboardPage = new DashboardPage();
    const snackBar = new SnackBar();
    const deleteEntityDialog = new DeleteEntityDialog();

    let backend: Backend;
    let project: NodeEntry;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.create();

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
    });

    afterAll(async () => {
        try {
            await backend.project.delete(project.entry.id);
        } catch (e) {
            Logger.warn(`${project.entry.name} is not there, no need to delete (?)...\nError: ${e}`);
        }
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    it('[C286407] Delete project with confirmation', async () => {
        const projectId = project.entry.id;
        await expect(await dashboardPage.isDashboardListDisplayed()).toBe(true);
        await dashboardPage.deleteProject(projectId);
        await deleteEntityDialog.checkDialogAndConfirm('project');
        await expect(await snackBar.isDeletedSuccessfully('project')).toBe(true);
        await expect(await dashboardPage.isProjectNotInList(projectId)).toBe(true);
    });
});
