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

import {
    CodeEditorWidget,
    LoginPage,
    LoginPageImplementation,
    ProcessContentPage,
    UtilFile
} from 'ama-testing/e2e';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { testConfig } from '../../../test.config';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { Resources } from '../../../../../../e2e/resources/resources';
 import { StringUtil } from '@alfresco/adf-testing';

const path = require('path');

describe('Message Events', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);

    let backend: Backend;
    let loginPage: LoginPageImplementation;
    let processContentPage: ProcessContentPage;
    let project, processId, fileContent, fileContentJson;

    const projectDetails = {
        path: Resources.MESSAGE_EVENTS_PROJECTS.file_location,
        name: Resources.MESSAGE_EVENTS_PROJECTS.project_name
    };
    const codeEditorWidget = new CodeEditorWidget();
    const absoluteFilePath = path.resolve(testConfig.main.rootPath + projectDetails.path);

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.import(absoluteFilePath, (projectDetails.name + StringUtil.generateRandomString()));
        loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);

    });

    it('[C316246] Should implement interrupting boundary message event set in the process model', async () => {
        processId = await backend.project.getModelId(project.entry.id, 'PROCESS', 'int-boundary-event');
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, processId);
        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();
        fileContent = await codeEditorWidget.getCodeEditorValue(`process://xml:${processId}`);
        fileContentJson = JSON.parse(await UtilFile.parseXML(fileContent, false));
        const interruptingBoundaryMessage = fileContentJson.definitions.process.boundaryEvent.messageEventDefinition;
        const interruptingBoundaryMessageAttributes = UtilFile.getJSONItemValueByKey(interruptingBoundaryMessage, `_attributes`);
        await expect(await UtilFile.getJSONItemValueByKey(interruptingBoundaryMessageAttributes, `activiti:correlationKey`))
            .toEqual('${int-boundary-var}');
        await expect(await UtilFile.getJSONItemValueByKey(interruptingBoundaryMessageAttributes, `activiti:messageExpression`))
            .toEqual('interrupting-boundary-message-event');
    });

    it('[C316247] Should implement intermediate message event set in the process model', async () => {
        processId = await backend.project.getModelId(project.entry.id, 'PROCESS', 'intermediate-message-event');
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, processId);
        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();
        fileContent = await codeEditorWidget.getCodeEditorValue(`process://xml:${processId}`);
        fileContentJson = JSON.parse(await UtilFile.parseXML(fileContent, false));
        const intermediateMessage = fileContentJson.definitions.process.intermediateCatchEvent.messageEventDefinition;
        const intermediateMessageAttributes = UtilFile.getJSONItemValueByKey(intermediateMessage, `_attributes`);
        await expect(await UtilFile.getJSONItemValueByKey(intermediateMessageAttributes, `activiti:correlationKey`))
            .toEqual('${intermediate-var}');
        await expect(await UtilFile.getJSONItemValueByKey(intermediateMessageAttributes, `activiti:messageExpression`))
            .toEqual('intermediate catch message-${inter-message-var}');
    });

    it('[C316248] Should implement non-interrupting boundary message event set in the process model', async () => {
        processId = await backend.project.getModelId(project.entry.id, 'PROCESS', 'nonint-boundary-event');
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, processId);
        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();
        fileContent = await codeEditorWidget.getCodeEditorValue(`process://xml:${processId}`);
        fileContentJson = JSON.parse(await UtilFile.parseXML(fileContent, false));
        const noninterruptingBoundaryMessage = fileContentJson.definitions.process.boundaryEvent.messageEventDefinition;
        const noninterruptingBoundaryMessageAttributes = UtilFile.getJSONItemValueByKey(noninterruptingBoundaryMessage, `_attributes`);
        await expect(await UtilFile.getJSONItemValueByKey(noninterruptingBoundaryMessageAttributes, `activiti:correlationKey`))
            .toEqual('${nonint-boundary-var}');
        await expect(await UtilFile.getJSONItemValueByKey(noninterruptingBoundaryMessageAttributes, `activiti:messageExpression`))
            .toEqual('noninterrupting-boundary-message-${nonint-bound-var}');
    });

    it('[C316249] Should implement start message event set in the process model', async () => {
        processId = await backend.project.getModelId(project.entry.id, 'PROCESS', 'start-message-event');
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, processId);
        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();
        fileContent = await codeEditorWidget.getCodeEditorValue(`process://xml:${processId}`);
        fileContentJson = JSON.parse(await UtilFile.parseXML(fileContent, false));
        const startMessage = fileContentJson.definitions.process.startEvent.messageEventDefinition;
        const startMessageAttributes = UtilFile.getJSONItemValueByKey(startMessage, `_attributes`);
        await expect(await UtilFile.getJSONItemValueByKey(startMessageAttributes, `messageRef`)).toEqual('Message_0hq81h3');

    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
