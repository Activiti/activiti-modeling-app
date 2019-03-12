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

import { LoginPage, LoginPageImplementation } from '../../pages/login.page';
import { Resources } from '../../util/resources';
import { SnackBar } from '../../pages/snackbar';
import { Backend } from '../../api/api.interfaces';
import { getBackend } from '../../api/helpers';
import { NodeEntry } from 'alfresco-js-api-node';
import { testConfig } from '../../test.config';
import { AuthenticatedPage } from '../../pages/authenticated.page';
import { ProjectContentPage } from '../../pages/project-content.page';
import { ConnectorContentPage } from '../../pages/connector-content.page';
import { CodeEditorWidget } from '../../pages/code-editor.widget';
import { UtilFile } from '../../util/file';
import { SidebarActionMenu } from '../../pages/sidebar.menu';

const path = require('path');

describe('Upload connector', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const CONNECTOR = Resources.COMPLEX_CONNECTOR;
    const absoluteFilePath = path.resolve(testConfig.main.rootPath + CONNECTOR.file_location);

    const authenticatedPage = new AuthenticatedPage();
    const snackBar = new SnackBar();
    const connectorContentPage = new ConnectorContentPage();
    const codeEditorWidget = new CodeEditorWidget();
    const sidebarActionMenu = new SidebarActionMenu();

    let backend: Backend;
    let project: NodeEntry;
    let loginPage: LoginPageImplementation;
    let projectContentPage: ProjectContentPage;


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

    beforeEach(async () => {
        projectContentPage = new ProjectContentPage(project.entry.id);
        await projectContentPage.navigateTo();
    });

    it('1. [C286309] Upload/Import connector using New dropdown', async () => {
        await sidebarActionMenu.importConnector(absoluteFilePath);
        expect(await snackBar.isUploadedSuccessfully('connector')).toBe(true, 'Connector upload snackbar should be displayed');
        expect(await projectContentPage.isModelInList('connector', CONNECTOR.connector_name)).toBe(true, `Item '${CONNECTOR.connector_name}' was not found in the list.`);

        let expectedConnectorJSON: any = await UtilFile.readFile(absoluteFilePath);
        expectedConnectorJSON = JSON.parse(`${expectedConnectorJSON}`);

        const actualConnectorJSON = await codeEditorWidget.getCodeEditorValue();
        expect(JSON.parse(`${actualConnectorJSON}`)).toEqual(expectedConnectorJSON, `Connector JSON editor content is not correct.`);
    });

    it('2. [C291965] Upload/Import connector using Import button', async () => {
        await projectContentPage.importModel('connector', absoluteFilePath);
        expect(await snackBar.isUploadedSuccessfully('connector')).toBe(true, 'Connector upload snackbar should be displayed');
        expect(await projectContentPage.isModelInList('connector', CONNECTOR.connector_name)).toBe(true, `Item '${CONNECTOR.connector_name}' was not found in the list.`);

        let expectedConnectorJSON: any = await UtilFile.readFile(absoluteFilePath);
        expectedConnectorJSON = JSON.parse(`${expectedConnectorJSON}`);

        const actualConnectorJSON = await codeEditorWidget.getCodeEditorValue();
        expect(JSON.parse(`${actualConnectorJSON}`)).toEqual(expectedConnectorJSON, `Connector JSON editor content is not correct.`);
    });

    afterEach(async () => {
        await backend.connector.delete(await connectorContentPage.getModelId());
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
