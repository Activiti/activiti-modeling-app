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
import { Toolbar } from 'ama-testing/e2e';
import { NodeEntry } from '@alfresco/js-api';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { UtilFile } from 'ama-testing/e2e';
import { browser } from 'protractor';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { ConfirmationDialog } from 'ama-testing/e2e';

const path = require('path');

describe('Export project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);
    const dashboardPage = new DashboardPage();
    const toolBar = new Toolbar();

    let backend: Backend;
    let project: NodeEntry;

    const downloadDir = browser.params.downloadDir;

    beforeEach(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.create();

        // clean-up files from download directory
        UtilFile.deleteFilesByPattern(downloadDir, project.entry.name);
    });

    beforeAll(async () => {
        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
    });

    afterEach(async () => {
        await backend.project.delete(project.entry.id);
    });

    afterAll(async () => {
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    it('[C286593] Export project without process', async () => {
        const projectId = project.entry.id;
        await dashboardPage.navigateToProject(projectId);
        await toolBar.downloadFile();

        const confirmationDialog = new ConfirmationDialog('Validation errors found in project\'s models');
        await expect(await confirmationDialog.getSubTitleText()).toBe('Validation errors:');
        await expect(await confirmationDialog.getMessageText(1)).toBe('Project must contain at least one process');
        await expect(await confirmationDialog.getTotalMessageCount()).toBe(1);
    });

    it('[C286635] Export project with process', async () => {
        const projectId = project.entry.id;
        await backend.process.create(project.entry.id);
        await dashboardPage.navigateToProject(projectId);
        await toolBar.downloadFile();
        const downloadedApp = path.join(downloadDir, `${project.entry.name}.zip`);
        await expect(await UtilFile.fileExists(downloadedApp)).toBe(true);
    });
});
