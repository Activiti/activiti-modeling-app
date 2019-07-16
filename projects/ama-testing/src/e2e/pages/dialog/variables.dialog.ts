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
import { GenericDialog } from '../common/generic.dialog';
import { Calendar } from '../calendar';

export class VariablesDialog extends GenericDialog {

    readonly variablesDialog = element(by.css(`[data-automation-id="variables-dialog"]`));
    readonly variablesDialogTitleIcon = element(by.cssContainingText(`.mat-dialog-title mat-icon`, 'layers'));
    readonly add = element(by.css(`[data-automation-id="add-variable"]`));
    readonly delete = element(by.css(`[data-automation-id="delete-variable"]`));
    readonly name = element(by.css(`[data-automation-id="variable-name"]`));
    readonly type = element(by.css(`[data-automation-id="variable-type"]`));
    readonly value = element(by.css(`[data-automation-id="variable-value"]`));
    readonly datePicker = element(by.className('mat-datepicker-toggle'));
    readonly required = element(by.css(`[data-automation-id="variable-required"]`));
    readonly nameCell = element(by.css(`[data-automation-id="variable-name-cell"]`));
    readonly typeCell = element(by.css(`[data-automation-id="variable-type-cell"]`));
    readonly valueCell = element(by.css(`[data-automation-id="variable-value-cell"]`));
    readonly requiredCell = element(by.css(`[data-automation-id="variable-required-cell"]`));
    readonly propertiesViewer = element(by.id(`mat-tab-label-0-0`));
    readonly codeEditor = element(by.id(`mat-tab-label-1-1`));
    readonly updateButton = element(by.css(`[data-automation-id="update-button"]`));
    readonly closeButton = element(by.css(`[data-automation-id="close-button"]`));

    readonly calendar = new Calendar();

    async isLoaded() {
        await super.waitForElementToBeVisible(this.variablesDialog);
        return true;
    }

    async isTitleIconDisplayed() {
        await super.waitForElementToBeVisible(this.variablesDialogTitleIcon);
        return true;
    }

    async addVariable() {
        await super.click(this.add);
    }

    async setVariableName(name: string) {
        await super.clear(this.name);
        await super.sendKeysIfVisible(this.name, name);
    }

    async setVariableType(type: string) {
        await super.click(this.type);
        const varTypeOption = element(by.cssContainingText('.mat-option-text', type));
        await super.click(varTypeOption);
    }

    async setBooleanVariableValue(value: string) {
        await super.click(this.value);
        const varValueOption = element(by.cssContainingText('.mat-option-text', value));
        await super.click(varValueOption);
    }

    async setDateVariableValue() {
        await super.click(this.datePicker);
        await this.calendar.isDisplayed();
        await this.calendar.setToday();
    }

    async setVariableValue(value: string) {
        await super.sendKeysIfVisible(this.value, value);
    }

    async setRequired(required: boolean = false) {
        if ( required ) {
            await super.click(this.required);
        }
    }
    async setVariable(name: string = 'name', type: string = 'string', value: string  = '', required: boolean = false) {
        await this.setVariableName(name);
        await this.setVariableType(type);

        if ( type === 'boolean' ) {
            await this.setBooleanVariableValue(value);
        } else if ( type === 'date' ) {
            await this.setDateVariableValue();
        } else {
            await this.setVariableValue(value);
        }
    }

    async getVariableValue() {
        return await this.value.getText();
    }

    async isFormVariableDisplayed(rowIndex: number, name: string = 'name', type: string = 'string', value: string = '', required?: string) {
        let valueCell;
        const variableRow = `[data-automation-id*="variable-row-${rowIndex}"]`;

        const nameCell = element(by.css(`${variableRow}>[data-automation-id="variable-name-cell-${name}"]`));
        await super.waitForElementToBeVisible(nameCell);

        const typeCell = element(by.css(`${variableRow}>[data-automation-id="variable-type-cell-${type}"]`));
        await super.waitForElementToBeVisible(typeCell);

        if (required !== null && typeof required !== 'undefined') {
            const requiredCell = element(by.css(`${variableRow}>[data-automation-id="variable-required-cell-${required}"]`));
            await super.waitForElementToBeVisible(requiredCell);
        }

        if ( type !== 'string' && value === '' ) {
            valueCell = element(by.css(`${variableRow}>[data-automation-id="variable-value-cell-undefined"]`));
        } else {
            valueCell = element(by.css(`${variableRow}>[data-automation-id="variable-value-cell-${value}"]`));
        }
        await super.waitForElementToBeVisible(valueCell);

        return true;
    }

    async isVariableDisplayed(rowIndex: number, name: string = 'name', type: string = 'string', value: string = '', required: string = 'false') {
        return await this.isFormVariableDisplayed(rowIndex, name, type, value, required);
    }

    async goToPropertiesViewer() {
        await super.click(this.propertiesViewer);
    }

    async goToCodeEditor() {
        await super.click(this.codeEditor);
    }

    async getVariableIdByRow(rowIndex: number) {
        const rowLocator = `variable-row-${rowIndex}`;
        const variableRow = element(by.css(`[data-automation-id*="${rowLocator}"]`));
        const attr = await variableRow.getAttribute('data-automation-id');

        return attr.substring(rowLocator.length + 1);
    }

    async update() {
        await super.click(this.updateButton);
    }

    async close() {
        await super.click(this.closeButton);
        await super.isDialogDismissed();
    }
}
