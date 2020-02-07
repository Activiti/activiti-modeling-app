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
    TaskAssignmentDialog,
    UtilFile,
    ValidationDialog } from 'ama-testing/e2e';
import { browser } from 'protractor';
import { Resources } from '../../resources/resources';
import { StringUtil } from '@alfresco/adf-testing';

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
    const taskAssignmentDialog = new TaskAssignmentDialog();
    const taskProperties = new TaskPropertiesCardPage();
    const processValidation = new ValidationDialog();
    const toolbar = new Toolbar();

    let backend: Backend;
    let project: NodeEntry;
    let process: NodeEntry;
    let projectContentPage: ProjectContentPage;
    const processContentPage = new ProcessContentPage(testConfig);

    const downloadDir = browser.params.downloadDir;
    const resourcesDir = browser.params.resourcesDir;

    const projectDetails = {
        filePath: Resources.SIMPLE_PROJECT.file_location,
        name: Resources.SIMPLE_PROJECT.project_name,
        processName: Resources.SIMPLE_PROJECT.process_name
    };

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        const absoluteFilePath = path.join(resourcesDir, projectDetails.filePath);
        project = await backend.project.import(absoluteFilePath, `${projectDetails.name}-${StringUtil.generateRandomString(5)}`);

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        await projectContentPage.navigateTo();
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    it('[C289346] Create process using New dropdown', async () => {
        await sidebarActionMenu.createProcess();
        /* cspell: disable-next-line */
        const processUI = await createEntityDialog.setEntityDetails('ama-qa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        await expect(await snackBar.isCreatedSuccessfully('process')).toBe(true, 'Process creation snackbar should be displayed');
        await expect(await projectContentPage.isModelInList('process', processUI.name)).toBe(true, 'Process should be in the left sidebar');
        await expect(await toolbar.isItemDisplayed(processUI.name)).toBe(true, 'Process name should be displayed in the breadcrumb');
    });

    it('[C291962] Create process using + button', async () => {
        await projectContentPage.createProcess();
        /* cspell: disable-next-line */
        const processUI = await createEntityDialog.setEntityDetails('ama-qa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        await expect(await snackBar.isCreatedSuccessfully('process')).toBe(true, 'Process creation snackbar should be displayed');
        await expect(await projectContentPage.isModelInList('process', processUI.name)).toBe(true, 'Process should be in the left sidebar');
        await expect(await toolbar.isItemDisplayed(processUI.name)).toBe(true, 'Process name should be displayed in the breadcrumb');
    });

    it('[C289324] Create process with CallActivity', async () => {
        const callActivityProcess = await backend.process.create(project.entry.id);

        await browser.refresh();

        await projectContentPage.clickOnModelByName('process', projectDetails.processName);
        const uiProcessId = await new ProcessPropertiesCard().getProcessId();

        await projectContentPage.clickOnModelByName('process', callActivityProcess.entry.name);
        await processModelerComponent.addCallActivity();
        await processProperties.setActivity(projectDetails.processName);
        await processProperties.setProcess(uiProcessId);
        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');

        await processContentPage.downloadProcess();
        const downloadedProcess = path.join(downloadDir, `${callActivityProcess.entry.name}.bpmn20.xml`);
        await expect(await UtilFile.fileExists(downloadedProcess)).toBe(true);

        const fileContent = xml2js(await UtilFile.readFile(downloadedProcess));
        const bpmnCallActivity = fileContent[`bpmn2:definitions`][`bpmn2:process`][`bpmn2:callActivity`];
        await expect(bpmnCallActivity._attributes.calledElement).toEqual(uiProcessId);
    });

    it('[C311460] Create a process with User Task with the assignee', async () => {
        process = await backend.process.create(project.entry.id);

        await browser.refresh();

        await projectContentPage.clickOnModelByName('process', process.entry.name);
        await processModelerComponent.addUserTask();
        await processContentPage.save();
        await expect(await processValidation.isTitleDisplayed()).toBe(true, 'Incorrect title is displayed');
        await processValidation.confirm();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
        await expect(await snackBar.isSnackBarNotDisplayed()).toBe(true, 'Snackbar was displayed');
        await processValidation.isDialogDismissed();
        await processModelerComponent.selectStartEvent();

        await processModelerComponent.selectUserTask();
        await taskProperties.openAssignmentDialog();
        await taskAssignmentDialog.isLoaded();
        await taskAssignmentDialog.setAssignee('userAssignee');
        await taskAssignmentDialog.assign();
        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
    });

    it('[C311461] Create a process with User Task with the candidate user', async () => {
        process = await backend.process.create(project.entry.id);

        await browser.refresh();

        await projectContentPage.clickOnModelByName('process', process.entry.name);
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
        await taskProperties.openAssignmentDialog();
        await taskAssignmentDialog.isLoaded();
        await taskAssignmentDialog.selectAssignToCandidatesOption();
        await taskAssignmentDialog.setCandidateUsers('candidateUser');
        await taskAssignmentDialog.assign();
        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
    });

    it('[C311462] Create a process with User Task with the candidate group', async () => {
        process = await backend.process.create(project.entry.id);

        await browser.refresh();

        await projectContentPage.clickOnModelByName('process', process.entry.name);
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
        await taskProperties.openAssignmentDialog();
        await taskAssignmentDialog.isLoaded();
        await taskAssignmentDialog.selectAssignToCandidatesOption();
        await taskAssignmentDialog.setCandidateUsers('CandidateGroup');
        await taskAssignmentDialog.assign();
        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');
    });
});
