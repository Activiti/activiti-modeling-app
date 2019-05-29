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
import { UtilFile } from 'ama-testing/e2e';
import { browser } from 'protractor';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { ConnectorContentPage } from 'ama-testing/e2e';

const path = require('path');

xdescribe('Export connector', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const loginPage: LoginPageImplementation = LoginPage.get(testConfig);
    const authenticatedPage = new AuthenticatedPage(testConfig);

    let backend: Backend;
    let project: NodeEntry;
    let connector: NodeEntry;
    let connectorContentPage: ConnectorContentPage;

    const downloadDir = browser.params.downloadDir;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    beforeEach( async() => {
        connector = await backend.connector.create(project.entry.id, 'qaconnector');
    });

    it('1. [C286439] Export connector', async () => {
        connectorContentPage = new ConnectorContentPage(testConfig, project.entry.id, connector.entry.id);
        await connectorContentPage.navigateTo();
        await connectorContentPage.download();

        const downloadedConnector = path.join(downloadDir, `${connector.entry.name}.json`);
        expect(await UtilFile.fileExists(downloadedConnector)).toBe(true);

        const fileContent = await UtilFile.readFile(downloadedConnector);
        const connectorJson = JSON.parse(`${fileContent}`);
        expect(connectorJson.name).toEqual(connector.entry.name);
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
