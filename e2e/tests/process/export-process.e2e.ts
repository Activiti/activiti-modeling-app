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
import { ProjectContentPage } from 'ama-testing/e2e';
import { ProcessContentPage } from 'ama-testing/e2e';
import { ProcessPropertiesCard } from 'ama-testing/e2e';

const path = require('path');

describe('Export process', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const loginPage: LoginPageImplementation = LoginPage.get();
    const authenticatedPage = new AuthenticatedPage(testConfig);

    let backend: Backend;
    let project, process: NodeEntry;
    let projectContentPage: ProjectContentPage;
    let processContentPage: ProcessContentPage;

    const downloadDir = browser.params.downloadDir;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);

        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        await projectContentPage.navigateTo();
    });

    beforeEach( async() => {
        process = await backend.process.create(project.entry.id);
    });

    xit('[C286624] Export process', async () => {
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processContentPage.downloadProcess();

        const downloadedProcess = path.join(downloadDir, `${process.entry.name}.bpmn20.xml`);
        expect(await UtilFile.fileExists(downloadedProcess)).toBe(true);

        const fileContent = JSON.parse(await UtilFile.parseXML(downloadedProcess));
        const bpmnProcessDetails = fileContent[`bpmn2:definitions`][`bpmn2:process`][`_attributes`];
        const uiProcessId = await new ProcessPropertiesCard().getProcessId();
        const expectedProcessId = `process-${process.entry.id}`;
        expect(uiProcessId).toEqual(expectedProcessId);
        expect(UtilFile.getJSONItemValueByKey(bpmnProcessDetails, `id`)).toEqual(expectedProcessId);
        expect(UtilFile.getJSONItemValueByKey(bpmnProcessDetails, `name`)).toEqual(process.entry.name);
        expect(UtilFile.getJSONItemValueByKey(bpmnProcessDetails, `isExecutable`)).toEqual(`true`);
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
