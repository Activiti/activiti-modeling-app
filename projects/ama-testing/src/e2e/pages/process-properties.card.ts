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

import { element, by } from 'protractor';
import { GenericPage } from './common/generic.page';

export class ProcessPropertiesCard extends GenericPage {

    readonly editorProperties = element(by.css(`[data-automation-id="process-editor-properties"]`));
    readonly editName = element(by.css(`[data-automation-id="card-textitem-edit-icon-processName"]`));
    readonly editdDocumentation = element(by.css(`[data-automation-id="card-textitem-edit-icon-documentation"]`));
    readonly id = element(by.css(`[data-automation-id="card-textitem-value-id"]`));
    readonly name = element(by.css(`[data-automation-id="card-textitem-editinput-processName"]`));
    readonly documentation = element(by.css(`[data-automation-id="card-textitem-edittextarea-documentation"]`));
    readonly updateName = element(by.css(`[data-automation-id="card-textitem-update-processName"]`));
    readonly updateDocumentation = element(by.css(`[data-automation-id="card-textitem-update-documentation"]`));
    readonly editVariablesIcon = element(by.cssContainingText('[data-automation-id="edit-process-variables"] mat-icon', 'layers'));
    readonly editVariables = element(by.css(`[data-automation-id="edit-process-variables"]`));
    readonly connectorSelector = element(by.css(`[data-automation-id="connector-selector"]`));
    readonly connectorActionSelector = element(by.css(`[data-automation-id="connector-action-selector"]`));
    readonly formSelector = element(by.css(`[data-automation-id="form-selector"]`));
    readonly activitySelector = element(by.css(`.mat-select`));
    readonly inputMappingHeader = element(by.cssContainingText(`[data-automation-id="input-mapping-header"]`, `Input mapping:`));
    readonly outputMappingHeader = element(by.cssContainingText(`[data-automation-id="output-mapping-header"]`, `Output mapping:`));
    readonly mappingHeaderCellName = element(by.css(`[data-automation-id="table-header-cell-name"]`));
    readonly mappingHeaderCellProcessVariable = element(by.css(`[data-automation-id="table-header-cell-process-variables"]`));
    readonly noPropertiesMsg = element(by.css('.no-process-properties-msg'));
    readonly processVariableSelector = element(by.css(`[data-automation-id="process-variable-selector"]`));

    async isLoaded() {
        await super.waitForElementToBeVisible(this.editorProperties);
        return true;
    }

    async getProcessId() {
        return await this.id.getText();
    }

    async editProcessName(newName: string) {
        await super.click(this.editName);
        await super.clear(this.name);
        await super.sendKeysIfVisible(this.name, newName);
        await super.click(this.updateName);
    }

    async editProcessDocumentation(newDocumentation: string) {
        await super.click(this.editdDocumentation);
        await super.clear(this.documentation);
        await super.sendKeysIfVisible(this.documentation, newDocumentation);
        await super.click(this.updateDocumentation);
    }

    async editProcessVariables() {
        await super.click(this.editVariables);
    }

    async setConnector(connectorName: string) {
        await super.click(this.connectorSelector);
        const connectorOption = element(by.cssContainingText('.mat-option-text', connectorName));
        await super.click(connectorOption);
    }

    async setConnectorAction(actionName: string) {
        await super.click(this.connectorActionSelector);
        const connectorActionOption = element(by.cssContainingText('.mat-option-text', actionName));
        await super.click(connectorActionOption);
    }

    async setForm(formName: string) {
        await super.click(this.formSelector);
        const formOption = element(by.cssContainingText('.mat-option-text', formName));
        await super.click(formOption);
    }

    async setActivity(activityName: string) {
        await super.click(this.activitySelector);
        const activityOption = element(by.cssContainingText('.mat-option-text', activityName));
        await super.click(activityOption);
    }

    async setProcessVariable(connectorId: string, variableName: string) {
        const processVariableSelector = element(by.css(`[data-automation-id="variable-selector-${connectorId}"]`));
        await super.click(processVariableSelector);
        const processVariable = element(by.cssContainingText('.mat-option-text', variableName));
        await super.click(processVariable);
    }

    async isInputMappingHeaderDisplayed() {
        await super.waitForElementToBeVisible(this.inputMappingHeader);
        return true;
    }

    async isMappingTableHeaderDisplayed() {
        await super.waitForElementToBeVisible(this.mappingHeaderCellName);
        await super.waitForElementToBeVisible(this.mappingHeaderCellProcessVariable);
        return true;
    }

    async isOutputMappingHeaderDisplayed() {
        await super.waitForElementToBeVisible(this.outputMappingHeader);
        return true;
    }

    async isNoProcessPropertiesMsg() {
        await super.waitForElementToBeVisible(this.noPropertiesMsg);
        return true;
    }

    async getConnectorParam(connectorId: string) {
        const connectorParam = element(by.css(`[data-automation-id="param-id-${connectorId}"]>span`));
        await super.waitForElementToBeVisible(connectorParam);
        return await connectorParam.getText();
    }

    async isToggleEnabled(connectorId: string) {
        const toogleIcon = element(by.cssContainingText(`[data-automation-id="toggle-icon-${connectorId}"]`, `layers`));
        await super.waitForElementToBeVisible(toogleIcon);
        return true;
    }

    async isToggleDisabled(connectorId: string) {
        const toogleIcon = element(by.cssContainingText(`[data-automation-id="toggle-icon-${connectorId}"]`, `layers_clear`));
        await super.waitForElementToBeVisible(toogleIcon);
        return true;
    }

    async switchToggle(connectorId: string) {
        const toogleIcon = element(by.css(`[data-automation-id="toggle-icon-${connectorId}"]`));
        await super.click(toogleIcon);
    }

    async setValue(connectorId: string, value: string) {
        const valueInput = element(by.css(`[data-automation-id="value-input-${connectorId}"]`));
        await super.sendKeysIfVisible(valueInput, value);
    }

    async getValue(connectorId: string) {
        const valueInput = element(by.css(`[data-automation-id="value-input-${connectorId}"]`));
        await super.waitForElementToBeVisible(valueInput);
        return await valueInput.getAttribute('value');
    }

    async getProcessVariable(connectorId: string) {
        const variable = element(by.css(`[data-automation-id="variable-selector-${connectorId}"] span span`));
        await super.waitForElementToBeVisible(variable);
        return await variable.getText();
    }

    async isEditVariablesButtonIconDisplayed() {
        await super.waitForElementToBeVisible(this.editVariablesIcon);
        return true;
    }
}
