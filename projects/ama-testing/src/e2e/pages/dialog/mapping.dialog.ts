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

import { element, by, browser, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { GenericDialog } from '../common';
import { Logger } from '../../util';

export class MappingDialog extends GenericDialog {
    async openInputMappingDialogForParameter(parameterId: string) {
        const editButton = element(by.css(`[data-automation-id="edit-value-mapping-${parameterId}"]`));
        await BrowserActions.click(editButton);
        const mappingDialog = element(by.css(`[data-automation-id="mapping-dialog"]`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingDialog);
    }

    async openOutputMappingDialogForParameter(index: number) {
        const editButton = element(by.css(`[data-automation-id="edit-output-mapping-${index}"]`));
        await BrowserActions.click(editButton);
        const mappingDialog = element(by.css(`[data-automation-id="mapping-dialog"]`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingDialog);
    }

    async isMappingRowSelected(row: number) {
        const selectedRow = element(by.css(`[data-automation-id="mapping-row-${row}"].active`));
        await BrowserVisibility.waitUntilElementIsVisible(selectedRow);
        return true;
    }

    async getNameCellText(row: number) {
        const valueCell = element(by.css(`[data-automation-id="variable-name-cell-${row}"]`));
        return valueCell.getText();
    }

    async getValueCellText(row: number) {
        const valueCell = element(by.css(`[data-automation-id="variable-value-cell-${row}"]`));
        return valueCell.getText();
    }

    async openInputParameterDestinationList() {
        await BrowserActions.click(element(by.css(`[data-automation-id="input-parameter-destination-select"]`)));
    }

    async getInputParameterDestination() {
        const variable = element(by.css(`[data-automation-id="input-parameter-destination-select"] span span`));
        await BrowserVisibility.waitUntilElementIsVisible(variable);
        return variable.getText();
    }

    async openProcessVariableDestinationList() {
        await BrowserActions.click(element(by.css(`[data-automation-id="process-variable-destination-select"]`)));
    }

    async selectProcessVariableDestination(variableName: string) {
        const processVariable = element.all(by.cssContainingText('.mat-option-text', variableName)).first();
        await BrowserActions.click(processVariable);
    }

    async setProcessVariableDestination(variableName: string) {
        await this.openProcessVariableDestinationList();
        await this.selectVariable(variableName);
    }

    async getProcessVariableDestination() {
        const variable = element(by.css(`[data-automation-id="process-variable-destination-select"] span span`));
        await BrowserVisibility.waitUntilElementIsVisible(variable);
        return variable.getText();
    }

    async getProcessVariablesDestinationList() {
        await this.openProcessVariableDestinationList();
        return element.all((by.css('.mat-option-text'))).getText();
    }

    async isProcessVariableDestinationListEmpty() {
        const variable = element(by.css(`[data-automation-id="process-variable-destination-select"] span`));
        await BrowserVisibility.waitUntilElementIsVisible(variable);
        return variable.getText().then(text => text === ' ');
    }

    async selectParameterTab() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const expressionTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(3)`));
        await BrowserActions.click(expressionTab);
    }

    async openMappingProcessVariableList() {
        await BrowserActions.click(element(by.css(`[data-automation-id="process-variable-select"]`)));
    }

    async openMappingOutputParameterList() {
        await BrowserActions.click(element(by.css(`[data-automation-id="output-parameter-select"]`)));
    }

    async selectMappingProcessVariable(variableName: string) {
        const processVariable = element.all(by.cssContainingText('.mat-option-text', variableName)).first();
        await BrowserActions.click(processVariable);
    }

    async setMappingProcessVariable(variableName: string) {
        await this.openMappingProcessVariableList();
        await this.selectVariable(variableName);
    }

    async isMappingProcessVariableEmpty() {
        const variable = element(by.css(`[data-automation-id="process-variable-select"] span`));
        await BrowserVisibility.waitUntilElementIsVisible(variable);
        return variable.getText().then(text => text === ' ');
    }

    async isOutputParameterListEmpty() {
        const variable = element(by.css(`[data-automation-id="output-parameter-select"] span`));
        await BrowserVisibility.waitUntilElementIsVisible(variable);
        return variable.getText().then(text => text === ' ');
    }

    async setOutputParameterList(variableName: string) {
        await this.openMappingOutputParameterList();
        await this.selectVariable(variableName);
    }

    async getMappingProcessVariable() {
        const variable = element(by.css(`[data-automation-id="process-variable-select"] span span`));
        await BrowserVisibility.waitUntilElementIsVisible(variable);
        return variable.getText();
    }

    async getOutputParameterListValue() {
        const variable = element(by.css(`[data-automation-id="output-parameter-select"] span span`));
        await BrowserVisibility.waitUntilElementIsVisible(variable);
        return variable.getText();
    }

    async getMappingProcessVariablesList() {
        await this.openMappingProcessVariableList();
        return element.all((by.css('.mat-option-text'))).getText();
    }

    async isParameterTabSelected() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const expressionTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(3).mat-tab-label-active`));
        await BrowserVisibility.waitUntilElementIsVisible(expressionTab);
        return true;
    }

    async isParameterTabDisabled() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const expressionTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(3).mat-tab-disabled`));
        await BrowserVisibility.waitUntilElementIsVisible(expressionTab);
        return true;
    }

    async isParameterTabEnabled() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const expressionTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(3).mat-tab-disabled`));
        await BrowserVisibility.waitUntilElementIsNotPresent(expressionTab);
        return true;
    }

    async selectValueMappingTab() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const valueTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(2)`));
        await BrowserActions.click(valueTab);
        const valueInput = element(by.css(`.mapping-value amasdk-value-type-input input`));
        await BrowserVisibility.waitUntilElementIsVisible(valueInput);
    }

    async isValueTabSelected() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const valueTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(2).mat-tab-label-active`));
        await BrowserVisibility.waitUntilElementIsVisible(valueTab);
        return true;
    }

    async isValueTabDisabled() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const valueTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(2).mat-tab-disabled`));
        await BrowserVisibility.waitUntilElementIsVisible(valueTab);
        return true;
    }

    async isValueTabEnabled() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const valueTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(2).mat-tab-disabled`));
        await BrowserVisibility.waitUntilElementIsNotPresent(valueTab);
        return true;
    }

    async setValueMapping(value: string) {
        const valueInput = element(by.css(`.mapping-value amasdk-value-type-input input`));
        await BrowserActions.clearSendKeys(valueInput, value);
    }

    async clearValueMapping() {
        const valueInput = element(by.css(`.mapping-value amasdk-value-type-input input`));
        await  BrowserVisibility.waitUntilElementIsVisible(valueInput);
        await BrowserActions.clearWithBackSpace(valueInput);
    }

    async getValueMapping() {
        const valueInput = element(by.css(`.mapping-value amasdk-value-type-input input`));
        return valueInput.getAttribute('value');
    }

    async selectExpressionMappingTab() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const expressionTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(1)`));
        await BrowserActions.click(expressionTab);
        const editorComponent = element(by.css(`.mapping-value amasdk-code-editor`));
        await BrowserVisibility.waitUntilElementIsVisible(editorComponent);
    }

    async setExpressionMapping(expression: string) {
        const codeEditor = element(by.css(`.mapping-dialog-expression-editor.monaco-editor textarea`));
        await BrowserVisibility.waitUntilElementIsVisible(codeEditor);
        try {
            await browser.sleep(200);
            await browser.executeScript(`this.monaco.editor.getModels()[this.monaco.editor.getModels().length-1].setValue('');`);
            await browser.sleep(200);
            await browser.executeScript('this.monaco.editor.getModels()[this.monaco.editor.getModels().length-1].setValue("' + expression + '");');
            await codeEditor.sendKeys(protractor.Key.HOME);
        } catch (e) {
            Logger.error(`Updating editor content with '${expression}' failed with thrown error: ${e.message}`);
            throw e;
        }
    }

    async isExpressionTabSelected() {
        const mappingValueBlock = element(by.css(`.mapping-value`));
        await BrowserVisibility.waitUntilElementIsVisible(mappingValueBlock);
        const expressionTab = element(by.css(`.mapping-value .mat-tab-label:nth-last-child(1).mat-tab-label-active`));
        await BrowserVisibility.waitUntilElementIsVisible(expressionTab);
        return true;
    }

    async updateAndCloseMappingDialog() {
        const updateButton = element(by.css(`[data-automation-id="mapping-update-button"]`));
        await BrowserActions.click(updateButton);
    }

    async closeMappingDialog() {
        const updateButton = element(by.css(`[data-automation-id="mapping-close-button"]`));
        await BrowserActions.click(updateButton);
    }

    async selectVariable(variableName: string) {
        const processVariable = element.all(by.cssContainingText('.mat-option-text', variableName)).first();

        await BrowserActions.click(processVariable);
    }

    async deleteMappingRow(index: number) {
        const deleteButton = element(by.css(`[data-automation-id="delete-row-button-${index}"]`));
        await BrowserActions.click(deleteButton);
    }

    async addMappingRow() {
        const deleteButton = element(by.css(`[data-automation-id="add-variable-button"]`));
        await BrowserActions.click(deleteButton);
    }

    async isRightSideEmpty() {
        const rightSide = element(by.css(`div.mapping-value-form`));
        await BrowserVisibility.waitUntilElementIsNotPresent(rightSide);
        return true;
    }

    async isMappingTableEmpty() {
        const mappingTableRows = element.all(by.css(`div.mapping-table-viewer.output-mapping-table mat-row`));
        return (await mappingTableRows).length === 0;
    }
}
