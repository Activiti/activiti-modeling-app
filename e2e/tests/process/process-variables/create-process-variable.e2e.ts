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

import { testConfig } from '../../../test.config';
import { LoginPage, LoginPageImplementation } from 'ama-testing/e2e';
import { NodeEntry } from 'alfresco-js-api-node';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { ProcessContentPage } from 'ama-testing/e2e';
import { ProcessPropertiesCard } from 'ama-testing/e2e';
import { ProcessVariablesDialog } from 'ama-testing/e2e';
import { CodeEditorWidget } from 'ama-testing/e2e';
import { UtilDate } from 'ama-testing/e2e';

describe('Create process variable', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    let backend: Backend;
    let loginPage: LoginPageImplementation;
    let project: NodeEntry;
    let process: NodeEntry;
    let processContentPage: ProcessContentPage;
    const processPropertiesCard = new ProcessPropertiesCard();
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const processVariablesDialog = new ProcessVariablesDialog();
    const codeEditorWidget = new CodeEditorWidget();

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.createAndWaitUntilAvailable();
    });

    beforeAll(async () => {
        loginPage = LoginPage.get(testConfig);
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
        await authenticatedPage.isLoggedIn();
    });

    beforeEach(async () => {
        process = await backend.process.create(project.entry.id);
    });

    beforeEach(async () => {
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processPropertiesCard.isLoaded();
    });

    it('1. [C299156] Verify icon from the button and the modal title', async () => {
        expect(await processPropertiesCard.isEditVariablesButtonIconDisplayed()).toBe(true, 'Icon is not displayed on the Edit Variables button.');
        await processPropertiesCard.editProcessVariables();
        expect(await processVariablesDialog.isTitleIconDisplayed()).toBe(true, 'Title icon is not displayed on the Edit Variables modal.');
    });

    describe('Add process variable', async () => {
        beforeEach(async () => {
            await processPropertiesCard.editProcessVariables();
            await processVariablesDialog.isLoaded();
            await processVariablesDialog.addVariable();
        });

        it('2. [C282018] Add process variable', async () => {
            expect(await processVariablesDialog.isVariableDisplayed(0)).toBe(true, 'Variable added is not displayed in the list.');

            const variableId = await processVariablesDialog.getVariableIdByRow(0);
            const expectedVariable = {};
            expectedVariable[variableId] = {
                'id': variableId,
                'name': 'name',
                'type': 'string',
                'required': false,
                'value': ''
            };
            await processVariablesDialog.goToCodeEditor();

            const editorValue = await codeEditorWidget.getCodeEditorValue(`process-variables://json:${process.entry.id}`);
            expect(JSON.parse(editorValue)).toEqual(expectedVariable, `Variables objects are not equal`);

            await processVariablesDialog.update();
            await processVariablesDialog.close();

            await processPropertiesCard.editProcessVariables();
            expect(await processVariablesDialog.isVariableDisplayed(0)).toBe(true, 'Variable added is not displayed in the list.');
        });

        it('3. [C307117] Add integer process variable with invalid value', async () => {
            await processVariablesDialog.setVariable('intVar', 'integer', `@$#&* {}[],=-().+;'/`);
            expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Invalid characters accepted for integer variable value.');
            expect(await processVariablesDialog.isVariableDisplayed(0, 'intVar', 'integer')).toBe(true, 'Variable added is not displayed in the list.');

            await processVariablesDialog.setVariableValue('Automation');
            expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Invalid characters accepted for integer variable value.');
            expect(await processVariablesDialog.isVariableDisplayed(0, 'intVar', 'integer')).toBe(true, 'Variable added is not displayed in the list.');

            /* cspell: disable-next-line */
            await processVariablesDialog.setVariableValue('1Auto2mation3');
            expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Invalid characters accepted for integer variable value.');
            expect(await processVariablesDialog.isVariableDisplayed(0, 'intVar', 'integer', '123')).toBe(true, 'Variable added is not displayed in the list.');

            const variableId = await processVariablesDialog.getVariableIdByRow(0);
            await processVariablesDialog.goToCodeEditor();

            const editorValue = await codeEditorWidget.getCodeEditorValue(`process-variables://json:${process.entry.id}`);
            expect(JSON.parse(editorValue)[variableId].value).toEqual(123, `Variable value is not set correctly.`);

            await processVariablesDialog.update();
            await processVariablesDialog.close();

            await processPropertiesCard.editProcessVariables();
            expect(await processVariablesDialog.isVariableDisplayed(0, 'intVar', 'integer', '123')).toBe(true, 'Variable added is not displayed in the list.');
        });

        it('4. [C307118] Add date process variable', async () => {
            const currentDate = UtilDate.getCurrentDate();
            await processVariablesDialog.setVariable('dateVar', 'date');
            expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Invalid characters accepted for integer variable value.');
            expect(await processVariablesDialog.isVariableDisplayed(0, 'dateVar', 'date', currentDate)).toBe(true, 'Variable added is not displayed in the list.');

            const variableId = await processVariablesDialog.getVariableIdByRow(0);
            await processVariablesDialog.goToCodeEditor();

            const editorValue = await codeEditorWidget.getCodeEditorValue(`process-variables://json:${process.entry.id}`);
            expect(JSON.parse(editorValue)[variableId].value).toEqual(currentDate, `Variable value is not set correctly.`);
            await processVariablesDialog.update();
            await processVariablesDialog.close();

            await processPropertiesCard.editProcessVariables();
            expect(await processVariablesDialog.isVariableDisplayed(0, 'dateVar', 'date', currentDate)).toBe(true, 'Variable added is not displayed in the list.');
        });

        it('5. [C307119] Switch process variable type', async () => {
            await processVariablesDialog.setVariableValue('Automation');
            await processVariablesDialog.setVariableType('integer');

            expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Variable value was not set to empty when switching the type.');
            expect(await processVariablesDialog.isVariableDisplayed(0, 'name', 'integer')).toBe(true, 'Variable added is not displayed in the list.');
        });
    });

    afterAll(async () => {
        if ( processVariablesDialog.isLoaded() ) {
            await processVariablesDialog.close();
        }
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });
});
