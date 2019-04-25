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
import { LoginPage, LoginPageImplementation, UtilRandom } from 'ama-testing/e2e';
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { ProjectContentPage } from 'ama-testing/e2e';
import { Toolbar } from 'ama-testing/e2e';
import { DashboardPage } from 'ama-testing/e2e';
import { SidebarActionMenu } from 'ama-testing/e2e';
import { CreateEntityDialog } from 'ama-testing/e2e';

describe('List connectors', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);
    const toolbar = new Toolbar();
    const dashboardPage = new DashboardPage(testConfig);
    const sidebarActionMenu = new SidebarActionMenu();
    const createEntityDialog = new CreateEntityDialog();

    let backend: Backend;
    let loginPage: LoginPageImplementation;
    let project1, project2: NodeEntry;
    let connector1, connector2: NodeEntry;
    let projectContentPage: ProjectContentPage;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();

        project1 = await backend.project.createAndWaitUntilAvailable();
        connector1 = await backend.connector.create(project1.entry.id, 'qaconnector1');

        project2 = await backend.project.createAndWaitUntilAvailable();
        connector2 = await backend.connector.create(project2.entry.id, 'qaconnector2');
    });

    beforeAll(async () => {
        loginPage = LoginPage.get(testConfig);
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    beforeEach(async() => {
        projectContentPage = new ProjectContentPage(testConfig, project1.entry.id);
    });

    it('1. [C290149] List of connectors is not empty when navigate to Dashboard - item is available', async () => {
        await dashboardPage.navigateToProject(project1.entry.id);
        await projectContentPage.openFilter('connector');
        expect(await projectContentPage.isModelInList('connector', connector1.entry.name)).toBe(true, 'Connector is not displayed in the left sidebar');

        await toolbar.goToHome();

        await dashboardPage.navigateToProject(project1.entry.id);
        await projectContentPage.openFilter('connector');
        expect(await projectContentPage.isModelInList('connector', connector1.entry.name)).toBe(true, 'Connector is not displayed in the left sidebar');

    });

    it('2. [C290140] List of connectors is not empty when navigate to Dashboard', async () => {
        await dashboardPage.navigateTo();
        await dashboardPage.navigateToProject(project1.entry.id);
        await sidebarActionMenu.createConnector();
        const connectorItem = await createEntityDialog.setEntityDetails('amaqa' + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz'));
        expect(await projectContentPage.isModelInList('connector', connectorItem.name)).toBe(true, 'Connector is not displayed in the left sidebar');

        await dashboardPage.navigateTo();

        await dashboardPage.navigateToProject(project1.entry.id);
        await projectContentPage.openFilter('connector');
        expect(await projectContentPage.isModelInList('connector', connectorItem.name)).toBe(true, 'Connector is not displayed in the left sidebar');

    });

    it('3. [C291775] List of connectors is not empty when navigate to Dashboard - switch between projects', async () => {
        await dashboardPage.navigateTo();
        await dashboardPage.navigateToProject(project1.entry.id);
        await projectContentPage.openFilter('connector');
        expect(await projectContentPage.isModelInList('connector', connector1.entry.name)).toBe(true, 'Connector is not displayed in the left sidebar');

        await toolbar.goToHome();

        await dashboardPage.navigateToProject(project2.entry.id);
        await projectContentPage.openFilter('connector');
        expect(await projectContentPage.isModelInList('connector', connector2.entry.name)).toBe(true, 'Connector is not displayed in the left sidebar');
        expect(await projectContentPage.isModelNotInList('connector', connector1.entry.name)).toBe(true, `Connector from a different project is displayed in the left sidebar`);

    });

    afterAll(async () => {
        await backend.project.delete(project1.entry.id);
        await backend.project.delete(project2.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
