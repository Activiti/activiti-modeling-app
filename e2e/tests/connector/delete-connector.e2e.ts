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
import { DeleteEntityDialog } from 'ama-testing/e2e';
import { SnackBar } from 'ama-testing/e2e';
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { ProjectContentPage } from 'ama-testing/e2e';
import { ConnectorContentPage } from 'ama-testing/e2e';

describe('Delete connector', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const loginPage: LoginPageImplementation = LoginPage.get(testConfig);
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const snackBar = new SnackBar();
    const deleteEntityDialog = new DeleteEntityDialog();
    let connectorContentPage: ConnectorContentPage;
    let projectContentPage: ProjectContentPage;

    let backend: Backend;
    let app: NodeEntry;
    let connector: NodeEntry;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        app = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    beforeEach( async() => {
        connector = await backend.connector.createAndWaitUntilAvailable(app.entry.id, 'qaconnector');
    });

    beforeEach(async () => {
        projectContentPage = new ProjectContentPage(testConfig, app.entry.id);
        connectorContentPage = new ConnectorContentPage(testConfig, app.entry.id, connector.entry.id);
        await connectorContentPage.navigateTo();
    });

    beforeEach(async () => {
        expect(await projectContentPage.isModelInList('connector', connector.entry.name)).toBe(true, 'Connector should be in the left sidebar');

        await projectContentPage.clickOnModel('connector', connector.entry.id);

        await connectorContentPage.isLoaded();
        await connectorContentPage.deleteConnector();
    });

    it('1. [C280483] Delete connector with confirmation', async () => {
        await deleteEntityDialog.checkDialogAndConfirm('connector');
        expect(await snackBar.isDeletedSuccessfully('connector')).toBe(true, 'Connector deletion snackbar message was not displayed properly.');
        expect(await projectContentPage.isModelNotInList('connector', connector.entry.id)).toBe(true, 'Connector was not removed from the left sidebar.');
        expect(await connectorContentPage.isUnloaded()).toBe(true, 'After connector deletion, the connector editor should be unloaded');
    });

    it('2. [C280488] Delete connector without confirmation', async () => {
        await deleteEntityDialog.checkDialogAndReject('connector');
        expect(await projectContentPage.isModelInList('connector', connector.entry.name)).toBe(true, 'Connector should be in the left sidebar');
    });

    afterAll(async () => {
        await backend.project.delete(app.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
