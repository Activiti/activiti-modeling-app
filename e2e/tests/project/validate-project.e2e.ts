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

import { NodeEntry } from '@alfresco/js-api';
import { Backend,
    AuthenticatedPage,
    getBackend,
    LoginPage,
    TaskPropertiesCardPage,
    TaskAssignmentDialog,
    ProcessModelerComponent,
    ProcessContentPage,
    ProjectContentPage,
    Toolbar,
    SnackBar,
    ValidationDialog,
LogHistoryPage } from 'ama-testing/e2e';
import { testConfig } from '../../test.config';

describe('Validate project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);
    const snackBar = new SnackBar();
    const logHistoryPage = new LogHistoryPage();
    const validationDialog = new ValidationDialog();
    const taskPropertiesCard = new TaskPropertiesCardPage();
    const taskAssignmentDialog = new TaskAssignmentDialog();
    const processModelerComponent = new ProcessModelerComponent();
    const toolbar = new Toolbar();
    let processContentPage: ProcessContentPage;
    let projectContentPage: ProjectContentPage;

    let backend: Backend;
    let project: NodeEntry;
    let process: NodeEntry;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
    });

    beforeEach(async () => {
        project = await backend.project.create();
    });

    afterEach(async () => {
        try {
            await backend.project.delete(project.entry.id);
        } catch (e) {
            throw new Error(`Cleaning up created project failed: ${e}`);
        }
    });

    afterAll(async () => {
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    it('[C324999] Correct validation message should be displayed for Projects without any errors', async () => {
        process = await backend.process.create(project.entry.id);
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processModelerComponent.addUserTask();
        await taskPropertiesCard.openAssignmentDialog();
        await taskAssignmentDialog.isLoaded();
        await taskAssignmentDialog.setAssignee('userAssignee');
        await taskAssignmentDialog.assign();
        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');

        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        await projectContentPage.navigateTo();
        await toolbar.validateProject();
        await expect(await snackBar.isValidatedSuccessfully()).toBe(true, 'Validate project snackbar was not displayed');
    });

    it('[C325001] Validation project errors should be displayed when clicking on the "Validate Project" button', async () => {
        const validationError = `One of the attributes 'assignee','candidateUsers' or 'candidateGroups' are mandatory on user task`;
        process = await backend.process.create(project.entry.id);
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processModelerComponent.addUserTask();

        await processContentPage.save();
        await expect(await validationDialog.getErrorMessage()).toBe(validationError);
        await validationDialog.confirm();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');

        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        await projectContentPage.navigateTo();
        await toolbar.validateProject();
        await expect(await validationDialog.getErrorMessage()).toBe(validationError);
        await validationDialog.reject();
        await logHistoryPage.clickMessageIndicator();
        await expect(await logHistoryPage.getMessage()).toBe(validationError);
    });

});
