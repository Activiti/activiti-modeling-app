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
import { NodeEntry } from '@alfresco/js-api';
import { browser } from 'protractor';
import {
    LoginPage, xml2js,
    Backend,
    getBackend,
    UtilFile,
    AuthenticatedPage,
    ProjectContentPage,
    ProcessContentPage,
    ProcessPropertiesCard } from 'ama-testing/e2e';

const path = require('path');

describe('Export process', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);

    let backend: Backend;
    let project: NodeEntry;
    let process: NodeEntry;
    let projectContentPage: ProjectContentPage;
    let processContentPage: ProcessContentPage;

    const downloadDir = browser.params.downloadDir;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.create();

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);

        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        await projectContentPage.navigateTo();
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    beforeEach( async() => {
        process = await backend.process.create(project.entry.id);
    });

    it('[C286624] Export process', async () => {
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processContentPage.downloadProcess();

        const downloadedProcess = path.join(downloadDir, `${process.entry.name}.bpmn20.xml`);
        await expect(await UtilFile.fileExists(downloadedProcess)).toBe(true);

        const fileContent = xml2js(await UtilFile.readFile(downloadedProcess));
        const bpmnModelDetails = fileContent[`bpmn2:definitions`];
        const expectedModelId = `model-${process.entry.id}`;
        await expect(bpmnModelDetails._attributes[`id`]).toEqual(expectedModelId);
        await expect(bpmnModelDetails._attributes[`name`]).toEqual(process.entry.name);

        const bpmnProcessDetails = fileContent[`bpmn2:definitions`][`bpmn2:process`];
        const uiProcessId = await new ProcessPropertiesCard().getProcessId();

        await expect(bpmnProcessDetails._attributes[`id`]).toEqual(uiProcessId);
        await expect(bpmnProcessDetails._attributes[`name`]).toEqual(process.entry.name);
        await expect(bpmnProcessDetails._attributes[`isExecutable`]).toEqual(`true`);
    });
});
