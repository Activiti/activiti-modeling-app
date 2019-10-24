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
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { ProcessContentPage } from 'ama-testing/e2e';
import { ProcessPropertiesCard } from 'ama-testing/e2e';
import { UtilFile } from 'ama-testing/e2e';
import { CodeEditorWidget } from 'ama-testing/e2e';
import { ProcessDefinitionModel } from 'ama-testing/e2e';
import { SnackBar } from 'ama-testing/e2e';

xdescribe('Validate process - update process using XML editor', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);
    const codeEditorWidget = new CodeEditorWidget();

    let backend: Backend;
    let loginPage: LoginPageImplementation;
    let project: NodeEntry;
    let process: NodeEntry;
    let processContentPage: ProcessContentPage;
    const processPropertiesCard: ProcessPropertiesCard = new ProcessPropertiesCard();
    const snackBar = new SnackBar();

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.createAndWaitUntilAvailable();
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
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processPropertiesCard.isLoaded();
    });

    it('[C313386] Project is valid when updating process name with valid value', async () => {
        const xml = await backend.process.getContent(process.entry.id);
        const xmlContent = JSON.parse(await UtilFile.parseXML(xml, false));

        const processDefinitionModel = new ProcessDefinitionModel(xmlContent);
        expect(await processDefinitionModel.getProcessName()).toEqual(process.entry.name);

        await processDefinitionModel.setProcessName('valid-new-name');
        const updatedXML = await UtilFile.parseJSONToXML(processDefinitionModel);

        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();

        await codeEditorWidget.updateCodeEditorContent(updatedXML);

        await processContentPage.save();
        expect(await snackBar.isUpdatedSuccessfully('process')).toBe(true, 'Process update snackbar was not displayed');

        await processContentPage.selectModelerEditorTab();
        expect(await processPropertiesCard.getProcessName()).toEqual('valid-new-name');
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
