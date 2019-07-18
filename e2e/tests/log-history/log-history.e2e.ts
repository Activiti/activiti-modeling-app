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
import { ProjectContentPage } from 'ama-testing/e2e';
import { ProcessContentPage } from 'ama-testing/e2e';
import { LogHistoryPage } from 'ama-testing/e2e';
import { CodeEditorWidget } from 'ama-testing/e2e';

describe('Log history', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const errorLevel = {
        info: '[info]',
        warning: '[warning]',
        error: '[error]'
    };

    const initiator = 'Process Editor';

    const errorMessage = {
        successfully: 'The process was successfully updated',
    };

    const loginPage: LoginPageImplementation = LoginPage.get(testConfig);
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const logHistoryPage = new LogHistoryPage();
    const codeEditorWidget = new CodeEditorWidget();

    let backend: Backend;
    let project, process: NodeEntry;
    let projectContentPage: ProjectContentPage;
    let processContentPage: ProcessContentPage;

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
        projectContentPage = new ProjectContentPage(testConfig, project.entry.id);
        await projectContentPage.navigateTo();
    });

    beforeEach( async() => {
        process = await backend.process.create(project.entry.id);
    });

    it('1. [C311463] Info message', async () => {
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await logHistoryPage.clickMessageIndicatorInactive();
        await processContentPage.save();
        expect(await logHistoryPage.getInitiator()).toEqual(initiator);
        expect(await logHistoryPage.getLevel()).toEqual(errorLevel.info);
        expect(await logHistoryPage.getMessage()).toEqual(errorMessage.successfully);
    });

    it('2. [C311464] Error message', async () => {
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();
        await codeEditorWidget.updateCodeEditorContent('');
        await logHistoryPage.clickMessageIndicator();
        await processContentPage.save();
        expect(await logHistoryPage.getInitiator()).toEqual(initiator);
        expect(await logHistoryPage.getLevel()).toEqual(errorLevel.error);
        expect(await logHistoryPage.getMessage()).toEqual('Error: unparsable content detected line: 0 column: 0 nested error: missing start tag');
    });

    it('3. [C311465] Warning message', async () => {
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();
        const oldXml = await codeEditorWidget.getCodeEditorValue(`process://xml:${process.entry.id}`);
        const newXml = oldXml.replace('name', 'test');
        await codeEditorWidget.updateCodeEditorContent(newXml.replace('\n', ''));
        await logHistoryPage.clickMessageIndicator();
        expect(await logHistoryPage.getInitiator()).toEqual(initiator);
        expect(await logHistoryPage.getLevel()).toEqual(errorLevel.warning);
        expect(await logHistoryPage.getMessage()).toEqual('unknown attribute <test>');
    });

    it('4. [C311466] Clear logs', async () => {
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await logHistoryPage.clickMessageIndicatorInactive();
        await processContentPage.save();
        expect(await logHistoryPage.getInitiator()).toEqual(initiator);
        expect(await logHistoryPage.isLogHistoryNotEmpty()).toBe(true, 'Log history is empty');
        await logHistoryPage.deleteLogs();
        expect(await logHistoryPage.isLogHistoryEmpty()).toBe(true, 'Log history is not empty');
    });

    it('5. [C311471] Expand and collapse log history', async () => {
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await logHistoryPage.clickMessageIndicatorInactive();
        expect(await logHistoryPage.isLogSectionDisplayed()).toBe(true, 'Log section is not displayed');
        await logHistoryPage.clickMessageIndicator();
        expect(await logHistoryPage.isLogSectionNotDisplayed()).toBe(true, 'Log section is displayed');
        await logHistoryPage.clickMessageIndicatorInactive();
        expect(await logHistoryPage.isLogSectionDisplayed()).toBe(true, 'Log section is not displayed');
        await logHistoryPage.clickCollapseArrow();
        expect(await logHistoryPage.isLogSectionNotDisplayed()).toBe(true, 'Log section is displayed');
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
