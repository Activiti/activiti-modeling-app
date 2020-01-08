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
import { browser } from 'protractor';
import {
    LoginPage,
    DashboardPage,
    Toolbar,
    Backend,
    getBackend,
    UtilFile,
    AuthenticatedPage,
    ConfirmationDialog } from 'ama-testing/e2e';
import { NodeEntry } from '@alfresco/js-api';

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
    let projectId: string;
    let downloadedApp: string;

    const downloadDir = browser.params.downloadDir;

    beforeEach(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.create();
        projectId = project.entry.id;

        // clean-up files from download directory
        UtilFile.deleteFilesByPattern(downloadDir, project.entry.name);
        downloadedApp = path.join(downloadDir, `${project.entry.name}.zip`);
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
        await dashboardPage.navigateToProject(projectId);
        await toolBar.downloadFile();

        const confirmationDialog = new ConfirmationDialog('Validation errors found in project\'s models');
        await expect(await confirmationDialog.getSubTitleText()).toBe('Validation errors:');
        await expect(await confirmationDialog.getMessageText(1)).toBe('Project must contain at least one process');
        await expect(await confirmationDialog.getTotalMessageCount()).toBe(1);
        await confirmationDialog.reject();
    });

    it('[C286635] Export project with process', async () => {
        await backend.process.create(project.entry.id);
        await toolBar.goToHome();
        await dashboardPage.navigateToProject(projectId);
        await toolBar.downloadFile();
        await expect(await UtilFile.fileExists(downloadedApp)).toBe(true);
    });

    it('[C325000] Export project from Dashboard', async () => {
        await backend.process.create(project.entry.id);
        await toolBar.goToHome();
        await dashboardPage.downloadProject(projectId);
        await expect(await UtilFile.fileExists(downloadedApp)).toBe(true);
    });
});
