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
    ProcessContentPage,
    xml2js,
    Backend,
    getBackend,
    AuthenticatedPage } from 'ama-testing/e2e';
import { testConfig } from '../../../test.config';
import { Resources } from '../../../../../../e2e/resources/resources';
import { StringUtil } from '@alfresco/adf-testing';
import { NodeEntry } from '@alfresco/js-api';

const path = require('path');

describe('Message Events', () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    const authenticatedPage = new AuthenticatedPage(testConfig);

    let backend: Backend;
    let processContentPage: ProcessContentPage;
    let project: NodeEntry;

    const projectDetails = {
        path: Resources.MESSAGE_EVENTS_PROJECTS.file_location,
        name: Resources.MESSAGE_EVENTS_PROJECTS.project_name
    };
    const codeEditorWidget = new CodeEditorWidget();
    const absoluteFilePath = path.resolve(testConfig.main.rootPath + projectDetails.path);

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.import(absoluteFilePath, `${projectDetails.name}-${StringUtil.generateRandomString(5)}`);

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    it('[C316246] Should implement interrupting boundary message event set in the process model', async () => {
        const processId = await backend.project.getModelId(project.entry.id, 'PROCESS', 'int-boundary-event');
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, processId);

        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();

        const fileContent = await codeEditorWidget.getCodeEditorValue(`process://xml:${processId}`);
        const fileContentJson = xml2js(fileContent);
        const message = fileContentJson['bpmn2:definitions']['bpmn2:process']['bpmn2:boundaryEvent']['messageEventDefinition'];

        await expect(message._attributes[`activiti:correlationKey`]).toEqual('${int-boundary-var}');
        await expect(message._attributes[`activiti:messageExpression`]).toEqual('interrupting-boundary-message-event');
    });

    it('[C316247] Should implement intermediate message event set in the process model', async () => {
        const processId = await backend.project.getModelId(project.entry.id, 'PROCESS', 'intermediate-message-event');
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, processId);

        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();

        const fileContent = await codeEditorWidget.getCodeEditorValue(`process://xml:${processId}`);
        const fileContentJson = xml2js(fileContent);
        const message = fileContentJson['bpmn2:definitions']['bpmn2:process']['bpmn2:intermediateCatchEvent']['messageEventDefinition'];

        await expect(message._attributes[`activiti:correlationKey`]).toEqual('${intermediate-var}');
        await expect(message._attributes[`activiti:messageExpression`]).toEqual('intermediate catch message-${inter-message-var}');
    });

    it('[C316248] Should implement non-interrupting boundary message event set in the process model', async () => {
        const processId = await backend.project.getModelId(project.entry.id, 'PROCESS', 'nonint-boundary-event');
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, processId);

        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();

        const fileContent = await codeEditorWidget.getCodeEditorValue(`process://xml:${processId}`);
        const fileContentJson = xml2js(fileContent);
        const message = fileContentJson['bpmn2:definitions']['bpmn2:process']['bpmn2:boundaryEvent']['messageEventDefinition'];

        await expect(message._attributes[`activiti:correlationKey`]).toEqual('${nonint-boundary-var}');
        await expect(message._attributes[`activiti:messageExpression`]).toEqual('noninterrupting-boundary-message-${nonint-bound-var}');
    });

    it('[C316249] Should implement start message event set in the process model', async () => {
        const processId = await backend.project.getModelId(project.entry.id, 'PROCESS', 'start-message-event');
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, processId);

        await processContentPage.navigateTo();
        await processContentPage.selectCodeEditor();
        await codeEditorWidget.isTextEditorPresent();

        const fileContent = await codeEditorWidget.getCodeEditorValue(`process://xml:${processId}`);
        const fileContentJson = xml2js(fileContent);
        const message = fileContentJson['bpmn2:definitions']['bpmn2:process']['bpmn2:startEvent']['messageEventDefinition'];

        await expect(message._attributes.messageRef).toEqual('Message_0hq81h3');
    });
});
