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
import { CodeEditorWidget } from 'ama-testing/e2e';
import { ProjectContentPage } from 'ama-testing/e2e';
import { ConnectorContentPage } from 'ama-testing/e2e';
import { browser } from 'protractor';

describe('Update connector', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);
    const codeEditorWidget = new CodeEditorWidget();
    const snackBar = new SnackBar();

    let backend: Backend;
    let loginPage: LoginPageImplementation;
    let project: NodeEntry;
    let connector: NodeEntry;
    let connectorContentPage: ConnectorContentPage;
    let projectContentPage: ProjectContentPage;
    let updatedContent;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        loginPage = LoginPage.get(testConfig);
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    beforeEach(async () => {
        connector = await backend.connector.createAndWaitUntilAvailable(project.entry.id, 'qaconnector');
    });

    beforeEach(async () => {
        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        connectorContentPage = new ConnectorContentPage(testConfig, project.entry.id, connector.entry.id);
        await connectorContentPage.navigateTo();
    });

    it('1. [C289327] Update connector in JSON editor', async () => {
        const newModel = {
            name: 'modifiedname',
            description: 'new description'
        };

        await codeEditorWidget.isTextEditorPresent();

        await codeEditorWidget.updateCodeEditorContent(JSON.stringify(newModel));
        await browser.sleep(1000);
        await connectorContentPage.save();

        expect(await snackBar.isUpdatedSuccessfully('connector')).toBe(true, 'Update snackbar was not displayed properly.');
        expect(await projectContentPage.isModelNotInList('connector', connector.entry.name)).toBe(true, 'Connector with old name should not be in the left sidebar');
        expect(await projectContentPage.isModelInList('connector', newModel.name)).toBe(true, 'Connector with new name was not found in the left sidebar');

        updatedContent = JSON.parse(await backend.connector.getContent(connector.entry.id));
        expect(updatedContent).toEqual(newModel, 'Connector update was not performed properly.');
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
