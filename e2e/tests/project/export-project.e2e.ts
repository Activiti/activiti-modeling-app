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
import { DashboardPage } from '../../pages/dashboard.page';
import { Toolbar } from '../../pages/toolbar';
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from '../../api/api.interfaces';
import { getBackend } from '../../api/helpers';
import { UtilFile } from '../../util/file';
import { browser } from 'protractor';
import { AuthenticatedPage } from '../../pages/authenticated.page';

const path = require('path');

describe('Export project', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const loginPage: LoginPageImplementation = LoginPage.get();
    const authenticatedPage = new AuthenticatedPage();
    const dashboardPage = new DashboardPage();
    const toolBar = new Toolbar();

    let backend: Backend;
    let app: NodeEntry;

    const downloadDir = browser.params.downloadDir;

    beforeEach(async () => {
        backend = await getBackend().setUp();
        app = await backend.project.createAndWaitUntilAvailable();
    });

    beforeEach(async () => {
        // clean-up files from download directory
        UtilFile.deleteFilesByPattern(downloadDir, app.entry.name);
    });

    beforeEach(async () => {
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    it('1. [C286593] Export project', async () => {
        const appId = app.entry.id;
        await dashboardPage.navigateToProject(appId);
        await toolBar.downloadFile();
        const downloadedApp = path.join(downloadDir, `${app.entry.name}.zip`);
        expect(await UtilFile.fileExists(downloadedApp)).toBe(true);
    });

    afterEach(async () => {
        await backend.project.delete(app.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
