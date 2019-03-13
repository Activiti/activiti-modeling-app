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
import { SnackBar } from '../../pages/snackbar';
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from '../../api/api.interfaces';
import { getBackend } from '../../api/helpers';
import { AuthenticatedPage } from '../../pages/authenticated.page';
import { ProjectContentPage } from '../../pages/project-content.page';
import { ProcessContentPage } from '../../pages/process-content.page';
import { ProcessPropertiesCard } from '../../pages/process-properties.card';
import { UtilFile } from '../../util/file';
import { Toolbar } from '../../pages/toolbar';
import { LeavePageDialog } from '../../pages/dialog/leave-page.dialog';

describe('Update process', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage();
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
        backend = await getBackend().setUp();
        project = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    beforeEach(async() => {
        process = await backend.process.create(project.entry.id);
    });

    beforeEach(async () => {
        projectContentPage = new ProjectContentPage(project.entry.id);
        processContentPage = new ProcessContentPage(project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processPropertiesCard.isLoaded();
    });

    it('1. [C280676] Update process', async () => {
        const updatedProcess = {
            name: process.entry.name + '_updated',
            documentation: process.entry.name + ' documentation updated'
        };

        await processPropertiesCard.editProcessName(updatedProcess.name);
        await processPropertiesCard.editProcessDocumentation(updatedProcess.documentation);
        await processContentPage.save();

        expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Update snackbar was not displayed properly.');
        expect(await projectContentPage.isModelNotInList('process', process.entry.name)).toBe(true, 'Process with old name should not be in the left sidebar');
        expect(await projectContentPage.isModelInList('process', updatedProcess.name)).toBe(true, 'Process with new name was not found in the left sidebar');

        const xml = await backend.process.getContent(process.entry.id);
        const xmlContent = JSON.parse(await UtilFile.parseXML(xml, false));

        const bpmnProcessDetails = xmlContent[`bpmn2:definitions`][`bpmn2:process`][`_attributes`];
        expect(UtilFile.getJSONItemValueByKey(bpmnProcessDetails, `name`)).toEqual(updatedProcess.name);

        const bpmnProcessDocumentation = xmlContent[`bpmn2:definitions`][`bpmn2:process`][`bpmn2:documentation`];
        expect(UtilFile.getJSONItemValueByKey(bpmnProcessDocumentation, `_text`)).toEqual(updatedProcess.documentation);
    });

    it('2. [C286410] Update process - Dirty state with confirmation of navigating away', async () => {
        await processPropertiesCard.editProcessName(process.entry.name + '_updated');
        expect(await toolbar.isElementInDirtyState(process.entry.name)).toBe(true, 'AZZZZ');
        expect(await processContentPage.isPageInDirtyState()).toBe(true, 'BZZZZ');

        await toolbar.navigateToBreadcrumbItem(project.entry.name);
        await leavePageDialog.checkDialogAndConfirm('process');

        await processContentPage.navigateTo();
        expect(await toolbar.isElementNotInDirtyState(process.entry.name)).toBe(true, 'ZZZZZ');
        expect(await processContentPage.isPageInDirtyState()).toBe(false, 'AAAAA');
    });

    it('3. [C286431] Update process - Dirty state without confirmation of navigating away', async () => {
        await processPropertiesCard.editProcessName(process.entry.name + '_updated');
        expect(await toolbar.isElementInDirtyState(process.entry.name)).toBe(true);
        expect(await processContentPage.isPageInDirtyState()).toBe(true);

        await toolbar.navigateToBreadcrumbItem(project.entry.name);
        await leavePageDialog.checkDialogAndReject('process');

        expect(await toolbar.isElementInDirtyState(process.entry.name)).toBe(true);
        expect(await processContentPage.isPageInDirtyState()).toBe(true);
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
