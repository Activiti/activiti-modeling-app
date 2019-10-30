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
import { LoginPage, LoginPageImplementation } from 'ama-testing/e2e';
import { SnackBar } from 'ama-testing/e2e';
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { ProjectContentPage } from 'ama-testing/e2e';
import { ProcessContentPage } from 'ama-testing/e2e';
import { ProcessPropertiesCard } from 'ama-testing/e2e';
import { UtilFile } from 'ama-testing/e2e';
import { Toolbar } from 'ama-testing/e2e';
import { LeavePageDialog } from 'ama-testing/e2e';

describe('Update process', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);
    const snackBar = new SnackBar();
    const toolbar = new Toolbar();
    const leavePageDialog = new LeavePageDialog();

    let backend: Backend;
    let loginPage: LoginPageImplementation;
    let project: NodeEntry;
    let process: NodeEntry;
    let projectContentPage: ProjectContentPage;
    let processContentPage: ProcessContentPage;
    const processPropertiesCard: ProcessPropertiesCard = new ProcessPropertiesCard();


    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.create();
    });

    beforeAll(async () => {
        loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);

    });

    beforeEach(async() => {
        process = await backend.process.create(project.entry.id);
    });

    beforeEach(async () => {
        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processPropertiesCard.isLoaded();
    });

    it('[C280676] Update process', async () => {
        const updatedProcess = {
            name: process.entry.name + '-updated',
            documentation: process.entry.name + ' documentation updated'
        };

        await processPropertiesCard.editProcessName(updatedProcess.name);
        await processPropertiesCard.editProcessDocumentation(updatedProcess.documentation);
        await processContentPage.save();

        await expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Update snackbar was not displayed properly.');
        await expect(await projectContentPage.isModelNotInList('process', process.entry.name)).toBe(true, 'Process with old name should not be in the left sidebar');
        await expect(await projectContentPage.isModelInList('process', updatedProcess.name)).toBe(true, 'Process with new name was not found in the left sidebar');

        const xml = await backend.process.getContent(process.entry.id);
        const xmlContent = JSON.parse(await UtilFile.parseXML(xml, false));

        const bpmnProcessDetails = xmlContent[`bpmn2:definitions`][`bpmn2:process`][`_attributes`];
        await expect(UtilFile.getJSONItemValueByKey(bpmnProcessDetails, `name`)).toEqual(updatedProcess.name);

        const bpmnProcessDocumentation = xmlContent[`bpmn2:definitions`][`bpmn2:process`][`bpmn2:documentation`];
        await expect(UtilFile.getJSONItemValueByKey(bpmnProcessDocumentation, `_text`)).toEqual(updatedProcess.documentation);
    });

    it('[C286410] Update process - Dirty state with confirmation of navigating away', async () => {
        await processPropertiesCard.editProcessName(process.entry.name + '-updated');
        /* cspell: disable-next-line */
        await expect(await toolbar.isElementInDirtyState(process.entry.name)).toBe(true, 'AZZZZ');
        /* cspell: disable-next-line */
        await expect(await processContentPage.isPageInDirtyState()).toBe(true, 'BZZZZ');

        await toolbar.navigateToBreadcrumbItem(project.entry.name);
        await leavePageDialog.checkDialogAndConfirm('process');

        await processContentPage.navigateTo();
        await expect(await toolbar.isElementNotInDirtyState(process.entry.name)).toBe(true, 'ZZZZZ');
        await expect(await processContentPage.isPageInDirtyState()).toBe(false, 'AAAAA');
    });

    it('[C286431] Update process - Dirty state without confirmation of navigating away', async () => {
        await processPropertiesCard.editProcessName(process.entry.name + '-updated');
        await expect(await toolbar.isElementInDirtyState(process.entry.name)).toBe(true);
        await expect(await authenticatedPage.isPageInDirtyState()).toBe(true);

        await toolbar.navigateToBreadcrumbItem(project.entry.name);
        await leavePageDialog.checkDialogAndReject('process');

        await expect(await toolbar.isElementInDirtyState(process.entry.name)).toBe(true);
        await expect(await processContentPage.isPageInDirtyState()).toBe(true);
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
