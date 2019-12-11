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
import { LoginPage } from 'ama-testing/e2e';
import { NodeEntry } from '@alfresco/js-api';
import { Backend } from 'ama-testing/e2e';
import { getBackend } from 'ama-testing/e2e';
import { AuthenticatedPage } from 'ama-testing/e2e';
import { ProcessContentPage } from 'ama-testing/e2e';
import { ProcessPropertiesCard } from 'ama-testing/e2e';
import { ProcessVariablesDialog } from 'ama-testing/e2e';
import * as moment from 'moment';

describe('Create process variable', async () => {
    const adminUser = {
        user: testConfig.ama.user,
        password: testConfig.ama.password
    };

    let backend: Backend;
    let project: NodeEntry;
    let process: NodeEntry;
    let processContentPage: ProcessContentPage;
    const processPropertiesCard = new ProcessPropertiesCard();
    const authenticatedPage = new AuthenticatedPage(testConfig);
    const processVariablesDialog = new ProcessVariablesDialog();

    beforeAll(async () => {
        backend = await getBackend(testConfig).setUp();
        project = await backend.project.create();

        const loginPage = LoginPage.get();
        await loginPage.navigateTo();
        await loginPage.login(adminUser.user, adminUser.password);
    });

    afterAll(async () => {
        await backend.project.delete(project.entry.id);
        await backend.tearDown();
        await authenticatedPage.logout();
    });

    beforeEach(async () => {
        process = await backend.process.create(project.entry.id);
        processContentPage = new ProcessContentPage(testConfig, project.entry.id, process.entry.id);
        await processContentPage.navigateTo();
        await processPropertiesCard.isLoaded();
    });

    it('[C299156] Verify icon from the button and the modal title', async () => {
        await expect(await processPropertiesCard.isEditVariablesButtonIconDisplayed()).toBe(true, 'Icon is not displayed on the Edit Variables button.');
        await processPropertiesCard.editProcessVariables();
        await expect(await processVariablesDialog.isTitleIconDisplayed()).toBe(true, 'Title icon is not displayed on the Edit Variables modal.');
    });

    describe('Add process variable', async () => {
        beforeEach(async () => {
            await processPropertiesCard.editProcessVariables();
            await processVariablesDialog.isLoaded();
            await processVariablesDialog.addVariable();
            await processVariablesDialog.setVariableName('name');
        });

        it('[C282018] Add process variable', async () => {
            await expect(await processVariablesDialog.isVariableDisplayed(0)).toBe(true, 'Variable added is not displayed in the list.');

            const variableId = await processVariablesDialog.getVariableIdByRow(0);
            const expectedVariable = {};
            expectedVariable[variableId] = {
                'id': variableId,
                'name': 'name',
                'type': 'string',
                'required': false,
                'value': ''
            };

            await processVariablesDialog.update();

            await processPropertiesCard.editProcessVariables();
            await expect(await processVariablesDialog.isVariableDisplayed(0)).toBe(true, 'Variable added is not displayed in the list.');
        });

        it('[C307117] Add integer process variable with invalid value', async () => {
            await processVariablesDialog.setVariable('intVar', 'integer', `@$#&* {}[],=-().+;'/`);
            await expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Invalid characters accepted for integer variable value.');
            await expect(await processVariablesDialog.isVariableDisplayed(0, 'intVar', 'integer')).toBe(true, 'Variable added is not displayed in the list.');

            await processVariablesDialog.setVariableValue('Automation');
            await expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Invalid characters accepted for integer variable value.');
            await expect(await processVariablesDialog.isVariableDisplayed(0, 'intVar', 'integer')).toBe(true, 'Variable added is not displayed in the list.');

            /* cspell: disable-next-line */
            await processVariablesDialog.setVariableValue('1Auto2mation3');
            await expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Invalid characters accepted for integer variable value.');
            await expect(await processVariablesDialog.isVariableDisplayed(0, 'intVar', 'integer', '123')).toBe(true, 'Variable added is not displayed in the list.');

            await processVariablesDialog.update();

            await processPropertiesCard.editProcessVariables();
            await expect(await processVariablesDialog.isVariableDisplayed(0, 'intVar', 'integer', '123')).toBe(true, 'Variable added is not displayed in the list.');
        });

        it('[C307118] Add date process variable', async () => {
            const currentDate = moment().format('YYYY-MM-DD');
            await processVariablesDialog.setVariable('dateVar', 'date');
            await expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Invalid characters accepted for integer variable value.');
            await expect(await processVariablesDialog.isVariableDisplayed(0, 'dateVar', 'date', currentDate)).toBe(true, 'Variable added is not displayed in the list.');

            await processVariablesDialog.update();

            await processPropertiesCard.editProcessVariables();
            await expect(await processVariablesDialog.isVariableDisplayed(0, 'dateVar', 'date', currentDate)).toBe(true, 'Variable added is not displayed in the list.');
        });

        it('[C321541] Should be able to use the DateTime functionality in process variables', async () => {
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            await processVariablesDialog.setVariable('dateTimeVariable', 'datetime');
            await processVariablesDialog.update();
            await processPropertiesCard.editProcessVariables();
            await expect(await processVariablesDialog.isVariableDisplayed(0, 'dateTimeVariable', 'datetime', currentDate)).toBe(true);
        });

        it('[C307119] Switch process variable type', async () => {
            await processVariablesDialog.setVariableValue('Automation');
            await processVariablesDialog.setVariableType('integer');

            await expect(await processVariablesDialog.getVariableValue()).toEqual('', 'Variable value was not set to empty when switching the type.');
            await expect(await processVariablesDialog.isVariableDisplayed(0, 'name', 'integer')).toBe(true, 'Variable added is not displayed in the list.');
        });

        it('[C319687] Process variable name validation', async () => {
            await processVariablesDialog.setVariable('1a_', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('_a1', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);

            await expect(await processVariablesDialog.isInvalidErrorInfoIconDisplayed()).toBe(true);

            await processVariablesDialog.setVariable('a1_', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorNotDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('a_1', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorNotDisplayed('Variable name is not valid.')).toBe(true);

            await processVariablesDialog.setVariable('A1_', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorNotDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('A_1', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorNotDisplayed('Variable name is not valid.')).toBe(true);

            await processVariablesDialog.setVariable('aAa', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorNotDisplayed('Variable name is not valid.')).toBe(true);

            await processVariablesDialog.setVariable('a!', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('a@', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('a#', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('a$', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('a%', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('a^', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('a&', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
            await processVariablesDialog.setVariable('a*', 'string', 'testStringVariable' );
            await expect(await processVariablesDialog.waitValidationErrorDisplayed('Variable name is not valid.')).toBe(true);
        });
    });
});
