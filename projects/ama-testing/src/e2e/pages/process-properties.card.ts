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
    readonly editModelNameField = element(by.css(`[data-automation-id="card-textitem-edit-icon-modelName"]`));
    readonly editName = element(by.css(`[data-automation-id="card-textitem-edit-icon-processName"]`));
    readonly editDocumentation = element(by.css(`[data-automation-id="card-textitem-edit-icon-documentation"]`));
    readonly id = element(by.css(`[data-automation-id="card-textitem-value-id"]`));
    readonly processId = element(by.css(`[data-automation-id="card-textitem-value-processId"]`));
    readonly nameValue = element(by.css(`[data-automation-id="card-textitem-value-processName"]`));
    /* cspell: disable-next-line */
    readonly name = element(by.css(`[data-automation-id="card-textitem-editinput-processName"]`));
    readonly modelName = element(by.css(`[data-automation-id="card-textitem-editinput-modelName"]`));
    /* cspell: disable-next-line */
    readonly documentation = element(by.css(`[data-automation-id="card-textitem-edittextarea-documentation"]`));
    readonly updateName = element(by.css(`[data-automation-id="card-textitem-update-processName"]`));
    readonly updateModelName = element(by.css(`[data-automation-id="card-textitem-update-modelName"]`));
    readonly updateDocumentation = element(by.css(`[data-automation-id="card-textitem-update-documentation"]`));
    readonly editVariablesIcon = element(by.cssContainingText('[data-automation-id="edit-process-variables"] mat-icon', 'layers'));
    readonly editVariables = element(by.css(`[data-automation-id="edit-process-variables"]`));
    readonly connectorSelector = element(by.css(`[data-automation-id="connector-selector"]`));
    readonly connectorActionSelector = element(by.css(`[data-automation-id="connector-feature-selector"]`));
    readonly formSelector = element(by.css(`[data-automation-id="form-selector"]`));
    readonly activitySelector = element(by.css(`.called-element-block .mat-select`));
    readonly decisionTableSelector = element(by.css(`[data-automation-id="decision-table-selector"]`));
    readonly inputMappingHeader = element(by.cssContainingText(`[data-automation-id="input-mapping-header"]`, `Input mapping:`));
    readonly outputMappingHeader = element(by.cssContainingText(`[data-automation-id="output-mapping-header"]`, `Output mapping:`));
    readonly mappingHeaderCellName = element(by.css(`[data-automation-id="table-header-cell-name"]`));
    readonly mappingHeaderCellProcessVariable = element(by.css(`[data-automation-id="table-header-cell-process-variables"]`));
    readonly processVariableSelector = element(by.css(`[data-automation-id="process-variable-selector"]`));
    readonly newErrorButton = element(by.css(`[data-automation-id="new-error-button"]`));
    readonly newSignalButton = element(by.css(`[data-automation-id="new-signal-button"]`));
    readonly processNameError = element(by.css(`[data-automation-id="card-textitem-error-processName"]>ul>li`));
    readonly scopeSelector = element(by.css(`[data-automation-class="select-box"]`));
    readonly scriptSelector = element(by.css(`[data-automation-id="script-selector"]`));

    async isLoaded() {
        await BrowserVisibility.waitUntilElementIsVisible(this.editorProperties);
        return true;
    }

    async getProcessId() {
        return this.processId.getText();
    }

    async getElementId() {
        return this.id.getText();
    }

    async changeElementScope(scope: string) {
        await BrowserActions.click(this.scopeSelector);
        const scopeName = element(by.cssContainingText('.mat-option-text', scope));
        await BrowserActions.click(scopeName);
    }

    async editProcessName(newName: string) {
        await BrowserActions.click(this.editName);
        await BrowserActions.clearSendKeys(this.name, newName);
        await BrowserActions.click(this.updateName);
    }

    async editModelName(newName: string) {
        await BrowserActions.click(this.editModelNameField);
        await BrowserActions.clearSendKeys(this.modelName, newName);
        await BrowserActions.click(this.updateModelName);
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
        await BrowserActions.click(this.editVariables);
    }

    async createNewError() {
        await BrowserActions.click(this.newErrorButton);
    }

    async createNewSignal() {
        await BrowserActions.click(this.newSignalButton);
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

    async setScript(scriptName: string) {
        const scriptOption = element(by.cssContainingText('.mat-option-text', scriptName));
        await BrowserActions.click(this.scriptSelector);
        // Workaround:
        // Click on script selectbox until the list of decision tables is populated.
        let i = 0;
        try {
            while (await BrowserVisibility.waitUntilElementIsNotVisible(scriptOption, 500) && i < 10) {
                Logger.info('Click ', ++i, ' on script selectbox.');
                await BrowserActions.click(this.scriptSelector);
            }
        } catch (error) {
            Logger.info('Script list is loaded. Item can be selected.');
            await BrowserActions.click(scriptOption);
        }
    }

    async setForm(formName: string) {
        const formOption = element(by.cssContainingText('.mat-option-text', formName));
        let i = 0;
        try {
            do {
                Logger.info('Click ', ++i, ' on form selectbox.');
                await BrowserActions.click(this.formSelector);
            } while (await BrowserVisibility.waitUntilElementIsNotVisible(formOption, 500) && i < 10);
        } catch (error) {
            Logger.info('Form list is loaded. Item can be selected.');
            await BrowserActions.click(formOption);
        }
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
        const processVariable = element.all(by.cssContainingText('.mat-option-text', variableName)).first();

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

    async openMappingDialogForParameter(parameterId: string) {
        const editButton = element(by.css(`[data-automation-id="edit-value-mapping-${parameterId}"]`));
        await BrowserActions.click(editButton);
        const mappingDialog = element(by.css(`[data-automation-id="mapping-dialog"]`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingDialog);
    }

    async selectParameterTab() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const expressionTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(3)`));
        await BrowserActions.click(expressionTab);
    }

    async selectValueMappingTab() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const valueTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(2)`));
        await BrowserActions.click(valueTab);
        const valueInput = element(by.css(`.mapping-value amasdk-value-type-input input`));
        await BrowserVisibility.waitUntilElementIsVisible(valueInput);
    }

    async selectExpressionMappingTab() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const expressionTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(1)`));
        await BrowserActions.click(expressionTab);
    }

    async setValueMapping(value: string) {
        const valueInput = element(by.css(`.mapping-value amasdk-value-type-input input`));
        await BrowserActions.clearSendKeys(valueInput, value);
    }

    async updateAndCloseMappingDialog() {
        const updateButton = element(by.css(`[data-automation-id="mapping-update-button"]`));
        await BrowserActions.click(updateButton);
    }

    async getValue(connectorId: string) {
        const valueInput = element(by.css(`[data-automation-id="value-input-${connectorId}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(valueInput);
        return valueInput.getText();
    }

    async isValueInputVisible(connectorId: string) {
        const valueInput = element(by.css(`[data-automation-id="value-input-${connectorId}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(valueInput);
        return true;
    }

    async isVariableSelectorVisible(connectorId: string) {
        const valueInput = element.all(by.css(`[data-automation-id="variable-selector-${connectorId}"]`)).first();
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
