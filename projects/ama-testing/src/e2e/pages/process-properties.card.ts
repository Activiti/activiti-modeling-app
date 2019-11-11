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

import { element, by, browser } from 'protractor';
import { GenericPage } from './common/generic.page';
import { Logger } from '../util';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ProcessPropertiesCard extends GenericPage {

    readonly editorProperties = element(by.css(`[data-automation-id="process-editor-properties"]`));
    readonly editName = element(by.css(`[data-automation-id="card-textitem-edit-icon-processName"]`));
    readonly editDocumentation = element(by.css(`[data-automation-id="card-textitem-edit-icon-documentation"]`));
    readonly id = element(by.css(`[data-automation-id="card-textitem-value-id"]`));
    readonly nameValue = element(by.css(`[data-automation-id="card-textitem-value-processName"]`));
    /* cspell: disable-next-line */
    readonly name = element(by.css(`[data-automation-id="card-textitem-editinput-processName"]`));
    /* cspell: disable-next-line */
    readonly documentation = element(by.css(`[data-automation-id="card-textitem-edittextarea-documentation"]`));
    readonly updateName = element(by.css(`[data-automation-id="card-textitem-update-processName"]`));
    readonly updateDocumentation = element(by.css(`[data-automation-id="card-textitem-update-documentation"]`));
    readonly editVariablesIcon = element(by.cssContainingText('[data-automation-id="edit-process-variables"] mat-icon', 'layers'));
    readonly editVariables = element(by.css(`[data-automation-id="edit-process-variables"]`));
    readonly connectorSelector = element(by.css(`[data-automation-id="connector-selector"]`));
    readonly connectorActionSelector = element(by.css(`[data-automation-id="connector-action-selector"]`));
    readonly formSelector = element(by.css(`[data-automation-id="form-selector"]`));
    readonly activitySelector = element(by.css(`.called-element-block .mat-select`));
    readonly decisionTableSelector = element(by.css(`[data-automation-id="decision-table-selector"]`));
    readonly inputMappingHeader = element(by.cssContainingText(`[data-automation-id="input-mapping-header"]`, `Input mapping:`));
    readonly outputMappingHeader = element(by.cssContainingText(`[data-automation-id="output-mapping-header"]`, `Output mapping:`));
    readonly mappingHeaderCellName = element(by.css(`[data-automation-id="table-header-cell-name"]`));
    readonly mappingHeaderCellProcessVariable = element(by.css(`[data-automation-id="table-header-cell-process-variables"]`));
    readonly processVariableSelector = element(by.css(`[data-automation-id="process-variable-selector"]`));
    readonly newErrorButton = element(by.css(`[data-automation-id="new-error-button"]`));
    readonly processNameError = element(by.css(`[data-automation-id="card-textitem-error-processName"]>ul>li`));

    async isLoaded() {
        await BrowserVisibility.waitUntilElementIsVisible(this.editorProperties);
        return true;
    }

    async getProcessId() {
        return this.id.getText();
    }

    async editProcessName(newName: string) {
        await BrowserActions.click(this.editName);
        await BrowserActions.clearSendKeys(this.name, newName);
        await BrowserActions.click(this.updateName);
    }

    async getProcessName() {
        return this.nameValue.getText();
    }

    async editProcessDocumentation(newDocumentation: string) {
        await BrowserActions.click(this.editDocumentation);
        await BrowserActions.clearSendKeys(this.documentation, newDocumentation);
        await BrowserActions.click(this.updateDocumentation);
    }

    async editProcessVariables() {
        await BrowserVisibility.waitUntilElementIsClickable(this.editVariables);
        await BrowserActions.click(this.editVariables);
    }

    async createNewError() {
        await BrowserActions.click(this.newErrorButton);
    }

    async setConnector(connectorName: string) {
        await BrowserActions.click(this.connectorSelector);
        const connectorOption = element(by.cssContainingText('.mat-option-text', connectorName));
        await BrowserActions.click(connectorOption);
    }

    async setConnectorAction(actionName: string) {
        await BrowserActions.click(this.connectorActionSelector);
        const connectorActionOption = element(by.cssContainingText('.mat-option-text', actionName));
        await BrowserActions.click(connectorActionOption);
    }

    async scrollToBottom() {
        const cardViewScrollBottomScript = 'document.getElementsByClassName("process-properties-card mat-card")[0].scrollIntoView()';
        await browser.executeScript(cardViewScrollBottomScript);
    }

    async setDecisionTable(dtName: string) {
        const dtOption = element(by.cssContainingText('.mat-option-text', dtName));
        await BrowserActions.click(this.decisionTableSelector);
        // Workaround:
        // Click on DT selectbox until the list of decision tables is populated.
        let i = 0;
        try {
            while (await BrowserVisibility.waitUntilElementIsNotVisible(dtOption, 500) && i < 10) {
                Logger.info('Click ', ++i, ' on DT selectbox.');
                await BrowserActions.click(this.decisionTableSelector);
            }
        } catch (error) {
            Logger.info('Decision table list is loaded. Item can be selected.');
            await BrowserActions.click(dtOption);
        }
    }

    async setForm(formName: string) {
        await browser.actions().mouseMove(this.formSelector).perform();
        await BrowserActions.click(this.formSelector);
        const formOption = element(by.cssContainingText('.mat-option-text', formName));
        await browser.actions().mouseMove(formOption).perform();
        await BrowserActions.click(formOption);
    }

    async setActivity(activityName: string) {
        await BrowserActions.click(this.activitySelector);
        const activityOption = element(by.cssContainingText('.mat-option-text', activityName));
        await BrowserActions.click(activityOption);
    }

    async openProcessVariablesList(connectorId: string, table?: string) {
        let selector: string;
        if (table) {
            selector = `[data-automation-id="${table}-mapping-table"] [data-automation-id="variable-selector-${connectorId}"]`;
        } else {
            selector = `[data-automation-id="variable-selector-${connectorId}"]`;
        }

        await BrowserActions.click(element(by.css(selector)));
    }

    async selectVariable(variableName: string) {
        const processVariable = element(by.cssContainingText('.mat-option-text', variableName));

        await BrowserVisibility.waitUntilElementIsVisible(processVariable);
        await BrowserActions.click(processVariable);
    }

    async setProcessVariable(connectorId: string, variableName: string, table?: string) {
        await this.openProcessVariablesList(connectorId, table);
        await this.selectVariable(variableName);
    }

    async getProcessVariablesList(connectorId: string) {
        await this.openProcessVariablesList(connectorId);
        return element.all((by.css('.mat-option-text'))).getText();
    }

    async isInputMappingHeaderDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.inputMappingHeader);
        return true;
    }

    async isMappingTableHeaderDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.mappingHeaderCellName);
        await BrowserVisibility.waitUntilElementIsVisible(this.mappingHeaderCellProcessVariable);
        return true;
    }

    async isOutputMappingHeaderDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.outputMappingHeader);
        return true;
    }

    async isNoProcessPropertiesMsg(connectorId: string) {
        const noPropertiesMsg = element(by.css(`[data-automation-id="param-id-${connectorId}"]+mat-cell>.no-process-properties-msg`));
        await BrowserVisibility.waitUntilElementIsVisible(noPropertiesMsg);
        return true;
    }

    async getConnectorParam(connectorId: string) {
        const connectorParam = element(by.css(`[data-automation-id="param-id-${connectorId}"]>span`));
        await BrowserVisibility.waitUntilElementIsVisible(connectorParam);
        return connectorParam.getText();
    }

    async isToggleEnabled(connectorId: string) {
        const toggleIcon = element(by.cssContainingText(`[data-automation-id="toggle-icon-${connectorId}"]`, `layers`));
        await BrowserVisibility.waitUntilElementIsVisible(toggleIcon);
        return true;
    }

    async isToggleDisabled(connectorId: string) {
        const toggleIcon = element(by.cssContainingText(`[data-automation-id="toggle-icon-${connectorId}"]`, `layers_clear`));
        await BrowserVisibility.waitUntilElementIsVisible(toggleIcon);
        return true;
    }

    async switchToggle(connectorId: string) {
        const toggleIcon = element(by.css(`[data-automation-id="toggle-icon-${connectorId}"]`));
        await BrowserActions.click(toggleIcon);
    }

    async setValue(connectorId: string, value: string) {
        const valueInput = element(by.css(`[data-automation-id="value-input-${connectorId}"]`));
        await BrowserActions.clearSendKeys(valueInput, value);
    }

    async getValue(connectorId: string) {
        const valueInput = element(by.css(`[data-automation-id="value-input-${connectorId}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(valueInput);
        return valueInput.getAttribute('value');
    }

    async isValueInputVisible(connectorId: string) {
        const valueInput = element(by.css(`[data-automation-id="value-input-${connectorId}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(valueInput);
        return true;
    }

    async isVariableSelectorVisible(connectorId: string) {
        const valueInput = element(by.css(`[data-automation-id="variable-selector-${connectorId}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(valueInput);
        return true;
    }

    async getProcessVariable(connectorId: string) {
        const variable = element(by.css(`[data-automation-id="variable-selector-${connectorId}"] span span`));
        await BrowserVisibility.waitUntilElementIsVisible(variable);
        return variable.getText();
    }

    async isEditVariablesButtonIconDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.editVariablesIcon);
        return true;
    }

    async getErrorMessage() {
        await BrowserVisibility.waitUntilElementIsVisible(this.processNameError);
        return this.processNameError.getText();
    }
}
