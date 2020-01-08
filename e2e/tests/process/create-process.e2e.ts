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
import { NodeEntry } from '@alfresco/js-api';
import {
    LoginPage, UtilRandom, xml2js,
    SidebarActionMenu,
    CreateEntityDialog,
    ProjectContentPage,
    SnackBar,
    Backend,
    getBackend,
    AuthenticatedPage,
    ProcessContentPage,
    ProcessModelerComponent,
    ProcessPropertiesCard,
    Toolbar,
    TaskPropertiesCardPage,
    UtilFile,
    ValidationDialog } from 'ama-testing/e2e';
import { browser } from 'protractor';

const path = require('path');

describe('Create process', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const sidebarActionMenu = new SidebarActionMenu();
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const createEntityDialog = new CreateEntityDialog();
    const snackBar = new SnackBar();
    const processModelerComponent = new ProcessModelerComponent(testConfig);
    const processProperties = new ProcessPropertiesCard();
    const taskProperties = new TaskPropertiesCardPage();
    const processValidation = new ValidationDialog();
    const toolbar = new Toolbar();

    let backend: Backend;
    let project: NodeEntry;
    let process: NodeEntry;
    let projectContentPage: ProjectContentPage;
    let processContentPage: ProcessContentPage;

    const downloadDir = browser.params.downloadDir;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.create();

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    beforeEach(async () => {
        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
    });

    it('[C289346] Create process using New dropdown', async () => {
        await projectContentPage.navigateTo();

        await sidebarActionMenu.createProcess();
        /* cspell: disable-next-line */
        const processUI = await createEntityDialog.setEntityDetails('ama-qa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        await expect(await snackBar.isCreatedSuccessfully('process')).toBe(true, 'Process creation snackbar should be displayed');
        await expect(await projectContentPage.isModelInList('process', processUI.name)).toBe(true, 'Process should be in the left sidebar');
        await expect(await toolbar.isItemDisplayed(processUI.name)).toBe(true, 'Process name should be displayed in the breadcrumb');
    });

    it('[C291962] Create process using + button', async () => {
        await projectContentPage.navigateTo();
        await projectContentPage.createProcess();
        /* cspell: disable-next-line */
        const processUI = await createEntityDialog.setEntityDetails('ama-qa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        await expect(await snackBar.isCreatedSuccessfully('process')).toBe(true, 'Process creation snackbar should be displayed');
        await expect(await projectContentPage.isModelInList('process', processUI.name)).toBe(true, 'Process should be in the left sidebar');
        await expect(await toolbar.isItemDisplayed(processUI.name)).toBe(true, 'Process name should be displayed in the breadcrumb');
    });

    it('[C289324] Create process with CallActivity', async () => {
        process = await backend.process.create(project.entry.id);
        const callActivityProcess = await backend.process.create(project.entry.id);

        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();

        await processModelerComponent.addCallActivity();
        await processProperties.setActivity(callActivityProcess.entry.name);
        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');

        await processContentPage.downloadProcess();
        const downloadedProcess = path.join(downloadDir, `${process.entry.name}.bpmn20.xml`);
        await expect(await UtilFile.fileExists(downloadedProcess)).toBe(true);

        const fileContent = xml2js(await UtilFile.readFile(downloadedProcess));
        const bpmnCallActivity = fileContent[`bpmn2:definitions`][`bpmn2:process`][`bpmn2:callActivity`];

        await expect(bpmnCallActivity._attributes.calledElement).toEqual(`process-${callActivityProcess.entry.id}`);
    });

    it('[C311460] Create a process with User Task with the assignee', async () => {
        process = await backend.process.create(project.entry.id);

        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processModelerComponent.addUserTask();

        await processContentPage.save();
        await expect(await processValidation.isTitleDisplayed()).toBe(true, 'Incorrect title is displayed');
        await processValidation.confirm();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
        await expect(await snackBar.isSnackBarNotDisplayed()).toBe(true, 'Snackbar was displayed');
        await processValidation.isDialogDismissed();
        await processModelerComponent.selectStartEvent();
        await processModelerComponent.selectUserTask();
        await taskProperties.setAssignee('userAssignee');

        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
    });

    it('[C311461] Create a process with User Task with the candidate user', async () => {
        process = await backend.process.create(project.entry.id);

        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processModelerComponent.addUserTask();
        await processContentPage.save();
        await processValidation.isDialogDisplayed();
        await expect(await processValidation.isTitleDisplayed()).toBe(true, 'Incorrect title is displayed');
        await processValidation.confirm();
        await processValidation.isDialogDismissed();

        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
        await expect(await snackBar.isSnackBarNotDisplayed()).toBe(true, 'Snackbar was displayed');
        await processModelerComponent.selectStartEvent();
        await processModelerComponent.selectUserTask();
        await taskProperties.setCandidateUser('candidateUser');

        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
    });

    it('[C311462] Create a process with User Task with the candidate group', async () => {
        process = await backend.process.create(project.entry.id);

        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processModelerComponent.addUserTask();
        await processContentPage.save();
        await processValidation.isDialogDisplayed();
        await expect(await processValidation.isTitleDisplayed()).toBe(true, 'Incorrect title is displayed');
        await processValidation.confirm();
        await processValidation.isDialogDismissed();

        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
        await expect(await snackBar.isSnackBarNotDisplayed()).toBe(true, 'Snackbar was displayed');
        await processModelerComponent.selectStartEvent();
        await processModelerComponent.selectUserTask();
        await taskProperties.setCandidateGroup('CandidateGroup');

        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
    });
});
