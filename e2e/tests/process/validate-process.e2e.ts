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
    LoginPage,
    js2xml,
    xml2js,
    Backend,
    getBackend,
    AuthenticatedPage,
    ProcessContentPage,
    ProcessPropertiesCard,
    CodeEditorWidget,
    ProcessDefinitionModel,
    SnackBar,
    ProcessModelerComponent,
    TaskAssignmentDialog,
    TaskPropertiesCardPage,
    ValidationDialog,
    LogHistoryPage
} from 'ama-testing/e2e';

describe('Validate process - update process using XML editor', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);
    const codeEditorWidget = new CodeEditorWidget();
    const processModelerComponent = new ProcessModelerComponent(testConfig);
    const taskAssignmentDialog = new TaskAssignmentDialog();
    const taskProperties = new TaskPropertiesCardPage();
    const processValidation = new ValidationDialog();
    const logHistory = new LogHistoryPage();

    let backend: Backend;
    let project: NodeEntry;
    let process: NodeEntry;
    let processContentPage: ProcessContentPage;
    const processPropertiesCard: ProcessPropertiesCard = new ProcessPropertiesCard();
    const snackBar = new SnackBar();

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.create();
        process = await backend.process.create(project.entry.id);

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
    });

    beforeEach( async () => {
        process = await backend.process.create(project.entry.id);
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    it('[C313386] Project is valid when updating process name with valid value', async () => {
        const xml = await backend.process.getContent(process.entry.id);
        const xmlContent = xml2js(xml);

        const processDefinitionModel = new ProcessDefinitionModel(xmlContent);
        await expect(await processDefinitionModel.getProcessName()).toEqual(process.entry.name);

        await processDefinitionModel.setProcessName('valid-new-name');
        const updatedXML = js2xml(processDefinitionModel);

        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();

        await codeEditorWidget.updateCodeEditorContent(updatedXML);

        await processContentPage.save();
        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');

        await processContentPage.selectModelerEditorTab();
        await expect(await processPropertiesCard.getProcessName()).toEqual('valid-new-name');
    });

    it('[C325194] Correct validation message should be displayed for Process without any errors', async () => {
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
        await taskAssignmentDialog.setAssignee('userAssignee');
        await taskAssignmentDialog.assign();

        await processContentPage.validate();
        await expect(await snackBar.isValidatedSuccessfully('process')).toBe(true, 'Process validation snackbar was not displayed');

    });

    it('[C325195] Validation Process errors should be displayed when clicking on the Validate Process button', async () => {
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

        await processContentPage.validate();
        await expect(await snackBar.isValidatedUnsuccessfully('process')).toBe(true, 'Process validation snackbar was not displayed');
        await logHistory.clickMessageIndicator();
        await expect(await logHistory.getMessage()).toBe(`One of the attributes 'assignee','candidateUsers' or 'candidateGroups' are mandatory on user task`);

    });
});
